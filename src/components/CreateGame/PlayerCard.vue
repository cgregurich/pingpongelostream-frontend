<script setup>
const props = defineProps({
  player: Object,
});
</script>

<template>
  <div class="player-card flex justify-between items-center w-content bg-white border-2 border-gray-300 rounded-md mx-4 px-4 py-2 my-4 w-[300px] select-none">
    <div class="player-info flex items-center justify-center">
      <img :src="player.profile_photo_path" draggable="false" class="h-16 w-16 rounded-full mr-2">
      <div class="player-name">{{ player.name }}</div>
    </div>
    <div class="controls flex flex-col justify-between mr-2 text-lg">
      <font-awesome-icon class="cursor-pointer hover:text-gray-600 active:text-gray-500" icon="fa-long-arrow-alt-left" @click="$emit('moveLeft')"/>
      <font-awesome-icon class="cursor-pointer hover:text-gray-600 active:text-gray-500" icon="fa-long-arrow-alt-right" @click="$emit('moveRight')"/>
      <font-awesome-icon class="cursor-pointer hover:text-gray-600 active:text-gray-500" icon="fa-trash" @click="$emit('delete')"/>
    </div>
  </div>
</template>