<script setup>
import axios from "axios";
import { reactive } from 'vue'
import { API_URL, GAMES } from '@/stores/utils/backendRouteParts.js'
import TeamCard from "./TeamCard.vue";
import Score from "./Score.vue";
// import Pagination from '../components/Pagination.vue'



const games = reactive([]);
const setsArray = reactive([]);
const eachGame = reactive([]);
const totalPages = 10;
const currentPage = 1;
const perPage = 6;
let gameNum = 0;
let page = 1;

function onPageChange(page) {
      console.log(page)
      this.currentPage = page;
    }

function formatDate(date) {
  const options = {year: 'numeric', month: 'long', day: 'numeric'}
  return new Date(date).toLocaleDateString('en', options)
}

function getWinningTeam(game) {
  let winner = game.team1_elo_change > game.team2_elo_change ? game.teams[0] : game.teams[1];
  return winner;
}

function getLosingTeam(game) {
  let loser = game.team1_elo_change < game.team2_elo_change ? game.teams[0] : game.teams[1];
  return loser;
}

// function getWinningScore(sets) {
//   let scores1 = 1;
//   let scores2 = 1;
//   let wins = game.team1_elo_change > game.team2_elo_change ? game.teams[0] : game.teams[1];
//   return wins;
// }

// function getLosingScore(sets) {
//   let losses = game.team1_elo_change < game.team2_elo_change ? game.teams[0] : game.teams[1];
//   return losses;
// }

const getSets = async() => {
    for(let i = 1; i <= 10; i++) {
        await getSet(i);
    }
    // await console.log(setsArray);
}

const getSet = async (gameID) => {
    try {
    const response = await axios.get(API_URL + GAMES + "/" + gameID)

    if(response.status === 200) {
      const fetchedOneGame = response.data.response.game;
      // console.log(fetchedOneGame);game.teams[0]
      eachGame.push(fetchedOneGame);
      setsArray.push(fetchedOneGame.sets);
      // console.log(setsArray);
    }
  } catch (err) {
    console.error(err);
  }
  }

const getGamesRequest = async () => {
  try {
    const response = await axios.get(API_URL + GAMES)

    if(response.status === 200) {
      const fetchedGames = response.data.response.games;
      Object.assign(games, fetchedGames);
      // console.log(games);
    }
  } catch (err) {
    console.error(err);
  }

  };

getGamesRequest();
getSets();
</script>

<template>
<div class="body flex justify-center w-full">
    <div
      class="
        flex flex-col
        sm:w-[60rem]
        w-full
        bg-gray-100
        rounded-3xl
        m-6
        border border-gray-300
        shadow-lg
        items-center
      "
    >
      <p class="flex header text-4xl font-semibold m-4">Recent Games</p>

      <div class="flex">
          <ul>
            <span class="flex flex-col w-full" v-for="game in games" :key="game.teams">
              <div class="flex flex-row self-center pb-1"><h1>{{ formatDate(game.completed_at) }}</h1></div>
                <div class="flex flex-row w-full last:items-end border shadow-md rounded-xl py-2 px-4 lg:py-2 lg:px-10 bg-indigo-100 hover:bg-indigo-500">
                  <TeamCard :winningTeam=getWinningTeam(game) :losingTeam=getLosingTeam(game) />
                  <Score :sets="setsArray[(game.id)-1]" />
                </div>
              <div class="self-center" v-if="gameNum !== perPage">___________________________</div> 
              <br/>
            </span>
          </ul>
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