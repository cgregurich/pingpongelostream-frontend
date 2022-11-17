<script setup>
import axios from "axios";
// import { useGameStore } from "../stores/modules/games";
import { API_URL, PLAYERS } from '@/stores/utils/backendRouteParts.js'
import { reactive } from 'vue'
// import Pagination from '../components/Pagination.vue'

const players = reactive([]);
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

const getElo = async (gameID) => {
    const response = await axios.get(API_URL + PLAYERS)
    //store each elo in an array??
  }

const getPlayersRequest = async () => {
  try {
    const response = await axios.get(API_URL + PLAYERS)

    if(response.status === 200) {
      const fetchedPlayers = response.data.response.players;
      Object.assign(players, fetchedPlayers);
      console.log(players);
    }
  } catch (err) {
    console.error(err);
  }

  };

  getPlayersRequest();
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
        <p class="flex header text-4xl font-semibold m-4">Registered Players</p>

        <div class="flex flex-col">
              <ol class="flex flex-row w-full" v-for="player in players" :key="player">
                <div class="flex w-full border shadow-md rounded-xl my-1 px-4 lg:py-2 lg:px-10 bg-purple-100 hover:bg-purple-200">
                  {{player.name}}
                </div>
              </ol>
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
