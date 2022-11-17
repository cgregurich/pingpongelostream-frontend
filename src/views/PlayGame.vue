<script setup>
import { ref, reactive, computed, watch, onMounted, toRaw } from 'vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TeamContainer from '@/components/PlayGame/TeamContainer.vue';
import * as apiCalls from '@/utils/apiCalls.js';

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

/*
Array of teamIDs indicating who scored what points.
Eg. [1, 3, 3, 3, 1]
Team with ID 1 scored 1st and 5th point. Team with ID 3 scored 2nd, 3rd, and 4th
Used to send game progress to backend.
*/
const currentSetPoints = reactive([]);


onMounted(async () => {
  disableInput.value = true;

  await loadGame();
  await loadGameMode();
  setGameRules();
  setTeamPlayers();

  disableInput.value = false;
});


async function loadGame() {
  const fetchedGame = await apiCalls.getGame(props.gameID);
  if (!fetchedGame) console.err('Something went wrong fetching game');
  Object.assign(game, fetchedGame);
}

async function loadGameMode() {
  const fetchedGameMode = await apiCalls.getGameMode(game.mode_id);
  if (!fetchedGameMode) console.err('Something went wrong fetching game mode');
  Object.assign(gameMode, fetchedGameMode);
}

// Game rules
let POINTS_TO_WIN_SET = null;
let WIN_SET_BY = null;
let SETS_TO_WIN_MATCH = null;
let SERVE_SWITCH = null;

function setGameRules() {
  // Set game rules from given game mode
  POINTS_TO_WIN_SET= gameMode.win_score;
  WIN_SET_BY = 2;
  SETS_TO_WIN_MATCH = Math.ceil(gameMode.set_count / 2);
  SERVE_SWITCH = gameMode.serve_switch;

  // plus 1 because of weirdness in the backend. 
  teamServing.value = game.first_server;
}

function setTeamPlayers() {
  teamOnePlayers.value = game.teams[0].members;
  teamTwoPlayers.value = game.teams[1].members;
}




/*
Keep track of previous finished sets in the match.
Contains objects that look like:
{ teamOneScore: <number>, teamTwoScore: <number> }
*/
const previousSets = reactive([]);

const undoStack = reactive([]);

const gameState = ref(GameStates.NotStarted);

// The number of points scored in the current set
const teamOneSetScore = ref(0);
const teamTwoSetScore = ref(0);

// Number of sets won in the game so far
const teamOneGameScore = ref(0);
const teamTwoGameScore = ref(0);

//FIXME: use the serving settings from backend; rn just hardcoding it
const teamServing = ref(null);
const teamOnePlayerServing = ref(0);
const teamTwoPlayerServing = ref(0);

const servingPlayerID = computed(() => {
  if (teamOnePlayers.value.length === 0 || teamTwoPlayers.value.length == 0) return;

  if (teamServing.value === 0) {
    return teamOnePlayers.value[teamOnePlayerServing.value].id;
  }
  else if (teamServing.value === 1) {
    return teamTwoPlayers.value[teamTwoPlayerServing.value].id;
  }
});


function pickRandomServer() {
  // teamServing is 0 or 1
  teamServing.value = Math.round(Math.random());

  /*
  teamXXXPlayerServing is 0 or 1
  */
  if (gameMode.id === 2) {
    // Only pick random servers within teams if playing doubles
    teamOnePlayerServing.value = Math.round(Math.random());
    teamTwoPlayerServing.value = Math.round(Math.random());
  }
}

const pointsTillServerSwap = ref(null);

watch(pointsTillServerSwap, () => {
  if (pointsTillServerSwap.value === 0) {
    changeServers();
    pointsTillServerSwap.value = pointsPerServer.value;
  }
});

function changeServers() {
  /*
  Keep in mind that the backend uses 1 and 2 for the two teams, but for the
  teamXXXPlayerServing I use 0 or 1, since it'll be used as an index.
  So in one case, numbers mean one-based, and in another it's zero-based.
  */
  if (teamServing.value === 0) {
    teamServing.value = 1;

    // Change which player on the team is serving only if playing doubles
    if (gameMode.id === 2) {
      teamOnePlayerServing.value = teamOnePlayerServing.value === 0 ? 1 : 0;
    }
  }
  else if (teamServing.value === 1) {
    teamServing.value = 0;
    // Change whihc player on the team is serving only if playing doubles
    if (gameMode.id === 2) {
      teamTwoPlayerServing.value = teamTwoPlayerServing.value === 0 ? 1 : 0;
    }
  }
}

const pointsPerServer = computed(() => {
  // If overtime, switch server every 1 point
  if (teamOneSetScore.value >= 10 && teamTwoSetScore.value >= 10) return 1;
  // Otherwise, switch based on game mode's rules
  else return SERVE_SWITCH;
});


function incrementScoreClicked(teamID) {
  if (gameState.value !== GameStates.InProgress) return;
  else pointScored(teamID);
}

function controlButtonClicked() {
  if (gameState.value === GameStates.NotStarted) {
    apiCalls.startGame(game.id);
    startNewSet();
  }
  else if (gameState.value === GameStates.InProgress) ;
  else if (gameState.value === GameStates.SetFinished) {
    saveFinishedSet();
    pickRandomServer();
    startNewSet();
  }
  else if (gameState.value === GameStates.LastSetFinished) confirmLastSetFinished();
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
  teamOneSetScore.value = 0;
  teamTwoSetScore.value = 0;
  
  // must use splice(0) to empty reactive arrays
  currentSetPoints.splice(0);
  undoStack.splice(0);

  pointsTillServerSwap.value = pointsPerServer.value;


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

function saveFinishedSet() {
  sendGameUpdate();
  previousSets.push({ teamOneScore: teamOneSetScore.value, teamTwoScore: teamTwoSetScore.value });
  if (playerOneWonSet()) teamOneGameScore.value++;
  else if (playerTwoWonSet()) teamTwoGameScore.value++;
}

function confirmLastSetFinished() {
  saveFinishedSet();
  console.log('calling complete game');
  apiCalls.completeGame(game.id);
  gameState.value = GameStates.GameOver;
}

function isSetFinished() {
  return playerOneWonSet() || playerTwoWonSet();
}

function isLastSet() {
  if (teamOneGameScore.value + 1 === SETS_TO_WIN_MATCH && playerOneWonSet()) return true;
  else if (teamTwoGameScore.value + 1 === SETS_TO_WIN_MATCH && playerTwoWonSet()) return true;
  else return false
}

function playerOneWonSet() {
  return teamOneSetScore.value >= POINTS_TO_WIN_SET&& teamOneSetScore.value - teamTwoSetScore.value >= WIN_SET_BY;
}
function playerTwoWonSet() {
  return teamTwoSetScore.value >= POINTS_TO_WIN_SET&& teamTwoSetScore.value - teamOneSetScore.value >= WIN_SET_BY;
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

</script>


<template>
  <div>currentSetPoints: {{ currentSetPoints }}</div>
  <div>teamOneWonSets: {{ teamOneWonSets }}</div>
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