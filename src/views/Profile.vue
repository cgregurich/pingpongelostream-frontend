<script setup>
import PlayerHeader from '@/components/PlayerProfile/PlayerHeader.vue';
import PlayerHeaderSkeleton from '@/components/PlayerProfile/PlayerHeaderSkeleton.vue';
import PlayerStats from '@/components/PlayerProfile/PlayerStats.vue';
import PlayerStatsSkeleton from '@/components/PlayerProfile/PlayerStatsSkeleton.vue';
import RecentGames from '@/components/PlayerProfile/RecentGames.vue';
import RecentGamesSkeleton from '@/components/PlayerProfile/RecentGamesSkeleton.vue';

const seasonID = 1;


</script>

<template>
	<body class="flex flex-col items-center">
    
    <!-- Player Header (name & photo) -->
    <Suspense>
      <template #default>
        <PlayerHeader :playerID="parseInt($route.params.id)" />
      </template>
      <template #fallback>
        <PlayerHeaderSkeleton />
      </template>
    </Suspense>

    <!-- Player Stats -->
    <Suspense>
      <template #default>
        <PlayerStats
          :playerID="parseInt($route.params.id)"
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
        <RecentGames :playerID="parseInt($route.params.id)" :seasonID="seasonID"/>
      </template>
      <template #fallback>
        <RecentGamesSkeleton />
      </template>
    </Suspense>
	</body>
</template>
