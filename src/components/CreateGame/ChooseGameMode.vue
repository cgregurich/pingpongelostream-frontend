<script setup>
import { ref, reactive, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  selectedGameModeID: Number,
  selectedGameMode: Object,
  gameModes: Array,
});

const leftSelected = ref(true);

function toggleSlider() {
  leftSelected.value = !leftSelected.value;
}

</script>

<template>
<div class="choose-game-mode flex">
  <div class="buttons flex m-4">
    <button v-for="gameMode in gameModes" :key="gameMode.id" class="px-4 py-2" :class="selectedGameModeID === gameMode.id ? ['bg-purple-800', 'text-white'] : ['bg-purple-100']" @click="$emit('update:selectedGameModeID', gameMode.id)">{{ gameMode.name }}</button>
  </div>
  <!-- <div class="rules flex">
    <div class="rule-container flex flex-col items-center justify-center bg-red-300">
      <div class="rule text-3xl">{{ selectedGameMode.set_count }}</div>
      <div class="label text-xl">sets</div>
    </div>
    <div class="rule-container flex flex-col items-center justify-center bg-red-300">
      <div class="rule text-3xl">{{ selectedGameMode.win_score }}</div>
      <div class="label text-xl">points per set</div>
    </div>
    <div class="rule-container flex flex-col items-center justify-center bg-red-300">
      <div class="rule text-3xl">{{ selectedGameMode.serve_switch }}</div>
      <div class="label text-xl">points per server</div>
    </div>
  </div> -->
</div>
</template>