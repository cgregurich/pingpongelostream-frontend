<script setup>
import GameSummaryCard from '@/components/GameSummaryCard.vue';
import GameSummaryCard2 from '@/components/GameSummaryCard2.vue';
import { ref, reactive, onMounted, computed, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';


const matchData1 = {
  p1: {
    username: 'david.j123',
    eloDiff: 64,
    elo: '2500',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/27.jpg',
    finalScore: 11,
  },
  p2: {
    username: 'pianoman90',
    eloDiff: -29,
    elo: '1243',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/11.jpg',
    finalScore: 10
  }
};

const matchData2 = {
  p1: {
    username: 'david.j123',
    eloDiff: -143,
    elo: '2436',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/27.jpg',
    finalScore: 1,
  },
  p2: {
    username: 'bshizzlexx',
    eloDiff: 198,
    elo: '1775',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/0.jpg',
    finalScore: 11
  }
};

const matchData3 = {
  p1: {
    username: 'david.j123',
    eloDiff: 89,
    elo: '2579',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/27.jpg',
    finalScore: 11,
  },
  p2: {
    username: 'fir3start3r',
    eloDiff: -76,
    elo: '2105',
    avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/male/54.jpg',
    finalScore: 6
  }
};
const match1 = ref(matchData1);
const match2 = ref(matchData2);
const match3 = ref(matchData3);

/**************************************
  Hard-coded data for matches above
**************************************/
const route = useRoute();
const player = reactive({});
const teamID = ref(null);
const stats = reactive({});
const games = reactive([]);
const team = reactive({});

onMounted(async () => {
  loadUser();
  await loadTeamID();
  loadStats();
  loadGames();
});



async function loadUser() {
  const playerID = route.params.id;
  const response = await axios.get(`${API_URL}/players/${playerID}`);
  if (response.status === 200) {
    const newPlayer = response.data.response.player;
    Object.assign(player, newPlayer);
  }
}

async function loadTeamID() {
  const playerID = route.params.id;
  const response = await axios.get(`${API_URL}/players/${playerID}/teams/singles`);
  if (response.status === 200) {
    teamID.value = response.data.response.team_id;
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
  const response = await axios.get(`${API_URL}/teams/${teamID.value}/games/${seasonID}`);
  console.log(response);
  if (response.status === 200) {
    const fetchedGames = response.data.response.games;
    const fetchedTeam = response.data.response.team;
    Object.assign(games, fetchedGames);
    Object.assign(team, fetchedTeam);
  }
}

function getOpponentTeam(index) {
  const opponentTeam = games[index]?.opponent_team;
  if (!opponentTeam) return;
  const teamData = opponentTeam.members.map(member => ({ name: member.name, profilePhotoPath: member.profile_photo_path }));
  return teamData;
}

const selfTeam = computed(() => {
  if (!toRaw(team)) return;
  const selfTeamData = team.members?.map(member => ({ name: member.name, profilePhotoPath: member.profile_photo_path }));
  return selfTeamData;
});

</script>

<template>
	<body class="flex flex-col items-center">
    {{ team }}
		<div class="header flex items-center mt-4">
			<img class="profile-pic rounded-full w-44 shadow-2xl" :src="player.profile_photo_path">
			<div class="username ml-4 font-semibold text-2xl">{{ player.name }} teamID: {{ teamID }}</div>
		</div>
		<div class="stats flex justify-around w-3/6 mt-8">
			<div class="stat-container flex flex-col items-center justify-center text-center">
				<div class="stat-data font-semibold text-2xl">#{{ stats.ranking }}</div>
				<div class="stat-label">Current Ranking</div>
			</div>
			<div class="stat-container flex flex-col items-center justify-center text-center">
				<div class="stat-data font-semibold text-2xl">{{ stats.elo }}</div>
				<div class="stat-label">Current Elo</div>
			</div>
			<div class="stat-container flex flex-col items-center text-center">
				<div class="stat-data font-semibold text-2xl">123</div>
				<div class="stat-label">Matches Played</div>
			</div>
			<div class="stat-container flex flex-col items-center text-center">
				<div class="stat-data font-semibold text-2xl">76%</div>
				<div class="stat-label">Win Rate</div>
			</div>
		</div>
		<div class="recent-matches w-3/6 flex flex-col items-center mt-6">
			<div class="flex justify-between w-full">
				<div class="text-lg ml-2">Recent Matches</div>
			</div>
      <div class="game-test">
        
      </div>
      <!-- <div v-for="(game, index) in games.slice(0, 3)" :key="index">
        my team: {{ team.members.map(m => m.name) }}<br>
        opponent team: {{ game.opponent_team.members.map(m => m.name) }} <br>
        score: {{ game.given_team.set_score }} - {{ game.opponent_team.set_score }} <br>
        {{ game }}
      </div> -->
      <GameSummaryCard2 :teamOne="selfTeam" :teamTwo="getOpponentTeam(2)" />
			<!-- <GameSummaryCard :playerOne="match1.p1" :playerTwo="match1.p2" />
			<GameSummaryCard :playerOne="match2.p1" :playerTwo="match2.p2" />
			<GameSummaryCard :playerOne="match3.p1" :playerTwo="match3.p2" /> -->
			<div class="flex justify-end w-full">
				<div class="text-sm hover:underline cursor-pointer mt-1 mr-2">View Complete Match History</div>
			</div>
		</div>
	</body>
</template>
