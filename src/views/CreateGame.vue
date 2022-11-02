<script setup>
import CreateTeams from '@/components/CreateGame/CreateTeams.vue';
import ChooseGameMode from '@/components/CreateGame/ChooseGameMode.vue';
import { ref, reactive, computed } from 'vue';

const selectedGameModeID = ref(1);

const gameModes = reactive([
  {
    id: 1,
    name: 'Singles',
    players: 2,
    win_score: 11,
    set_count: 3, 
    serve_switch: 2,
  },
  {
    id: 2,
    name: 'Doubles',
    players: 4,
    win_score: 21,
    set_count: 3, 
    serve_switch: 5,
  }
]);

const selectedGameMode = computed(() => gameModes.filter(gm => gm.id === selectedGameModeID.value)[0]);

</script>


<template>
<ChooseGameMode class="m-8" v-model:selectedGameModeID="selectedGameModeID" :selectedGameMode="selectedGameMode" :gameModes="gameModes"/>
<CreateTeams :gameMode="selectedGameMode"/>
</template>