<script setup>
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import PlayerCard from '@/components/CreateGame/PlayerCard.vue';
import PlayerCardSkeleton from '@/components/CreateGame/PlayerCardSkeleton.vue';
import SuggestionInput from '@/components/SuggestionInput.vue';
import { ref, reactive, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';

const isLoading = ref(false);
const players = reactive([]);

onMounted(async () => {
  isLoading.value = true;
  const response = await axios.get(`${API_URL}/players`);
  Object.assign(players, response.data.response.players);
  isLoading.value = false;
  // setUp(); // FIXME: just used for testing
});


const selectedGameModeID = ref(1);
const addPlayerInput = ref('');

const gameModes = reactive([
  {
    id: 1,
    name: 'Singles',
    players: 2,
    win_score: 11,
    set_count: 3, 
    serve_switch: 2,
  },
  {
    id: 2,
    name: 'Doubles',
    players: 4,
    win_score: 21,
    set_count: 3, 
    serve_switch: 5,
  }
]);

const selectedGameMode = computed(() => gameModes.filter(gm => gm.id === selectedGameModeID.value)[0]);

const unassignedPlayers = reactive([]);
const teamOnePlayers = reactive([]);
const teamTwoPlayers = reactive([]);



function setUp() { // FIXME: just used for testing
  unassignedPlayers.push(getPlayer('alex wissing'));
  unassignedPlayers.push(getPlayer('colin gregurich'));
  unassignedPlayers.push(getPlayer('terrah quinlan'));
  unassignedPlayers.push(getPlayer('kelvin chin'));
}

function toggleGameMode() {
  if (selectedGameModeID.value === 1) selectedGameModeID.value = 2;
  else selectedGameModeID.value = 1;
}

function getPlayer(search) {
  // Tries to find player where search matches name or email
  let player = players.filter(player => player.name.toLowerCase() === search.toLowerCase() || player.email.toLowerCase() === search.toLowerCase())[0];
  return player;
}

function addPlayerToUnassigned() {
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
  if (teamOnePlayers.length >= playersAllowedPerTeam.value) return;
  deletePlayer(player);
  teamOnePlayers.push(player);
}

function moveToTeamTwo(player) {
  if (teamTwoPlayers.length >= playersAllowedPerTeam.value) return;
  deletePlayer(player);
  teamTwoPlayers.push(player);
}

function moveToUnassigned(player) {
  deletePlayer(player);
  unassignedPlayers.push(player);
}

function deletePlayer(player) {
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
const playersAllowedPerTeam = computed(() => selectedGameMode.value?.players / 2 || 0);

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


function createGameClicked() {
  if (!canCreateGame.value) { 
    console.log('Can\'t create game!!');
    return;
  }
  if (selectedGameMode.value.id === 1) {
    // singles
    createSinglesGame();
  }
  else if (selectedGameMode.value.id === 2) {
    // doubles
    createDoublesGame();
  }

}

async function createSinglesGame() {
  const teamOneID = await getPlayerOneSinglesTeamID();
  const teamTwoID = await getPlayerTwoSinglesTeamID();
  const teamOneFirstServerID = teamOnePlayers[0].id;
  const teamTwoFirstServerID = teamTwoPlayers[0].id;
  const firstServer = 'team1'; // FIXME: is this even what the backend wants?


  // FIXME: need to grab token from store and use that
  const token = 'Bearer 5|PRYFiRWjiiAY6qPyxU9qPRdnT58zynUXPRHdiyad';

  const requestBody = {
    mode_id: selectedGameMode.value.id,
    team1_id: teamOneID,
    team2_id: teamTwoID,
    team1_first_server_id: teamOneFirstServerID,
    team2_first_server_id: teamTwoFirstServerID,
    first_server: 'team1',
  };
  const config = {
    headers: { Authorization: token}
  };
  const response = await axios.post(`${API_URL}/games`, requestBody, config);
  console.log(response);
}

async function createDoublesGame() {
  const teamOneID = await getTeamOneID();
  const teamTwoID = await getTeamTwoID();
  // FIXME: how to deal with teams? 
  const teamOneFirstServerID = teamOnePlayers[0].id; // FIXME: just taking the first player for now
  const teamTwoFirstServerID = teamTwoPlayers[0].id; // FIXME: just taking the first player for now
}

async function getPlayerOneSinglesTeamID() {
  // FIXME: only worrying about, and assuming, singles right now
  const response = await axios.get(`${API_URL}/players/${teamOnePlayers[0].id}/teams/singles`);
  return response.data.response.team_id;
}

async function getPlayerTwoSinglesTeamID() {
  // FIXME: only worrying about, and assuming, singles right now
  const response = await axios.get(`${API_URL}/players/${teamTwoPlayers[0].id}/teams/singles`);
  return response.data.response.team_id;

}

</script>

WILO 11/2:

got a basic post request to /api/games working. things to work on next:
- loader for create game button
- grab token from store instead of hardcoding
- toast notifications for "game created!"
- reset page after game created
- put api calls into store/utils file
- figure out doubles (will likely discuss this with alex tomorrow)
- think about how the user would like to proceed. Get sent to games index? get sent to "play game" with the just created game? have the page reset?
- 



<template>
<div class="create-game flex flex-col h-[calc(100vh-4rem-1px)]">
  <!-- Controls -->
  <div class="controls flex justify-between m-8">
    <!-- Game Mode Selector -->
    <div class="game-mode-selector flex justify-center items-center bg-site-color-one text-black shadow-sm shadow-gray-300 border border-gray-400">
      <button @click="toggleGameMode" class="px-4 py-3 h-full" :class="selectedGameModeID === 1 ? ['bg-site-color-two', 'text-white'] : ''">Singles</button>
      <button @click="toggleGameMode" class="px-4 py-3 h-full" :class="selectedGameModeID === 2 ? ['bg-site-color-two', 'text-white'] : ''">Doubles</button>
    </div>
    <!-- Add Player -->
    <div class="add-player flex justify-center items-center">
      <SuggestionInput :items="players.map(p => p.name)" @keydown.enter="addPlayerToUnassigned" v-model:enteredText="addPlayerInput"/>
      <!-- <TextInput @keydown.enter="addPlayerToUnassigned" v-model:enteredText="addPlayerInput" placeholder="Player's name or email"/> -->
      <PrimaryButton @click="addPlayerToUnassigned" text="Add Player" class="text-xs whitespace-nowrap ml-4"/>
    </div>
    <!-- Create Game Button -->
    <div class="create-game flex justify-center items-center">
      <PrimaryButton @click="createGameClicked" :disabled="!canCreateGame" text="Create Game" class="text-xs"/>
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
    <!-- Unassigned PlayerOnes -->
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