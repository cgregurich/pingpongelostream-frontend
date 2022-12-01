<script setup>
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import PlayerCard from '@/components/CreateGame/PlayerCard.vue';
import PlayerCardSkeleton from '@/components/CreateGame/PlayerCardSkeleton.vue';

import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import * as toasts from '@/utils/toasts.js';
import * as apiCalls from '@/utils/apiCalls.js';

const router = useRouter();

const disableInput = ref(false);
const gameModes = reactive([]);
const players = reactive([]);


onMounted(async () => {
  disableInput.value = true;
  
  await Promise.all([loadGameModes(), loadPlayers()]);

  disableInput.value = false;

  // setUp(); // FIXME: just used for testing
});

async function loadGameModes() {
  const fetchedGameModes = await apiCalls.getGameModes();
  if (!fetchedGameModes) {
    toasts.somethingWentWrong();
    return;
  }
  Object.assign(gameModes, fetchedGameModes);
}

async function loadPlayers() {
  const fetchedPlayers = await apiCalls.getAllPlayers();
  if (!fetchedPlayers) {
    toasts.somethingWentWrong();
    return;
  }
  Object.assign(players, fetchedPlayers);
}

const selectedGameModeID = ref(1);
const addPlayerInput = ref('');

const selectedGameMode = computed(() => gameModes.filter(gm => gm.id === selectedGameModeID.value)[0]);

const unassignedPlayers = reactive([]);
const teamOnePlayers = reactive([]);
const teamTwoPlayers = reactive([]);



function setUp() { // start with some players in the unassigned; used for testing
  unassignedPlayers.push(getPlayer('alex wissing'));
  unassignedPlayers.push(getPlayer('colin gregurich'));
  unassignedPlayers.push(getPlayer('terrah quinlan'));
  unassignedPlayers.push(getPlayer('kelvin chin'));
}

function reset() {
  // Use splice since it's a reactive array and simply doing `= []` doesn't work
  unassignedPlayers.splice(0);
  teamOnePlayers.splice(0);
  teamTwoPlayers.splice(0);
}

function changeGameMode(gameModeID) {
  if (disableInput.value) return;
  selectedGameModeID.value = gameModeID;
}

function getPlayer(search) {
  // Tries to find player where search matches name or email
  let player = players.filter(player => player.name.toLowerCase() === search.toLowerCase() || player.email.toLowerCase() === search.toLowerCase())[0];
  return player;
}

function addPlayerToUnassigned() {
  if (disableInput.value) return;
  const player = getPlayer(addPlayerInput.value);
  if (canAddPlayer(player)) {
    unassignedPlayers.push(player);
    addPlayerInput.value = '';
  }
}

function canAddPlayer(player) {
  /*
  Checks that the given player can be valid. Valid if not null and isn't duplicate
  */
  return player != null && !unassignedPlayers.includes(player) && !teamTwoPlayers.includes(player) && !teamOnePlayers.includes(player);
}

function moveToTeamOne(player) {
  if (disableInput.value) return;

  if (teamOnePlayers.length >= playersAllowedPerTeam.value) {
    // If user trying to add a second player to a team when game mode is singles,
    // change game mode to doubles and then move the player
    if (selectedGameModeID.value === 1) selectedGameModeID.value = 2;

    // If user trying to add a third player to a team when game mode is doubles,
    // just return because this isn't allowed
    else if (selectedGameModeID.value === 2) return;
  }

  deletePlayer(player);
  teamOnePlayers.push(player);
}

function moveToTeamTwo(player) {
  if (disableInput.value) return;

  if (teamTwoPlayers.length >= playersAllowedPerTeam.value) {
    // If user trying to add a second player to a team when game mode is singles,
    // change game mode to doubles and then move the player
    if (selectedGameModeID.value === 1) selectedGameModeID.value = 2;

    // If user trying to add a third player to a team when game mode is doubles,
    // just return because this isn't allowed
    else if (selectedGameModeID.value === 2) return;
  }

  deletePlayer(player);
  teamTwoPlayers.push(player);
}

function moveToUnassigned(player) {
  if (disableInput.value) return;
  deletePlayer(player);
  unassignedPlayers.push(player);
}

function deletePlayer(player) {
  if (disableInput.value) return;
  if (teamOnePlayers.includes(player)) {
    const indexToDelete = teamOnePlayers.indexOf(player);
    teamOnePlayers.splice(indexToDelete, 1);
  }
  else if (teamTwoPlayers.includes(player)) {
    const indexToDelete = teamTwoPlayers.indexOf(player);
    teamTwoPlayers.splice(indexToDelete, 1);
  }
  else if (unassignedPlayers.includes(player)) {
    const indexToDelete = unassignedPlayers.indexOf(player);
    unassignedPlayers.splice(indexToDelete, 1);
  }
}

