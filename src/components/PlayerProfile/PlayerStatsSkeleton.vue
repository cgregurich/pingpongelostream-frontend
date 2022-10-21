<template>
  <div class="stats flex justify-around w-3/6 max-w-[600px] mt-8">
  
    <!-- V-for each stat container to keep it DRY -->
    <div v-for="index in 4" :key="index" class="stat-container flex flex-col items-center justify-center text-center mx-4">
      <!-- Stat Skeleton -->
      <div class="stat-data font-semibold text-2xl w-[35px] lg:w-[65px] h-[40px] bg-skeleton-color rounded-md animate-pulse"></div>

      <!-- Stat Label Skeleton -->
      <div class="stat-label w-[60px] h-[50px] lg:w-[130px] lg:h-[25px] bg-skeleton-color animate-pulse rounded-md mt-1"></div>
    </div>
  </div>
</template>