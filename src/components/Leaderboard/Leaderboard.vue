<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import LeaderboardCard from '@/components/Leaderboard/LeaderboardCard.vue';
import LeaderboardHeader from '@/components/Leaderboard/LeaderboardHeader.vue';
import LeaderboardFooter from '@/components/Leaderboard/LeaderboardFooter.vue';
import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';

const gameMode = ref('singles');
const singlesTeams = reactive([]);
const doublesTeams = reactive([]);
onMounted(async () => {
  await fetchSinglesLeaderboard();
  await fetchDoublesLeaderboard();
});

async function fetchSinglesLeaderboard() {
  const response = await axios.get(`${API_URL}/leaderboards/singles`);
  // TODO: error checking
  const fetchedTeams = response.data.response.teams;
  Object.assign(singlesTeams, fetchedTeams);
}

async function fetchDoublesLeaderboard() {
  const response = await axios.get(`${API_URL}/leaderboards/doubles`);
  // TODO: error checking
  const fetchedTeams = response.data.response.teams;
  Object.assign(doublesTeams, fetchedTeams);
}

function gameModeChanged() {
  if (gameMode.value === 'singles') {

  }
}

const teams = computed(() => {
  if (gameMode.value === 'singles') return singlesTeams;
  else return doublesTeams;
});

</script>


<template>
<div class="leaderboard flex flex-col items-center mx-4">
  <h1 class="text-4xl">Leaderboard</h1>
  <select v-model="gameMode" @change="gameModeChanged">
    <option value="singles">Singles</option>
    <option value="doubles">Doubles</option>
  </select>
  <table class="shadow-lg shadow-gray-400 rounded-lg">
    <LeaderboardHeader />
    <LeaderboardCard v-for="(team, index) in teams" :key="team.id" :team="team" :ranking="index + 1" />
    <LeaderboardFooter />
  </table>
</div>
</template>