const totalPlayers = computed(() => unassignedPlayers.length + teamOnePlayers.length + teamTwoPlayers.length);
const playersAllowedPerTeam = computed(() => selectedGameMode.value?.player_per_team_count || 0);

watch(playersAllowedPerTeam, () => {
  /*
  Watch for playersAllowedPerTeam to change, and if the number of players on a team
  is greater than the new playersAllowedPerTeam, we need to move the overflow
  of players back to unassigned.
  */
  let extraPlayers = null;
  if (teamOnePlayers.length > playersAllowedPerTeam.value) {
    // Starting at the first "overflow" player, splice to the end of the players
    extraPlayers = teamOnePlayers.splice(playersAllowedPerTeam.value, teamOnePlayers.length - playersAllowedPerTeam.value);
    // Then move each of these players to unassigned 
    extraPlayers.forEach(player => moveToUnassigned(player));
  }
  // Same as above, but for team two
  if (teamTwoPlayers.length > playersAllowedPerTeam.value) {
    extraPlayers = teamTwoPlayers.splice(playersAllowedPerTeam.value, teamTwoPlayers.length - playersAllowedPerTeam.value);
    extraPlayers.forEach(player => moveToUnassigned(player));
  }
});

const canCreateGame = computed(() => {
  return teamOnePlayers.length === playersAllowedPerTeam.value && teamTwoPlayers.length === playersAllowedPerTeam.value;
});



async function createGameClicked(playImmediately) {
  /*
  Function used for both 'Schedule Game' and 'Start Game' button.
  arg playImmediately is what differentiates the two buttons
  */
  disableInput.value = true;
  toasts.creatingGame();

  let gameID;
  if (!canCreateGame.value) { 
    return;
  }
  if (selectedGameMode.value.id === 1) {
    // singles
    gameID = await createSinglesGame();
    if (gameID) toasts.gameCreated();
    else toasts.createGameFailed();
  }
  else if (selectedGameMode.value.id === 2) {
    // doubles
    gameID = await createDoublesGame();
    if (gameID) toasts.gameCreated();
    else toasts.createGameFailed();

  }
  disableInput.value = false;
  reset();

  // Go to PlayGame page with the newly created game if it's what the user chose
  if (playImmediately && gameID != null) {
    router.push({ name: 'Play', params: { gameID: gameID } });
  }
}


async function createSinglesGame() {
  const teamOneID = await apiCalls.getPlayerSinglesTeamID(teamOnePlayers[0].id);
  const teamTwoID = await apiCalls.getPlayerSinglesTeamID(teamTwoPlayers[0].id);

  if (!teamOneID || !teamTwoID) {
    toasts.somethingWentWrong();
    return null;
  }
  const teamOneFirstServerID = teamOnePlayers[0].id;
  const teamTwoFirstServerID = teamTwoPlayers[0].id;
  const firstServer = 'team1';

  const gameData = {
    mode_id: selectedGameModeID.value,
    team1_id: teamOneID,
    team2_id: teamTwoID,
    team1_first_server_id: teamOneFirstServerID,
    team2_first_server_id: teamTwoFirstServerID,
    first_server: firstServer,
  };

  const gameID = await apiCalls.createGame(gameData);
  return gameID;
}

async function createDoublesGame() {
  const teamOnePlayerIDs = teamOnePlayers.map(p => p.id);
  const teamTwoPlayerIDs = teamTwoPlayers.map(p => p.id);

  // Try to get team ID if team already exists with given players
  // These api calls will return team ID if a team with players exist
  // or will return -1 if no team exists, or null if the request didn't work
  let teamOneID = await apiCalls.getTeamIDWithPlayers(teamOnePlayerIDs);
  let teamTwoID = await apiCalls.getTeamIDWithPlayers(teamTwoPlayerIDs);

  if (!teamOneID || !teamTwoID) return null;

  // If team doesn't exist, make a new one
  if (teamOneID === -1) teamOneID = await apiCalls.createNewTeam(teamOnePlayerIDs);
  if (teamTwoID === -1) teamTwoID = await apiCalls.createNewTeam(teamTwoPlayerIDs);

  if (!teamOneID || !teamTwoID) return null;


  const teamOneFirstServerID = teamOnePlayers[0].id; // FIXME: just taking the first player for now
  const teamTwoFirstServerID = teamTwoPlayers[0].id; // FIXME: just taking the first player for now
  const firstServer = 'team1';

  const gameData = {
    mode_id: selectedGameModeID.value,
    team1_id: teamOneID,
    team2_id: teamTwoID,
    team1_first_server_id: teamOneFirstServerID,
    team2_first_server_id: teamTwoFirstServerID,
    first_server: firstServer
  };
  
  const gameID = await apiCalls.createGame(gameData);
  return gameID;
}



