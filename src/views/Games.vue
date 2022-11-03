<script setup>
import axios from "axios";
// import { useGameStore } from "../stores/modules/games";
import { API_URL, GAMES } from '@/stores/utils/backendRouteParts.js'
import { reactive } from 'vue'
// import Pagination from '../components/Pagination.vue'


const games = reactive([]);
// const game = reactive();
// const scores = reactive([]);
const teamMembers = [];
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

const getScores = async (gameID) => {
    const response = await axios.get(API_URL + GAMES + gameID)
    //store each score in an array??
  }

const getGamesRequest = async () => {
  try {
    const response = await axios.get(API_URL + GAMES)

    if(response.status === 200) {
      const fetchedGames = response.data.response.games;
      Object.assign(games, fetchedGames);
      console.log(games);
    }
  } catch (err) {
    console.error(err);
  }

  };

  getGamesRequest();
  // getScores();
</script>


<template>
  <body>
    <div class="body flex justify-center w-full">
      <div
        class="
          flex flex-col
          sm:w-[30rem]
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
                <div class="flex flex-row self-center"><h1>{{ formatDate(game.completed_at) }}</h1></div>
                <br/>
                  <div class="flex flex-col w-full last:items-end border shadow-md rounded-xl p-1 m-1 mr-20" v-for="team in game.teams" :key="team.id">
                    <div class="" v-for="member in team.members" :key="member.id">{{ member.name }}</div>
                    <div class="" v-if="game.teams[0].id == team.id">{{ game.team1_elo_change }}</div>
                    <div class="" v-else>{{ game.team2_elo_change }}</div>
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
  </body>
</template>
