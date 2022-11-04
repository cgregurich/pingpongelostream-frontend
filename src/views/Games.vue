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
  const playerOne = game.teams[0].members.map(member => member.name)[0];
  const playerTwo = game.teams[1].members.map(member => member.name)[0];
  return { playerOne, playerTwo };
}


const singlesGames = computed(() => unplayedGames.value.filter(game => game.teams[0].members.length === 1 && game.teams[1].members.length === 1));
console.log(unplayedGames.value);
</script>

<template>
    <h1>Games</h1>
    <p>playedGames.length: {{ playedGames.length }}</p>
    <p>unplayedGames.length: {{ unplayedGames.length }}</p>
    <div class="game" v-for="game in unplayedGames" :key="game.id" @click="router.push({ name: 
    'Play', params: { gameID: game.id } })">
      {{ game.id }} : {{ getPlayersForGame(game).playerOne }} vs {{ getPlayersForGame(game).playerTwo }}
      
    </div>
</template>