const addablePlayersNames = computed(() => {
  return players.filter(p => canAddPlayer(p)).map(p => p.name);
});


</script>


<template>
<div class="create-game flex flex-col h-[calc(100vh-4rem-1px)]">
  <!-- Controls -->
  <div class="controls flex justify-between m-8">
    <!-- Game Mode Selector -->
    <div class="game-mode-selector flex justify-center items-center bg-site-color-one text-black shadow-sm rounded-lg shadow-gray-300 border border-black border-site-color-two border-opacity-30" :class="disableInput ? ['opacity-50', 'cursor-not-allowed'] : ''">
      <button v-for="gameMode in gameModes" :key="gameMode.id" @click="changeGameMode(gameMode.id)" class="px-4 py-3 h-full first:rounded-l-lg last:rounded-r-lg" :class="selectedGameModeID === gameMode.id ? ['bg-site-color-two', 'text-white'] : ''">{{ gameMode.name }}</button>
    </div>
    <!-- Add Player -->
    <div class="add-player flex justify-center items-center border-0 border-red-400 w-[400px]">
      <v-select class="w-full" @keydown.enter="addPlayerToUnassigned" :options="addablePlayersNames" v-model="addPlayerInput"></v-select>
      <PrimaryButton @click="addPlayerToUnassigned" text="Add Player" :disabled="disableInput" class="text-xs whitespace-nowrap ml-4"/>
    </div>
    <!-- Create Game Button -->
    <div class="create-game flex justify-center items-center">
      <PrimaryButton @click="createGameClicked(true)" :disabled="!canCreateGame || disableInput" text="Start Game" class="mr-4"/>
      <PrimaryButton @click="createGameClicked(false)" :disabled="!canCreateGame || disableInput" text="Schedule Game" class=""/>
      

    </div>
  </div>
  
  <!-- Team Maker -->
  <div class="flex h-full overflow-hidden">
    <!-- Team One Container -->
    <div class="team-one flex flex-col items-center justify-start w-full h-full">
      <div class="team-name flex justify-center items-center text-2xl">Team One</div>
      <div class="players-container flex flex-col items-center justify-center w-5/6 h-5/6 mx-4">
        <div class="player" v-for="player in teamOnePlayers" :key="player.id">
          <PlayerCard :player="player" :team="1" @delete="deletePlayer(player)" @moveRight="moveToUnassigned(player)"/>
        </div>
        <div class="player-skeleton" v-for="i in playersAllowedPerTeam - teamOnePlayers.length" :key="i">
          <PlayerCardSkeleton />
        </div>
      </div>
    </div>

    <div class="divider bg-gray-400 w-[1px] mb-12"></div>

    <!-- Unassigned Players -->
    <div class="unassigned flex flex-col items-center justify-start w-full h-full overflow-auto">
      <div class="flex justify-center items-center text-2xl">Unassigned</div>
      <div class="players-container flex flex-col items-center justify-center">
        <div class="player" v-for="player in unassignedPlayers" :key="player.id">
          <PlayerCard :player="player" @delete="deletePlayer(player)" @moveLeft="moveToTeamOne(player)" @moveRight="moveToTeamTwo(player)"/>
        </div>
      </div>
    </div>

    <div class="divider bg-gray-400 w-[1px] mb-12"></div>

    <!-- Team Two Container -->
    <div class="team-two flex flex-col items-center justify-start w-full h-full">
      <div class="team-name flex justify-center items-center text-2xl">Team Two</div>
      <div class="players-container flex flex-col items-center justify-center w-5/6 h-5/6 mx-4">
        <div class="player" v-for="player in teamTwoPlayers" :key="player.id">
          <PlayerCard :player="player" :team="2" @delete="deletePlayer(player)" @moveLeft="moveToUnassigned(player)"/>
        </div>
        <div class="player-skeleton" v-for="i in playersAllowedPerTeam - teamTwoPlayers.length" :key="i">
          <PlayerCardSkeleton />
        </div>
      </div>
    </div>
  </div>
</div>
</template>