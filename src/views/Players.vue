<script setup>
import axios from "axios";
// import { useGameStore } from "../stores/modules/games";
import { API_URL, PLAYERS } from '@/stores/utils/backendRouteParts.js'
import { reactive, ref } from 'vue'
import Pagination from '../components/Pagination.vue'

const players = reactive([]);
// const game = reactive();
// const scores = reactive([]);
const teamMembers = [];
const totalPages = 1;
const totalItems = ref(10);
const currentPage = 1;
const perPage = 20;
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
      totalItems.value = fetchedPlayers.length;
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
          bg-white
          rounded-3xl
          m-6
          border border-purple-300
          shadow-lg
          items-center
        "
      >
        <p class="flex text-4xl font-semibold m-4">Registered Players</p>

        <div class="flex flex-col pb-5">
              <div class="flex flex-row" v-for="player in players" :key="player">
                <div class="flex w-full border border-purple-300 shadow-md rounded-xl my-1 px-3 lg:py-3 lg:px-5 bg-stone-100 hover:bg-stone-50">
                  <img class="flex-1 rounded-full w-5 p-1" :src="player.profile_photo_path">
                  <div class="flex-1 font-semibold self-center pl-4">{{player.name}}</div> 
                </div>
              </div>
        </div>
        <div class="line w-4/5 lg:mt-40 mt-1 bg-opacity-10 bg-black h-[1px] mb-4" v-if="totalItems > perPage"></div>
          <pagination v-if="totalItems > perPage"
          :totalPages='totalPages'
          :totalItems="totalItems"
          :perPage="perPage"
          :currentPage="currentPage"
          @pagechanged='onPageChange'
          />
      </div>
    </div>
  </body>
</template>
