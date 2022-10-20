<template>
<div class="text-red-500 text-4xl">NEW COMPONENT</div>
teamOne: {{ teamOne }}
teamTwo: {{ teamTwo }}

<div class="team-left flex items-center ml-1">
  <div v-for="(player, index) in teamOne" :key="index" class="name-pic-container flex flex-col items-center my-2">
    <img class="w-12 rounded-full" :src="player.profilePhotoPath">
    <div class="username font-semibold text-black">{{ player.name }}</div>
  </div>
</div>

<div class="team-right flex items-center mr-1">
  <div v-for="(player, index) in teamTwo" :key="index" class="name-pic-container flex flex-col items-center my-2">
    <img class="w-12 rounded-full" :src="player.profilePhotoPath">
    <div class="username font-semibold text-black">{{ player.name }}</div>
  </div>
</div>

</template>


<script setup>
defineProps({
  teamOne: Array,
  teamTwo: Array
});
</script>