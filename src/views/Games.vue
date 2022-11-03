<script setup>
import axios from 'axios';
import { onMounted, ref, reactive, computed } from 'vue';
import { API_URL } from '@/stores/utils/backendRouteParts.js';


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
  return { teamOne, teamTwo };
}

</script>

<template>
    <h1>Games</h1>
    <p>playedGames.length: {{ playedGames.length }}</p>
    <p>unplayedGames.length: {{ unplayedGames.length }}</p>
    <div class="game" v-for="game in unplayedGames" :key="game.id">
      {{ getPlayersForGame(game).teamOne }} vs {{ getPlayersForGame(game).teamTwo }}
    </div>
</template>