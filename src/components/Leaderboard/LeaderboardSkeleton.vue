
<template>
<div class="leaderboard flex flex-col items-center mx-4">
  <div class="skeleton-header w-[400px] h-[50px] bg-gray-200 my-4"></div>
  <div class="skeleton-table animate-pulse h-[400px] w-[700px] rounded-lg bg-gray-200">

  </div>
  <table class="shadow-lg shadow-gray-400 rounded-lg w-[700px]">
    <LeaderboardHeader />
    <LeaderboardCard v-for="(team, index) in currentPageTeams" :key="team.id" :team="team" :ranking="index + 1 + (page - 1) * teamsPerPage" />
    <LeaderboardFooter  v-model:gameMode="gameMode" :page="page" :numberOfPages="numberOfPages" @paginate-next="page++" @paginate-previous="page--" @jump-to-page="jumpToPage"/>
  </table>
</div>
</template>