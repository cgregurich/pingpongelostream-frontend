<script setup>
import { ref, reactive, computed, watch, onMounted, toRaw } from 'vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TeamContainer from '@/components/PlayGame/TeamContainer.vue';
import * as apiCalls from '@/utils/apiCalls.js';

const props = defineProps({
  gameID: Number
});

const game = reactive({});
const gameMode = reactive({});
const disableInput = ref(true);
onMounted(async () => {
  //TODO: put in apiCalls.js
  const fetchedGame = await apiCalls.getGame(props.gameID);
  if (!fetchedGame) console.err('Something went wrong fetching game');
  const fetchedGameMode = await apiCalls.getGameMode(fetchedGame.mode_id);
  if (!fetchedGameMode) console.err('Something went wrong fetching game mode');
  Object.assign(game, fetchedGame);
  Object.assign(gameMode, fetchedGameMode);
  setGameRules();
  disableInput.value = false;
});

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
}




// Game states used to know what text to be displayed on the control button
// and when to allow user input for incrementing score
const GameStates = { NotStarted: 'not started', SetFinished: 'set finished', LastSetFinished: 'last set finished', GameOver: 'game over', InProgress: 'in progress' };


// Keep track of previous finished sets in the match
const previousSets = reactive([]);

const undoStack = reactive([]);

const gameState = ref(GameStates.NotStarted);

// The number of points scored in the current set
const p1SetScore = ref(0);
const p2SetScore = ref(0);

// Number of sets won in the current game
const p1GameScore = ref(0);
const p2GameScore = ref(0);

// Which player is currently serving (1 or 2)
// plus 1 because backend uses 0 or 1
const server = ref(game.first_server + 1);

const pointsTillServerSwap = ref(null);


const teamOnePlayers = computed(() => {
  if (!game || !game.teams) return null;
  return game.teams[0].members.map(m => ({ name: m.name }));
});

const teamTwoPlayers = computed(() => {
  if (!game || !game.teams) return null;
  return game.teams[1].members.map(m => ({ name: m.name }));
});



function incrementScoreClicked(player) {
  if (gameState.value !== GameStates.InProgress) return;
  else pointScored(player);
}

function controlButtonClicked() {
  if (gameState.value === GameStates.NotStarted) startNewSet();
  else if (gameState.value === GameStates.InProgress) ;
  else if (gameState.value === GameStates.SetFinished) {
    saveFinishedSet();
    startNewSet();
  }
  else if (gameState.value === GameStates.LastSetFinished) confirmLastSetFinished();
}

function undoLastPoint() {
  if (!canUndo.value) return;
  const lastPoint = undoStack.pop();
  if (lastPoint.player === 1) {
    p1SetScore.value--;
  }
  else if (lastPoint.player === 2) {
    p2SetScore.value--;
  }
  pointsTillServerSwap.value = lastPoint.pointsTillServerSwap;
  server.value = lastPoint.server;
  gameState.value = GameStates.InProgress;
}

function startNewSet() {
  p1SetScore.value = 0;
  p2SetScore.value = 0;

  pickRandomServer(); // TODO: should this be random on a non-first set?
  pointsTillServerSwap.value = pointsPerServe.value;

  // empty undoStack; can't reassign to [] since it's const; can't use let since it's reactive
  undoStack.splice(0, undoStack.length);

  gameState.value = GameStates.InProgress;
}

function pickRandomServer() {
  server.value = Math.floor(Math.random() * 2 + 1);
}

function pointScored(player) {
  undoStack.push({ player: player, pointsTillServerSwap: pointsTillServerSwap.value, server: server.value });
  if (player === 1) { 
    p1SetScore.value++;
  }
  else if (player === 2) { 
    p2SetScore.value++;
  }
  pointsTillServerSwap.value--;

  if (isSetFinished()) { 
    if (isLastSet()) gameState.value = GameStates.LastSetFinished;
    else gameState.value = GameStates.SetFinished;
  }
}

function saveFinishedSet() {
  previousSets.push({ p1Score: p1SetScore.value, p2Score: p2SetScore.value });
  if (playerOneWonSet()) p1GameScore.value++;
  else if (playerTwoWonSet()) p2GameScore.value++;
}

function confirmLastSetFinished() {
  saveFinishedSet();
  gameState.value = GameStates.GameOver;
}

function isSetFinished() {
  return playerOneWonSet() || playerTwoWonSet();
}

function isLastSet() {
  if (p1GameScore.value + 1 === SETS_TO_WIN_MATCH && playerOneWonSet()) return true;
  else if (p2GameScore.value + 1 === SETS_TO_WIN_MATCH && playerTwoWonSet()) return true;
  else return false
}

function playerOneWonSet() {
  return p1SetScore.value >= POINTS_TO_WIN_SET&& p1SetScore.value - p2SetScore.value >= WIN_SET_BY;
}
function playerTwoWonSet() {
  return p2SetScore.value >= POINTS_TO_WIN_SET&& p2SetScore.value - p1SetScore.value >= WIN_SET_BY;
}


watch(pointsTillServerSwap, () => {
  if (pointsTillServerSwap.value === 0) {
    // Swap servers
    server.value = server.value === 1 ? 2 : 1;
    pointsTillServerSwap.value = pointsPerServe.value;
  }
});

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

const p1WonSets = computed(function() {
  return previousSets.filter(set => set.p1Score > set.p2Score);
});

const p2WonSets = computed(function() {
  return previousSets.filter(set => set.p2Score > set.p1Score);
});

const pointsPerServe = computed(() => {
  // If overtime, swap serves every 1 point
  // TODO: is this also true for doubles?
  if (p1SetScore.value >= 10 && p2SetScore.value >= 10) return 1;
  else return SERVE_SWITCH;
});

const canUndo = computed(() => undoStack.length > 0 && gameState.value !== GameStates.GameOver && gameState.value !== GameStates.NotStarted);

const allowScoreInput = computed(() => gameState.value === GameStates.InProgress);


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
        <PrimaryButton :disabled="disableInput" v-show="gameState !== GameStates.InProgress && gameState !== GameStates.GameOver" @click="controlButtonClicked" :text="gameControlText" />  
      </div>
    </div>

    <!-- Team Containers -->
    <div class="container flex justify-center h-full">
      <TeamContainer
        @click="() => incrementScoreClicked(1)"
        :teamNumber="1"
        v-model:setScore="p1SetScore"
        v-model:gameScore="p1GameScore"
        :disabled="!allowScoreInput"
        :wonSets="p1WonSets"
        :server="server"
        :players="teamOnePlayers"
      />
      <TeamContainer
        @click="() => incrementScoreClicked(2)"
        :teamNumber="2"
        v-model:setScore="p2SetScore"
        v-model:gameScore="p2GameScore"
        :disabled="!allowScoreInput"
        :wonSets="p2WonSets"
        :server="server"
        :players="teamTwoPlayers"
      />
    </div>
  </div>
</template>