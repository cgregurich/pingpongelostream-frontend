<script setup>
import { ref, onMounted } from 'vue';
import PlayerHeader from '@/components/PlayerProfile/PlayerHeader.vue';
import PlayerHeaderSkeleton from '@/components/PlayerProfile/PlayerHeaderSkeleton.vue';
import PlayerStats from '@/components/PlayerProfile/PlayerStats.vue';
import PlayerStatsSkeleton from '@/components/PlayerProfile/PlayerStatsSkeleton.vue';
import RecentGames from '@/components/PlayerProfile/RecentGames.vue';
import RecentGamesSkeleton from '@/components/PlayerProfile/RecentGamesSkeleton.vue';
import { useAuthStore } from '@/stores/modules/auth.js';
import * as apiCalls from '@/utils/apiCalls.js';

const authStore = useAuthStore();

const seasonID = ref(null);
// onMounted(async () => {
//   const fetchedSeasonID = await apiCalls.getCurrentSeason();
//   if (fetchedSeasonID) seasonID.value = fetchedSeasonID;
// });
seasonID.value = 2;

</script>

<template>
	<body class="flex flex-col items-center">
    seasonID: {{ seasonID }}
    <!-- <select v-model="seasonID">
      <option value="1">1</option>
      <option value="2">2</option>
    </select>  -->
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
