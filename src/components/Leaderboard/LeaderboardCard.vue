<script setup>
import { computed } from 'vue';
const props = defineProps({
  player: Object,
});

const trophyClass = computed(() => {
  const classes = [
    'text-yellow-400',
    'text-stone-400',
    'text-amber-600',
  ];
  if (props.player.ranking <= 3) return classes[props.player.ranking - 1];
  else return '';
});

</script>


<template>
  <tr class="border border-t-black border-b-black border-opacity-20" :class="player.ranking % 2 === 0 ? ['bg-site-color-one', 'bg-opacity-10'] : 'bg-white'">
    <td class="text-center py-4 text-gray-500">{{ player.ranking }}</td>
    <td class="text-start"><font-awesome-icon v-if="player.ranking <= 3" icon="fa-trophy" :class="trophyClass" /> {{ player.name }}</td>
    <td class="text-center ">{{ player.elo }}</td>
    <td class="text-center">{{ player.gamesPlayed }}</td>
    <td class="text-center">{{ player.gamesWon }}</td>
    <td class="text-center">{{ player.gamesLost }}</td>
    <td class="text-center">{{ player.winRate }}%</td>
  </tr>
</template>