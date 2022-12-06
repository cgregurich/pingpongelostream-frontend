<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import PlayerHeader from '@/components/PlayerProfile/PlayerHeader.vue';
import PlayerHeaderSkeleton from '@/components/PlayerProfile/PlayerHeaderSkeleton.vue';
import PlayerStats from '@/components/PlayerProfile/PlayerStats.vue';
import PlayerStatsSkeleton from '@/components/PlayerProfile/PlayerStatsSkeleton.vue';
import RecentSinglesGames from '@/components/PlayerProfile/RecentSinglesGames.vue';
import RecentSinglesGamesSkeleton from '@/components/PlayerProfile/RecentSinglesGamesSkeleton.vue';
import { useAuthStore } from '@/stores/modules/auth.js';
import { useRoute, useRouter } from 'vue-router';
import * as apiCalls from '@/utils/apiCalls.js';
import * as toasts from '@/utils/toasts.js';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const seasonID = ref(null);
const player = reactive({});

onMounted(async () => {
  if (await playerNotFound()) {
    toasts.playerNotFound(() => router.push({ name: 'Dashboard' }));
    return;
  }
  await loadCurrentSeason();
});

const playerID = computed(() => {
  if (route.params.id) return parseInt(route.params.id);
  else return authStore.user.id;
});

async function playerNotFound() {
  const fetchedPlayer = await apiCalls.getPlayer(route.params.id);
  return fetchedPlayer == null;

}

async function loadCurrentSeason() {
  const fetchedSeasonID = await apiCalls.getCurrentSeason();
  if (fetchedSeasonID) seasonID.value = fetchedSeasonID;
}

// Reloads the page when the playerID changes. This is so when you're on /players/<id>
// and you click the profile link, it will switch playerID and then reload the page
// so A) the data updates and B) the skeletons appear. I could get the data to update
// but I couldn't get the skeletons to appear so I feel like this is a better UX overall
watch(playerID, () => {
  router.go();
});

</script>

<template>
	<body class="flex flex-col items-center" v-if="seasonID">
    <!-- Player Header (name & photo) -->
    <Suspense>
      <template #default>
        <PlayerHeader :playerID="parseInt($route.params.id) || authStore.user.id" />
      </template>
      <template #fallback>
        <PlayerHeaderSkeleton />
      </template>
    </Suspense>

    <!-- Player Stats -->
    <Suspense>
      <template #default>
        <PlayerStats
          :playerID="parseInt($route.params.id) || authStore.user.id"
          :seasonID="seasonID"
        />
      </template>
      <template #fallback>
        <PlayerStatsSkeleton />
      </template>
    </Suspense>

    <!-- Recent Games -->
    <Suspense>
      <template #default>
        <RecentSinglesGames :playerID="parseInt($route.params.id) || authStore.user.id" :seasonID="seasonID"/>
      </template>
      <template #fallback>
        <RecentSinglesGamesSkeleton />
      </template>
    </Suspense>
	</body>
</template>
