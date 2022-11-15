<script setup>
import { computed } from 'vue';
const props = defineProps({
  // player: Object,
  team: Object,
  ranking: Number
});

const trophyClass = computed(() => {
  const classes = [
    'text-yellow-400',
    'text-stone-400',
    'text-amber-600',
  ];
  if (props.ranking <= 3) return classes[props.ranking - 1];
  else return '';
});

const winRate = computed(() => {
  return Math.round(props.team.wins / props.team.totalGames * 100);
});

const playerNames = computed(() => {
  if (props.team.members.length === 1) return props.team.members[0].name;
  else if (props.team.members.length === 2) return `${props.team.members[0].name} & ${props.team.members[1].name}`
});

</script>


<template>
  <tr class="border border-t-black border-b-black border-opacity-10" :class="ranking % 2 === 0 ? ['bg-site-color-one', 'bg-opacity-10'] : 'bg-white'">
    <td class="text-center py-6 text-gray-500">{{ ranking }}</td>
    <td class="text-left">
      <font-awesome-icon v-if="ranking <= 3" icon="fa-trophy" :class="trophyClass" />
      {{ playerNames }}
    </td>
    <td class="text-center px-6">{{ team.elo }}</td>
    <td class="text-center px-6">{{ team.totalGames }}</td>
    <td class="text-center px-6">{{ team.wins }}</td>
    <td class="text-center px-6">{{ team.totalGames - team.wins }}</td>
    <td class="text-center px-6">{{ winRate }}%</td>
  </tr>
</template>