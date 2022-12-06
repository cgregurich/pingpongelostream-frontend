<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import LeaderboardCard from '@/components/Leaderboard/LeaderboardCard.vue';
import LeaderboardHeader from '@/components/Leaderboard/LeaderboardHeader.vue';
import LeaderboardFooter from '@/components/Leaderboard/LeaderboardFooter.vue';
import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';
import * as apiCalls from '@/utils/apiCalls.js';
import * as toasts from '@/utils/toasts.js';

const gameMode = ref('singles');
const singlesTeams = reactive([]);
const doublesTeams = reactive([]);
const page = ref(1);
const teamsPerPage = ref(5);

// onMounted(async () => {
//   await fetchSinglesLeaderboard();
//   await fetchDoublesLeaderboard();
// });

async function loadSinglesLeaderboard() {
  const fetchedTeams = await apiCalls.getSinglesLeaderboard();
  console.log('fetchedTeams: ', fetchedTeams);
  if (fetchedTeams) Object.assign(singlesTeams, fetchedTeams);
  else toasts.somethingWentWrong();
}

async function loadDoublesLeaderboard() {
  const fetchedTeams = await apiCalls.getDoublesLeaderboard();
  if (fetchedTeams) Object.assign(doublesTeams, fetchedTeams);
  else toasts.somethingWentWrong();
}


const teams = computed(() => {
  if (gameMode.value === 'singles') return singlesTeams;
  else return doublesTeams;
});


// clamps page value
watch(page, () => {
  if (page.value < 1) page.value = 1;
  else if (page.value > numberOfPages.value) page.value = numberOfPages.value;
});

function jumpToPage(newPage) {
  page.value = newPage;
}

const currentPageTeams = computed(() => {
  const startIndex = (page.value - 1) * teamsPerPage.value;
  if (gameMode.value === 'singles') return singlesTeams.slice(startIndex, startIndex + teamsPerPage.value)
  else if (gameMode.value === 'doubles') return doublesTeams.slice(startIndex, startIndex + teamsPerPage.value)
  return [];
});

const numberOfPages = computed(() => {
  if (gameMode.value === 'singles') return Math.ceil(singlesTeams.length / teamsPerPage.value);
  else if (gameMode.value === 'doubles') return Math.ceil(doublesTeams.length / teamsPerPage.value);
});

async function fake() {
  await new Promise(resolve => setTimeout(resolve, 5000));
}
await Promise.all([loadSinglesLeaderboard(), loadDoublesLeaderboard()]);
// await fake();

function gameModeChanged(newGameMode) {
  gameMode.value = newGameMode;
}

</script>


<template>
<div class="leaderboard flex flex-col items-center mx-4">
  <h1 class="text-4xl my-4">Leaderboard</h1>
  <table class="shadow-lg shadow-gray-400 rounded-lg w-[700px]">
    <LeaderboardHeader />
    <LeaderboardCard v-for="(team, index) in currentPageTeams" :key="team.id" :team="team" :ranking="index + 1 + (page - 1) * teamsPerPage" />


    <!-- Leaderboard Footer -->
    <tr>
      <td class="bg-site-color-two text-white rounded-b-lg py-2" colspan="7">
        <div class="paginater flex justify-end text-xs">
          <select class="text-black rounded-lg border-none" v-model="gameMode">
            <option value="singles">Singles</option>
            <option value="doubles">Doubles</option>
          </select>
          <button class="mx-4" @click="page--">Prev</button>
          <div @click="jumpToPage(i)" class="px-2 border-2 rounded-md cursor-pointer" :class="i === page ? ['border-white'] : 'border-site-color-two'" v-for="i in numberOfPages" :key="i">{{ i }}</div>
          <button class="mx-4" @click="page++">Next</button>
        </div>
      </td>
    </tr>
  </table>
</div>
</template>