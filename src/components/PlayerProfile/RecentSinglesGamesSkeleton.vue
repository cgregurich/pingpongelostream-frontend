<template>
  <div class="recent-games max-w-[750px] w-full flex flex-col items-center px-6 mt-6">

    <!-- "Recent Games" skeleton -->
    <div class="flex justify-between w-full">
      <div class="text-lg ml-2 rounded-md w-[100px] h-[30px] bg-skeleton-color animate-pulse"></div>
    </div>

    <!-- GameSummaryCard Skeletons -->
    <div v-for="index in 3" :key="index" class="game-summary-card flex justify-between items-center bg-skeleton-color animate-pulse rounded-xl px-4 my-1 w-full min-w-[400px] h-[80px]"></div>

    <!-- "Game History" skeleton -->
    <div class="flex justify-end w-full">
      <div class="text-sm rounded-md w-[180px] h-[20px] mt-1 mr-2 bg-skeleton-color animate-pulse"></div>
    </div>
  </div>
</template>