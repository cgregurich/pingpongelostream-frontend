<script setup>
import { ref, reactive, computed } from 'vue'
import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';

const props = defineProps({
  playerID: Number,
  seasonID: Number,
});

const stats = reactive({});
const singlesTeamID = ref(null);
const games = reactive([]);
const team = reactive({});

async function loadStats() {
  const response = await axios.get(`${API_URL}/players/${props.playerID}/teams/singles/ranking/season/${props.seasonID}`);
  if (response.status === 200) {
    const fetchedStats = response.data.response;
    Object.assign(stats, fetchedStats);
  }
}

async function loadSinglesTeamID() {
  const response = await axios.get(`${API_URL}/players/${props.playerID}/teams/singles`);
  if (response.status === 200) {
    singlesTeamID.value = response.data.response.team_id;
  }
}

async function loadGames() {
  const response = await axios.get(`${API_URL}/teams/${singlesTeamID.value}/games/${props.seasonID}`);
  if (response.status === 200) {
    const fetchedGames = response.data.response.games;
    const fetchedTeam = response.data.response.team;
    Object.assign(games, fetchedGames);
    Object.assign(team, fetchedTeam);
  }
}

const gamesPlayed = computed(() => games.length);

const winRate = computed(() => {
  const gamesWon = games.filter(game => game.given_team.set_score > game.opponent_team.set_score).length;
  return Math.round((gamesWon / gamesPlayed.value) * 100);
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