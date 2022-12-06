<script setup>
import { ref, reactive, onBeforeUpdate, watch } from 'vue';
import * as apiCalls from '@/utils/apiCalls.js';

const props = defineProps({
  playerID: Number,
});


const player = reactive({});

async function loadPlayer() {
  const fetchedPlayer = await apiCalls.getPlayer(props.playerID);
  if (fetchedPlayer) Object.assign(player, fetchedPlayer);
}

await loadPlayer();

</script>

<template>
  <div class="header flex items-center mt-4">
    <img class="profile-pic rounded-full w-44 h-44 shadow-2xl" :src="player.profile_photo_url">
    <div class="username ml-4 font-semibold text-2xl">{{ player.name }}</div>
  </div>
</template>
