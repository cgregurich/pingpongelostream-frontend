<script setup>
import Leaderboard from '@/components/Leaderboard/Leaderboard.vue';
import LeaderboardSkeleton from '@/components/Leaderboard/LeaderboardSkeleton.vue';
</script>


<template>
<Suspense>
  <template #default>
    <Leaderboard />
  </template>
  <template #fallback>
    <LeaderboardSkeleton />
  </template>
</Suspense>
</template>