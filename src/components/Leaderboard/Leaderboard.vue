<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import LeaderboardCard from '@/components/Leaderboard/LeaderboardCard.vue';
import LeaderboardHeader from '@/components/Leaderboard/LeaderboardHeader.vue';
import LeaderboardFooter from '@/components/Leaderboard/LeaderboardFooter.vue';
import * as apiCalls from '@/utils/apiCalls.js';
import * as toasts from '@/utils/toasts.js';

const gameMode = ref('singles');
const singlesTeams = reactive([]);
const doublesTeams = reactive([]);
const page = ref(1);
const teamsPerPage = ref(5);


async function loadSinglesLeaderboard() {
  const fetchedTeams = await apiCalls.getSinglesLeaderboard();
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

</script>


<template>
<div class="leaderboard flex flex-col items-center mx-4">
  <h1 class="text-4xl my-4">Leaderboard</h1>
  <table class="shadow-lg shadow-gray-400 rounded- w-[700px]">
    <LeaderboardHeader />
    <LeaderboardCard v-for="(team, index) in currentPageTeams" :key="team.id" :team="team" :ranking="index + 1 + (page - 1) * teamsPerPage" />
    <LeaderboardFooter  v-model:gameMode="gameMode" :page="page" :numberOfPages="numberOfPages" @paginate-next="page++" @paginate-previous="page--" @jump-to-page="jumpToPage"/>
  </table>
</div>
</template>