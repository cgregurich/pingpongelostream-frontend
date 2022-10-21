<script setup>
import GameSummaryCard from '@/components/GameSummaryCard.vue';
import { ref, reactive, onMounted, computed, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';

const route = useRoute();
const player = reactive({});
const singlesTeamID = ref(null);
const stats = reactive({});
const games = reactive([]);
const team = reactive({});

const isLoading = ref(false);

// onMounted(async () => {
  // isLoading.value = true;
  // loadUser();
  // await loadSinglesTeamID();
  // loadStats();
  // await loadGames();
  // isLoading.value = false;
// });
async function loadShit() {
  isLoading.value = true;
  loadUser();
  await loadSinglesTeamID();
  loadStats();
  await loadGames();
  isLoading.value = false;
}

loadShit();



async function loadUser() {
  const playerID = route.params.id;
  const response = await axios.get(`${API_URL}/players/${playerID}`);
  if (response.status === 200) {
    const newPlayer = response.data.response.player;
    Object.assign(player, newPlayer);
  }
}

async function loadSinglesTeamID() {
  const playerID = route.params.id;
  const response = await axios.get(`${API_URL}/players/${playerID}/teams/singles`);
  if (response.status === 200) {
    singlesTeamID.value = response.data.response.team_id;
  }
}

async function loadStats() {
  const playerID = route.params.id;
  const seasonID = 1;
  const response = await axios.get(`${API_URL}/players/${playerID}/teams/singles/ranking/season/${seasonID}`);
  if (response.status === 200) {
    const newStats = response.data.response;
    Object.assign(stats, newStats);
  }
}

async function loadGames() {
  const playerID = route.params.id;
  const seasonID = 1;
  const response = await axios.get(`${API_URL}/teams/${singlesTeamID.value}/games/${seasonID}`);
  console.log(response);
  if (response.status === 200) {
    const fetchedGames = response.data.response.games;
    const fetchedTeam = response.data.response.team;
    Object.assign(games, fetchedGames);
    Object.assign(team, fetchedTeam);
  }
}

function getOpponentTeam(game) {
  const teamData = game.opponent_team.members.map(member => ({ name: member.name, profilePhotoPath: member.profile_photo_path }));
  return teamData;
}

function getScore(game) {
  const teamOne = game.given_team.set_score;
  const teamTwo = game.opponent_team.set_score;
  return { teamOne, teamTwo };
}

function getElos(game) {
  const elos = {
    teamOne: {
      elo: 2500,
      eloDiff: 439
    },
    teamTwo: {
      elo: 2342,
      eloDiff: -123
    }
  };
  return elos;
}

const selfTeam = computed(() => {
  const selfTeamData = team.members.map(member => ({ name: member.name, profilePhotoPath: member.profile_photo_path }));
  return selfTeamData;
});

const gamesPlayed = computed(() => games.length);
const winRate = computed(() => {
  const gamesWon = games.filter(game => game.given_team.set_score > game.opponent_team.set_score).length;
  return Math.round((gamesWon / gamesPlayed.value) * 100);
});

const singlesGames = computed(() => {
  return games.filter(game => game.opponent_team.members.length === 1);
});

</script>

<template>
	<body class="flex flex-col items-center bg-purple-400">
    
    <div v-if="isLoading" class="text-3xl text-red-400">LOADING</div>
    <!-- Username and Profile Pic -->

    
    <!-- With Data -->
		<div class="header flex items-center mt-4">
			<img class="profile-pic rounded-full w-44 shadow-2xl" :src="player.profile_photo_path">
			<div class="username ml-4 font-semibold text-2xl">{{ player.name }}</div>
      <!-- Skeleton -->
			<div v-if="isLoading" class="profile-pic rounded-full w-44 h-44 bg-gray-400 shadow-2xl"></div>
			<div v-if="isLoading" class="username ml-4 font-semibold text-2xl">Player Name</div>
		</div>

    <!-- Player Stats -->
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

    <!-- Recent Games -->
		<div class="recent-games max-w-[750px] w-full flex flex-col items-center px-6 mt-6">
			<div class="flex justify-between w-full">
				<div class="text-lg ml-2">Recent Games</div>
			</div>

      <!-- Recent Games -->
      <!-- Game Summary Card Skeleton -->
      <GameSummaryCard v-if="isLoading" :skeletons="true"/>
      <!-- Actual Game Summary Cards -->
      <GameSummaryCard
        v-for="game in singlesGames.slice(0, 3)"
        :key="game.id" 
        :teamOne="selfTeam"
        :teamTwo="getOpponentTeam(game)"
        :score="getScore(game)"
        :elos="getElos(game)"
        :skeletons="isLoading"
      />
			<div class="flex justify-end w-full">
				<div class="text-sm hover:underline cursor-pointer mt-1 mr-2">View Complete Game History</div>
			</div>
		</div>
	</body>
</template>
