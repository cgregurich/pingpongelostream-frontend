<script setup>
import axios from 'axios';
import { onMounted, ref, reactive, computed } from 'vue';
import { API_URL } from '@/stores/utils/backendRouteParts.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const games = reactive([]);

onMounted(async () => {
  const response = await axios.get(`${API_URL}/games`);
  Object.assign(games, response.data.response.games);
});

const playedGames = computed(() => games.filter(game => game.started_at != null && game.completed_at != null));
const unplayedGames = computed(() => games.filter(game => game.started_at == null));


function getPlayersForGame(game) {
  const teamOne = game.teams[0].members.map(member => member.name);
  const teamTwo = game.teams[1].members.map(member => member.name);

  return {
    teamOne: {
      playerOne: teamOne[0],
      playerTwo: teamTwo[1]
    },
    teamTwo: {
      playerOne: teamTwo[0],
      playerTwo: teamTwo[1],
    }
  };
}

function getPlayersForSinglesGame(game) {
  const playerOne = game.teams[0].members.map
}


const singlesGames = computed(() => unplayedGames.value.filter(game => game.teams[0].members.length === 1 && game.teams[1].members.length === 1));

function isSinglesGame(game) {
  return game.teams[0].members.length === 1 && game.teams[1].members.length === 1;
}

function isDoublesGame(game) {
  return game.teams[0].members.length === 2 && game.teams[1].members.length === 2;
}

function isUnplayedGame(game) {
  return game.started_at == null;
}

const recentUnplayedSinglesGames = computed(() => {
  return games.filter(game => isSinglesGame(game) && isUnplayedGame(game)).slice(-5).reverse();
});

const recentUnplayedDoublesGames = computed(() => {
  return games.filter(game => isDoublesGame(game) && isUnplayedGame(game)).slice(-5).reverse();
});

</script>

<template>
    <h1>Games</h1>
    <p>playedGames.length: {{ playedGames.length }}</p>
    <p>unplayedGames.length: {{ unplayedGames.length }}</p>
    <div class="singles">
      <h1 class="text-2xl">Recent Singles (newest at top)</h1>
      <div class="game bg-gray-300 w-max my-4 mx-6 cursor-pointer"
        v-for="game in recentUnplayedSinglesGames"
        :key="game.id"
        @click="router.push({ name: 'Play', params: { gameID: game.id } })">
        {{ game.id }} : {{ getPlayersForGame(game).teamOne.playerOne }} vs {{ getPlayersForGame(game).teamTwo.playerOne }}
      </div>
    </div>
    <div class="doubles">
      <h1 class="text-2xl">Recent Doubles (newest at top)</h1>
      <div class="game bg-gray-300 w-max my-4 mx-6 cursor-pointer"
        v-for="game in recentUnplayedDoublesGames"
        :key="game.id"
        @click="router.push({ name: 'Play', params: { gameID: game.id } })"
      >{{ game.id }} : {{ getPlayersForGame(game).teamOne.playerOne }} & {{ getPlayersForGame(game).teamOne.playerTwo }} vs {{ getPlayersForGame(game).teamTwo.playerOne }} & {{ getPlayersForGame(game).teamTwo.playerTwo }}</div>
    </div>
</template>