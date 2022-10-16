<script setup>
import { ref, reactive, computed, watch } from 'vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import TeamContainer from '@/components/PlayGame/TeamContainer.vue';



// Game states used to know what text to be displayed on the control button
// and when to allow user input for incrementing score
const GameStates = { NotStarted: 'not started', SetFinished: 'set finished', LastSetFinished: 'last set finished', GameOver: 'game over', InProgress: 'in progress' };
const POINTS_TO_WIN_SET = 11;
const WIN_SET_BY = 2;
const SETS_TO_WIN_MATCH = 2;

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
const server = ref(null);

const pointsTillServerSwap = ref(null);


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
  if (undoStack.length === 0 || gameState.value !== GameStates.InProgress) return;
  const lastPoint = undoStack.pop();
  if (lastPoint.player === 1) {
    p1SetScore.value--;
  }
  else if (lastPoint.player === 2) {
    p2SetScore.value--;
  }
  pointsTillServerSwap.value = lastPoint.pointsTillServerSwap;
  server.value = lastPoint.server;
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
  return p1SetScore.value >= POINTS_TO_WIN_SET && p1SetScore.value - p2SetScore.value >= WIN_SET_BY;
}
function playerTwoWonSet() {
  return p2SetScore.value >= POINTS_TO_WIN_SET && p2SetScore.value - p1SetScore.value >= WIN_SET_BY;
}


watch(pointsTillServerSwap, () => {
  if (pointsTillServerSwap.value === 0) {
    // Swap servers
    server.value = server.value === 1 ? 2 : 1;
    pointsTillServerSwap.value = pointsPerServe.value;
  }
});

const gameControlText = computed(() => {
  if (gameState.value === GameStates.NotStarted) return 'Start Game';
  else if (gameState.value === GameStates.InProgress) return 'Set in progress...';
  else if (gameState.value === GameStates.SetFinished) return 'Next Set';
  else if (gameState.value === GameStates.LastSetFinished) return 'Confirm Last Set Finished';
  else if (gameState.value === GameStates.GameOver) return 'Game Over';
});

const p1WonSets = computed(function() {
  return previousSets.filter(set => set.p1Score > set.p2Score);
});

const p2WonSets = computed(function() {
  return previousSets.filter(set => set.p2Score > set.p1Score);
});

const pointsPerServe = computed(() => {
  if (p1SetScore.value >= 10 && p2SetScore.value >= 10) return 1;
  else return 2;
});

const canUndo = computed(() => undoStack.length > 0 && gameState.value === GameStates.InProgress);

const allowScoreInput = computed(() => gameState.value === GameStates.InProgress);

</script>


<template>
  <div class="display flex flex-col items-center">
    <div class="controls flex justify-center items-center my-2">
      <font-awesome-icon
        @click="undoLastPoint"
        class="text-4xl mr-4"
        :class="canUndo ? 'text-black' : 'text-gray-300'"
        icon="arrow-rotate-left"
      />
      <PrimaryButton :disabled="gameState === GameStates.InProgress" class="text-xl" @click="controlButtonClicked" :text='gameControlText' />
    </div>
    <div class="container flex justify-center h-[500px] w-screen bg-yello-500">
      <TeamContainer
        @click="() => incrementScoreClicked(1)"
        :teamNumber="1"
        v-model:setScore="p1SetScore"
        v-model:gameScore="p1GameScore"
        :disabled="!allowScoreInput"
        :wonSets="p1WonSets"
        :server="server"
        :players="['Colin']"
      />
      <TeamContainer
        @click="() => incrementScoreClicked(2)"
        :teamNumber="2"
        v-model:setScore="p2SetScore"
        v-model:gameScore="p2GameScore"
        :disabled="!allowScoreInput"
        :wonSets="p2WonSets"
        :server="server"
        :players="['Bob']"
      />
    </div>
  </div>
</template>