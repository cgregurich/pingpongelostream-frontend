<script setup>
import { ref, reactive, onBeforeUpdate } from 'vue';
import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';

const props = defineProps({
  playerID: Number,
});
const player = reactive({});

async function loadUser() {
  const response = await axios.get(`${API_URL}/players/${props.playerID}`);
  if (response.status === 200) {
    const fetchedPlayer = response.data.response.player;
    Object.assign(player, fetchedPlayer);
  }
}

onBeforeUpdate(async () => await loadUser());
await loadUser();

</script>

<template>
  <div class="header flex items-center mt-4">
    <img class="profile-pic rounded-full w-44 shadow-2xl" :src="player.profile_photo_url">
    <div class="username ml-4 font-semibold text-2xl">{{ player.name }}</div>
  </div>
</template>
