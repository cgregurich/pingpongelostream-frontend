<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import PlayerHeader from '@/components/PlayerProfile/PlayerHeader.vue';
import PlayerHeaderSkeleton from '@/components/PlayerProfile/PlayerHeaderSkeleton.vue';
import PlayerStats from '@/components/PlayerProfile/PlayerStats.vue';
import PlayerStatsSkeleton from '@/components/PlayerProfile/PlayerStatsSkeleton.vue';
import RecentGames from '@/components/PlayerProfile/RecentGames.vue';
import RecentGamesSkeleton from '@/components/PlayerProfile/RecentGamesSkeleton.vue';
import { useAuthStore } from '@/stores/modules/auth.js';
import { useRoute, useRouter } from 'vue-router';
import * as apiCalls from '@/utils/apiCalls.js';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const seasonID = ref(null);
onMounted(async () => {
  const fetchedSeasonID = await apiCalls.getCurrentSeason();
  if (fetchedSeasonID) seasonID.value = fetchedSeasonID;
});

const playerID = computed(() => {
  if (route.params.id) return parseInt(route.params.id);
  else return authStore.user.id;
});

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
        <RecentGames :playerID="parseInt($route.params.id) || authStore.user.id" :seasonID="seasonID"/>
      </template>
      <template #fallback>
        <RecentGamesSkeleton />
      </template>
    </Suspense>
	</body>
</template>
