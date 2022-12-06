<script setup>
defineProps({
  teamOne: Array,
  teamTwo: Array,
  score: Object,
  elos: Object,
});
</script>

<template>
<div class="game-summary-card rounded-sm flex justify-between items-center shadow-lg shadow-gray-300 bg-gray-100 rounded-xl px-4 my-1 border border-gray-300 hover:bg-gray-200 transition-colors w-full min-w-[400px]">


  <!-- Left Team -->
  <div class="team-left flex items-center ml-1">
    <!-- Profile Pic and Username -->
    <div v-for="(player, index) in teamOne" :key="index" class="name-pic-container text-sm flex flex-col items-start my-2 border-0 border-red-400 bg-red-000 sm:w-[150px]">
      <img class="w-12 h-12 rounded-full" :src="player.profilePhotoPath">
      <div class="username font-semibold text-black">{{ player.name }}</div>
    </div>
    <!-- Elo Change and Elo After -->
    <div class="elo-container flex items-center border-0 border-blue-400 bg-blue-000">
      <div v-if="elos.teamOne.eloChange > 0" class="elo-gained text-green-500 mx-3 font-semibold text-sm">
        +{{ elos.teamOne.eloChange }}
      </div>
      <div v-if="elos.teamOne.eloChange < 0" class="elo-lost text-red-400 mx-3 font-semibold text-sm">
        {{ elos.teamOne.eloChange }}
      </div>
      <div class="elo text-xl">
        {{ elos.teamOne.eloAfter }}
      </div>
    </div>
  </div>

  <!-- Final Score -->
  <div class="score font-bold text-3xl flex items-center mx-2">
    <div class="left-score" :class="score.teamOne > score.teamTwo ? 'text-green-500' : 'text-red-500'">{{ score.teamOne }}</div>
    <div class="dash text-2xl mx-2">-</div>
    <div class="right-score" :class="score.teamTwo > score.teamOne ? 'text-green-500' : 'text-red-500'">{{ score.teamTwo }}</div>
  </div>

  <!-- Right Team -->

  <div class="team-right flex items-center mr-1">
    <!-- Elo Change and Elo After -->
    <div class="elo-container flex items-center border-0 border-blue-400 bg-blue-000">
      <div class="elo text-xl">
        {{ elos.teamTwo.eloAfter }}
      </div>
      <div v-if="elos.teamTwo.eloChange > 0" class="elo-gained text-green-500 mx-3 font-semibold text-sm">
        +{{ elos.teamTwo.eloChange }}
      </div>
      <div v-if="elos.teamTwo.eloChange < 0" class="elo-lost text-red-400 mx-3 font-semibold text-sm">
        {{ elos.teamTwo.eloChange }}
      </div>
    </div>
    <!-- Profile Pic and Username -->
    <div v-for="(player, index) in teamTwo" :key="index" class="name-pic-container flex flex-col items-end text-sm my-2 border-0 border-red-400 bg-red-000 sm:w-[150px]">
      <img class="w-12 min-w-12 h-12 rounded-full" :src="player.profilePhotoPath">
      <div class="username font-semibold text-black whitespace-nowrap">{{ player.name }}</div>
    </div>
  </div>
</div>

</template>

