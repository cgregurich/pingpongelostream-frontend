<script setup>
import axios from "axios";
import { reactive } from 'vue'
import { API_URL, GAMES } from '@/stores/utils/backendRouteParts.js'
import TeamCard from "./TeamCard.vue";
// import Pagination from '../components/Pagination.vue'



const games = reactive([]);
let winningTeamObject = "";
let losingTeamObject = "";
// const totalPages = 10;
// const currentPage = 1;
// const perPage = 6;
// let gameNum = 0;
// let page = 1;

// function onPageChange(page) {
//       console.log(page)
//       this.currentPage = page;
//     }

function formatDate(date) {
  const options = {year: 'numeric', month: 'long', day: 'numeric'}
  return new Date(date).toLocaleDateString('en', options)
}

/**
 * Handles setting winningTeam
 * TODO - also needs to handle more than 2 teams
 */
function getWinningTeam(game) {
  let winner = game.teams[0].pivot.set_score > game.teams[1].pivot.set_score ? game.teams[0] : game.teams[1];
  return winner;
}
/**
 * Handles setting losingTeam
 * TODO - also needs to handle more than 2 teams
 */
function getLosingTeam(game) {
  let loser = game.teams[0].pivot.set_score < game.teams[1].pivot.set_score ? game.teams[0] : game.teams[1];
  return loser;
}


/**
 * Handles get request
 * TODO - only handling season #1
 */
const getGames = async () => {
try {
  const response = await axios.get(API_URL + GAMES + "/season/1");
  if(response.status === 200) {
      const fetchedGames = response.data.response.games;
      console.log(fetchedGames);
      Object.assign(games, fetchedGames);
      // handleScoreTeams(games.teams);
    }
} catch (err) {
  console.error(err);
}

}

getGames();
</script>

<template>
<div class="body flex justify-center w-full">
    <div
      class="
        flex flex-col
        sm:w-[60rem]
        w-full
        rounded-3xl
        m-6
        border border-gray-300
        shadow-lg
        items-center
        bg-violet-100
      "
    >
      <p class="flex header text-4xl font-semibold m-4">Recent Games</p>

      <div class="flex flex-col w-3/4">
            <div class="flex flex-col w-full" v-for="game in games" :key="game.teams">
              <div class="flex flex-row self-center pb-1"><h1>{{ formatDate(game.completed_at) }}</h1></div>
                <!-- <div class="flex flex-row w-full last:items-end border shadow-md rounded-xl py-2 px-4 lg:py-2 lg:px-10 bg-indigo-100 hover:bg-indigo-500"> -->
                  <div class="flex flex-col border shadow-md rounded-xl  bg-gray-100 py-2 md:px-2 lg:px-5 sm:py-1 hover:shadow-gray-400">
                  <TeamCard :winningTeam=getWinningTeam(game) :losingTeam=getLosingTeam(game) />
                </div>
              <br/>
              </div>
      </div>
      <div
        class="line w-4/5 lg:mt-40 mt-1 bg-opacity-10 bg-black h-[1px] mb-4"
      ></div>
      <!-- <pagination
        :totalPages= totalPages
        :perPage=perPage
        :currentPage= currentPage
        @pagechanged="onPageChange"
      /> -->
    </div>
  </div>
</template>