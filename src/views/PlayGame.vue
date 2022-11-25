<script setup>
import { ref, reactive, computed, watch, onMounted, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TeamContainer from '@/components/PlayGame/TeamContainer.vue';
import * as apiCalls from '@/utils/apiCalls.js';
import * as toasts from '@/utils/toasts.js';

/*

Variables used to manage the Play Game logic.
game - the game object being played. Contains gameMode id, players, sets, start/end dates, etc.
gameMode - gameMode object indicating what the rules of the game are. Fetched from backend using game's gameMode id
disableInput - disables input for the controls so when async calls are happening, or data is being fetched, the user can't mess things up
teamOnePlayers - array of player objects on team one
teamTwoPlayers - array of player objects on team two
currentSetPoints - an array that consists of <teamOneID> and <teamTwoID> in the order of points scored. Used to send game updates to the backend for the current set. On new sets, this is reset.

These are set when the gameMode is loaded, and shouldn't change during the course of the game. They exist to make reading the code a bit easier.
POINTS_TO_WIN_SET - the points needed for a set to be considered "finished", where the user will then be asked to click "next set"
WIN_SET_BY - the points advantage needed for a team to win the set. (Usually 2)
SETS_TO_WIN_GAME - sets needed for the game to be considered "finished", where the user will then be asked to click "finish game"
SERVE_SWITCH - The default number of points needed to be scored before the server is swapped. "default" because in overtime, this rule might be ignored in favor of switching server more frequently.

previousSets - The scores of previous, completed sets. Used to display the won sets for each team. Contains the teamOneScore and teamTwoScore for the set.
undoStack - Used for the undo functionality. Adds a new object each point with relevant information of the game state when that point was scored
gameState - Holds an enum indicating either NotStarted, InProgress, SetFinished, LastSetFinished, or GameOver
teamOneSetScore - Number of points for team one in the current set
teamTwoSetScore - Number of points for team two in the current set
teamOneGameScore - Number of sets won for team one in the game
teamTwoGameScore - Number of sets won for team two in the game
teamServing - 0 or 1 to indicate which team is currently serving



*/

const router = useRouter();

const props = defineProps({
  gameID: Number
});

/* 
Game states used to know what text to be displayed on the control button
and when to allow user input for incrementing score
*/
const GameStates = { NotStarted: 'not started', SetFinished: 'set finished', LastSetFinished: 'last set finished', GameOver: 'game over', InProgress: 'in progress' };


const game = reactive({});
const gameMode = reactive({});
const disableInput = ref(true);

const teamOnePlayers = ref([]);
const teamTwoPlayers = ref([]);

// Game rules
let POINTS_TO_WIN_SET = null;
let WIN_SET_BY = null;
let SETS_TO_WIN_GAME = null;
let SERVE_SWITCH = null;


const previousSets = reactive([]);

const undoStack = reactive([]);

const gameState = ref(GameStates.NotStarted);

// The number of points scored in the current set
const teamOneSetScore = ref(0);
const teamTwoSetScore = ref(0);

// Number of sets won in the game so far
const teamOneGameScore = ref(0);
const teamTwoGameScore = ref(0);

// 0 or 1, not team IDs
const teamServing = ref(null);

// 0 or 1, not player IDs
const teamOnePlayerServing = ref(0);
const teamTwoPlayerServing = ref(0);

/*
Array of teamIDs indicating who scored what points.
Eg. [1, 3, 3, 3, 1]
Team with ID 1 scored 1st and 5th point. Team with ID 3 scored 2nd, 3rd, and 4th
Used to send game progress to backend.
*/
const currentSetPoints = reactive([]);

const pointsTillServerSwap = ref(null);


onMounted(async () => {
  disableInput.value = true;

  if (!await loadGame()) {
    toasts.gameNotFound(() => router.push({ name: 'Games' }));
    return;
  }
  await loadGameMode();

  setGameRules();
  setTeamPlayers();
  setStartingServers();

  disableInput.value = false;
});


async function loadGame() {
  const fetchedGame = await apiCalls.getGame(props.gameID);
  if (!fetchedGame) return false;
  Object.assign(game, fetchedGame);
  return true;
}

async function loadGameMode() {
  const fetchedGameMode = await apiCalls.getGameMode(game.mode_id);
  if (!fetchedGameMode) console.error('Something went wrong fetching game mode');
  Object.assign(gameMode, fetchedGameMode);
}


function setGameRules() {
  // Set game rules from given game mode
  POINTS_TO_WIN_SET= gameMode.win_score;
  WIN_SET_BY = 2;
  SETS_TO_WIN_GAME = Math.ceil(gameMode.set_count / 2);
  SERVE_SWITCH = gameMode.serve_switch;

  teamServing.value = game.first_server;
}

function setTeamPlayers() {
  teamOnePlayers.value = game.teams[0].members;
  teamTwoPlayers.value = game.teams[1].members;
}

function setStartingServers() {
  /*
  Sets the variables used to know which players on each team is serving.
  Even though one team serves at a time, the non-serving team will still have
  a designated serving player so when the serve swaps, the other team will be
  ready to go.
  0 or 1 indicates which player on a given team is serving.
  */
  if (game.team1_first_server_id === game.teams[0].members[0].id) {
    teamOnePlayerServing.value = 0;
  }
  else teamOnePlayerServing.value = 1;

  if (game.team2_first_server_id === game.teams[1].members[0].id) {
    teamTwoPlayerServing.value = 0;
  }
  else teamTwoPlayerServing.value = 1;
}



/*
Keep track of previous finished sets in the match.
Contains objects that look like:
{ teamOneScore: <number>, teamTwoScore: <number> }
*/
const servingPlayerID = computed(() => {
  if (teamOnePlayers.value.length === 0 || teamTwoPlayers.value.length == 0) return;

  console.log('teamOnePlayerServing: ', teamOnePlayerServing.value);
  console.log('teamTwoPlayerServing: ', teamTwoPlayerServing.value);
  if (teamServing.value === 0) {
    console.log(teamOnePlayers.value);
    return teamOnePlayers.value[teamOnePlayerServing.value].id;
  }
  else if (teamServing.value === 1) {
    return teamTwoPlayers.value[teamTwoPlayerServing.value].id;
  }
});



watch(pointsTillServerSwap, () => {
  if (pointsTillServerSwap.value === 0) {
    changeServers();
    pointsTillServerSwap.value = pointsPerServer.value;
  }
});

function changeServers() {
  if (teamServing.value === 0) {
    teamServing.value = 1;

    // Change which player on the team is serving only if playing doubles
    if (gameMode.id === 2) {
      teamOnePlayerServing.value = teamOnePlayerServing.value === 0 ? 1 : 0;
    }
  }
  else if (teamServing.value === 1) {
    teamServing.value = 0;
    // Change which player on the team is serving only if playing doubles
    if (gameMode.id === 2) {
      teamTwoPlayerServing.value = teamTwoPlayerServing.value === 0 ? 1 : 0;
    }
  }
}

const pointsPerServer = computed(() => {
  // If overtime, switch server every 1 point
  if (teamOneSetScore.value >= gameMode.win_score - 1 && teamTwoSetScore.value >= gameMode.win_score - 1) {
    return 1;
  }
  // Otherwise, switch based on game mode's rules
  else return SERVE_SWITCH;
});


function incrementScoreClicked(teamID) {
  if (gameState.value !== GameStates.InProgress) return;
  else pointScored(teamID);
}

async function controlButtonClicked() {
  if (gameState.value === GameStates.NotStarted) {
    apiCalls.startGame(game.id);
    startNewSet();
  }

  // Set is over, but more sets need to be played before game is over
  else if (gameState.value === GameStates.SetFinished) {
    disableInput.value = true;
    toasts.submittingSet();
    if (await sendGameUpdate()) {
      toasts.setSubmitted();
      saveFinishedSet();
      startNewSet();
    }
    else {
      toasts.submittingSetFailed();
    }
    disableInput.value = false;
  }


  // Last set is over, so set and game needs to be submitted
  else if (gameState.value === GameStates.LastSetFinished) {
    disableInput.value = true;
    toasts.submittingGame();
    if (await sendFinalGameUpdate()) {
      toasts.gameSubmitted();
      confirmLastSetFinished();
    }
    else {
      toasts.submittingGameFailed();
    }
    disableInput.value = false;
  }
}

function undoLastPoint() {
  if (!canUndo.value) return;

  const lastPointSnapshot = undoStack.pop();
  if (lastPointSnapshot.teamID === teamOneID.value) {
    teamOneSetScore.value--;
  }
  else if (lastPointSnapshot.teamID === teamTwoID.value) {
    teamTwoSetScore.value--;
  }

  currentSetPoints.pop();

  // Revert all game state to state at snapshot
  pointsTillServerSwap.value = lastPointSnapshot.pointsTillServerSwap;
  teamServing.value = lastPointSnapshot.teamServing;
  teamOnePlayerServing.value = lastPointSnapshot.teamOnePlayerServing;
  teamTwoPlayerServing.value = lastPointSnapshot.teamTwoPlayerServing;
  gameState.value = GameStates.InProgress;
}

function startNewSet() {
  // Reset set scores
  teamOneSetScore.value = 0;
  teamTwoSetScore.value = 0;
  
  // Empty current set points and undo stack
  // must use splice(0) to empty reactive arrays
  currentSetPoints.splice(0);
  undoStack.splice(0);

  pointsTillServerSwap.value = pointsPerServer.value;

  // Assign serving team of new set
  if (previousSets.length % 2 === 0) {
    teamServing.value = game.first_server;
  }
  else {
    // If first_server is 1, teamServing should be 0
    // If first_server is 0, teamServing should be 1
    teamServing.value = Math.abs(game.first_server - 1);
  }




  gameState.value = GameStates.InProgress;
}


function pointScored(teamID) {

  currentSetPoints.push(teamID);

  // Add a snapshot of the current game state to the undo stack
  undoStack.push({
    teamID: teamID,
    pointsTillServerSwap: pointsTillServerSwap.value,
    teamServing: teamServing.value,
    teamOnePlayerServing: teamOnePlayerServing.value,
    teamTwoPlayerServing: teamTwoPlayerServing.value
  });

  if (teamID === teamOneID.value) { 
    teamOneSetScore.value++;
  }
  else if (teamID === teamTwoID.value) { 
    teamTwoSetScore.value++;
  }
  pointsTillServerSwap.value--;

  if (isSetFinished()) { 
    if (isLastSet()) gameState.value = GameStates.LastSetFinished;
    else gameState.value = GameStates.SetFinished;
  }
}

async function sendGameUpdate() {
  return await apiCalls.updateOngoingGame(game.id, previousSets.length + 1, toRaw(currentSetPoints));
}

async function sendFinalGameUpdate() {
  if (await sendGameUpdate()) {
    return await apiCalls.completeGame(game.id);
  }
  else {
    return null;
  }
}

function saveFinishedSet() {
  previousSets.push({ teamOneScore: teamOneSetScore.value, teamTwoScore: teamTwoSetScore.value });
  if (playerOneWonSet()) teamOneGameScore.value++;
  else if (playerTwoWonSet()) teamTwoGameScore.value++;
}

async function confirmLastSetFinished() {
  saveFinishedSet();
  gameState.value = GameStates.GameOver;
}

function isSetFinished() {
  return playerOneWonSet() || playerTwoWonSet();
}

function isLastSet() {
  if (teamOneGameScore.value + 1 === SETS_TO_WIN_GAME && playerOneWonSet()) return true;
  else if (teamTwoGameScore.value + 1 === SETS_TO_WIN_GAME && playerTwoWonSet()) return true;
  else return false
}

function playerOneWonSet() {
  return teamOneSetScore.value >= POINTS_TO_WIN_SET && teamOneSetScore.value - teamTwoSetScore.value >= WIN_SET_BY;
}
function playerTwoWonSet() {
  return teamTwoSetScore.value >= POINTS_TO_WIN_SET && teamTwoSetScore.value - teamOneSetScore.value >= WIN_SET_BY;
}



const gameControlText = computed(() => {
  /*
  The text to be displayed depending on the game state.
  */
  if (gameState.value === GameStates.NotStarted) return 'Start Game';
  else if (gameState.value === GameStates.InProgress) return 'Set in progress...';
  else if (gameState.value === GameStates.SetFinished) return 'Next Set';
  else if (gameState.value === GameStates.LastSetFinished) return 'End Game';
  else if (gameState.value === GameStates.GameOver) return 'Game Over';
});

const teamOneWonSets = computed(function() {
  return previousSets.filter(set => set.teamOneScore > set.teamTwoScore);
});

const teamTwoWonSets = computed(function() {
  return previousSets.filter(set => set.teamTwoScore > set.teamOneScore);
});


const canUndo = computed(() => undoStack.length > 0 && gameState.value !== GameStates.GameOver && gameState.value !== GameStates.NotStarted);

const allowScoreInput = computed(() => gameState.value === GameStates.InProgress);

const teamOneID = computed(() => game.teams[0].id);
const teamTwoID = computed(() => game.teams[1].id);

function test() {
  toasts.submittingSet();
}

</script>


<template>
  <div class="display flex flex-col items-center relative h-[calc(100vh-4rem-1px)]">
    <!-- Controls -->
    <div class="controls absolute z-20 right-0 left-0 mx-auto my-auto bottom-0 top-0 w-min h-min flex flex-col items-center justify-center">

      <!-- Undo Circle Button -->
      <button :disabled="!canUndo"
        class="group flex justify-center items-center text-2xl text-black hover:text-gray-700 active:text-gray-600 disabled:hover:text-opacity-20 disabled:hover:text-black disabled:text-opacity-20 rounded-full w-[50px] h-[50px] p-0 m-0 bg-white bg-opacity-100 backdrop-blur-lg shadow-sm shadow-gray-800"
        @click="undoLastPoint"
      >
        <font-awesome-icon
          icon="arrow-rotate-left"
          class="group-disabled:h-[1em] group-disabled:w-[1em] group-active:w-[1.1em] group-active:h-[1.1em] transition-all duration-75"
        />
      </button>

      <!-- Game Info Box -->
      <div class="flex justify-center items-center bg-opacity-30 mt-12 w-[150px] h-[75px] bg-white p-4 backdrop-blur-lg shadow-gray-700 shadow-sm rounded-xl" >
        <div v-show="gameState === GameStates.InProgress || gameState === GameStates.GameOver">{{ gameControlText }}</div>
        <PrimaryButton class="animate-pulse" :disabled="disableInput" v-show="gameState !== GameStates.InProgress && gameState !== GameStates.GameOver" @click="controlButtonClicked" :text="gameControlText" />  
      </div>
    </div>

    <!-- Team Containers -->
      <div class="container flex justify-center h-full">
        <TeamContainer
          @click="incrementScoreClicked(teamOneID)"
          :teamNumber="1"
          v-model:setScore="teamOneSetScore"
          v-model:gameScore="teamOneGameScore"
          :disabled="!allowScoreInput"
          :wonSets="teamOneWonSets"
          :servingPlayerID="servingPlayerID"
          :players="teamOnePlayers"
        />
        <TeamContainer
          @click="incrementScoreClicked(teamTwoID)"
          :teamNumber="2"
          v-model:setScore="teamTwoSetScore"
          v-model:gameScore="teamTwoGameScore"
          :disabled="!allowScoreInput"
          :wonSets="teamTwoWonSets"
          :servingPlayerID="servingPlayerID"
          :players="teamTwoPlayers"
        />
      </div>
  </div>
</template>