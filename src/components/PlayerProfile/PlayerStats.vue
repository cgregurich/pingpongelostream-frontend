<script setup>
import { ref, reactive, computed, onBeforeUpdate, watch } from 'vue'
import * as apiCalls from '@/utils/apiCalls.js';

const props = defineProps({
  playerID: Number,
  seasonID: Number,
});

const stats = reactive({});
const singlesTeamID = ref(null);
const games = reactive([]);

async function loadStats() {
  const fetchedStats = await apiCalls.getPlayerStats(props.playerID, props.seasonID);
  if (fetchedStats) {
    Object.assign(stats, fetchedStats);
    return true;
  }
  else return false;
}

async function loadSinglesTeamID() {
  const fetchedTeamID = await apiCalls.getPlayerSinglesTeamID(props.playerID);
  if (fetchedTeamID) singlesTeamID.value = fetchedTeamID;
}

async function loadGames() {
  const fetchedGames = await apiCalls.getGamesForTeam(singlesTeamID.value, props.seasonID);
  if (fetchedGames) Object.assign(games, fetchedGames);
}

const gamesPlayed = computed(() => games.length);

const winRate = computed(() => {
  const gamesWon = games.filter(game => game.given_team.set_score > game.opponent_team.set_score).length;
  const winRate = Math.round((gamesWon / gamesPlayed.value) * 100);
  if (isNaN(winRate)) return 0;
  else return winRate;
});

async function loadData() {
  loadStats();
  await loadSinglesTeamID();
  await loadGames();
}

await loadData();

</script>


<template>
  <div class="stats flex justify-around w-3/6 max-w-[600px] mt-8">
    <div class="stat-container flex flex-col items-center justify-center text-center mx-4">
      <div class="stat-data font-semibold text-2xl">#{{ stats.ranking }}</div>
      <div class="stat-label">Current Ranking</div>
    </div>
    <div class="stat-container flex flex-col items-center justify-center text-center mx-4">
      <div class="stat-data font-semibold text-2xl">{{ stats.elo }}</div>
      <div class="stat-label">Current Elo</div>
    </div>
    <div class="stat-container flex flex-col items-center text-center mx-4">
      <div class="stat-data font-semibold text-2xl">{{ gamesPlayed }}</div>
      <div class="stat-label">Games Played</div>
    </div>
    <div class="stat-container flex flex-col items-center text-center mx-4">
      <div class="stat-data font-semibold text-2xl">{{ winRate }}%</div>
      <div class="stat-label">Win Rate</div>
    </div>
  </div>
</template>