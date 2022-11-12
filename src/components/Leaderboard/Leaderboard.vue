<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import LeaderboardCard from '@/components/Leaderboard/LeaderboardCard.vue';
import LeaderboardHeader from '@/components/Leaderboard/LeaderboardHeader.vue';
import LeaderboardFooter from '@/components/Leaderboard/LeaderboardFooter.vue';

// const playerID = 2;
onMounted(async () => {
  /*
  name
  pic

  
  getPlayerSinglesRankingAndElo -> /api/players/{player_id}/teams/singles/ranking/season/{season_id}
  elo
  ranking

  getTeamGames -> /api/teams/{teamid}/games/{seasonid}
  games played
  wins
  losses
  win rate
  */

  // const response = await axios.get(`${API_URL}/players/${playerID}/teams/singles/ranking/season/1`);
});

const players = reactive([
  {
    id: 1,
    name: 'David Johnston',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 1,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
  {
    id: 2,
    name: 'Bob',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 2,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
  {
    id: 3,
    name: 'David Johnston',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 3,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
  {
    id: 4,
    name: 'David Johnston',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 4,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
  {
    id: 5,
    name: 'David Johnston',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 5,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
  {
    id: 6,
    name: 'David Johnston',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 6,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
  {
    id: 7,
    name: 'David Johnston',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 7,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
  {
    id: 8,
    name: 'David Johnston',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 8,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
  {
    id: 9,
    name: 'David Johnston',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 9,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
  {
    id: 10,
    name: 'David Johnston',
    profilePhotoPath: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg',
    ranking: 10,
    elo: 2500,
    gamesPlayed: 243,
    gamesWon: 201,
    gamesLost: 42,
    winRate: 83
  },
]);

</script>


<template>
<div class="leaderboard flex flex-col items-center">
  <h1 class="text-4xl">Leaderboard</h1>
  <p>Singles</p>
  <table class="w-1/2 shadow-lg shadow-gray-400 rounded-lg">
    <LeaderboardHeader />
    <LeaderboardCard v-for="player in players" :key="player.id" :player="player" />
    <LeaderboardFooter />
  </table>
</div>
</template>