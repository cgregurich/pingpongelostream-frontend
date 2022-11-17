<script setup>
import axios from "axios";
// import { useGameStore } from "../stores/modules/games";
import { API_URL, PLAYERS } from '@/stores/utils/backendRouteParts.js'
import { reactive } from 'vue'
// import Pagination from '../components/Pagination.vue'


const players = reactive([]);
const season = 1;
const playersInfo = reactive([]);
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

function sortByElo() {
  //Selection Sort for small list
  let length = playersInfo.length;
  for(let i = 0; i < length; i++) {
    let min = i;
    for(let j = i + 1; j < length; j++) {
      if(playersInfo[j].ranking < playersInfo[min].ranking) {
        min = j;
      }
    }
    if(min != i) {
      let temp = playersInfo[i];
      playersInfo[i] = playersInfo[min];
      playersInfo[min] = temp;
      let tem = players[i];
      players[i] = players[min];
      players[min] = tem;
    }
  }
}

const getLeaderboardInfo= async () => {
  try {
    for(let i = 0; i < players.length; i++) {
      const response = await axios.get(API_URL + PLAYERS + "/" + players[i].id + "/teams/singles/ranking/season/" + season);
      if(response.status === 200) {
        const fetchedInfo = response.data.response;
        Object.assign(playersInfo, fetchedInfo);
        playersInfo.push(fetchedInfo);
      }
    }
    
  } catch (err) {
    console.error(err);
  }
}

const getPlayersRequest = async () => {
  try {
    const response = await axios.get(API_URL + PLAYERS)

    if(response.status === 200) {
      const fetchedPlayers = response.data.response.players;
      Object.assign(players, fetchedPlayers);
    }
  } catch (err) {
    console.error(err);
  }
  await getLeaderboardInfo();
  sortByElo();
  console.log(playersInfo);
  console.log(players);
};

  getPlayersRequest();
</script>


<template>
  <body>
    <div class="body flex justify-center w-full">
      <div
        class="
          flex flex-col
          sm:w-[50rem]
          w-full
          bg-gray-100
          rounded-3xl
          m-6
          border border-gray-300
          shadow-lg
          items-center
        "
      >
        <p class="flex header text-4xl font-semibold m-4">Leaderboard</p>

        <div class="flex flex-col w-3/4">
              <ol class="flex" v-for="player in players" :key="player.id">
                <div class="flex flex-row w-full border shadow-md rounded-xl my-1 px-4 lg:py-3 lg:px-10 bg-rose-100 hover:bg-rose-500 text-xl">
                  <!-- <div class="flex-1 flex-col self-center">{{(playersInfo[players.indexOf(player)]).elo}}</div> -->
                  <div class="flex-1 flex-col self-center">{{ player.name }}</div>
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
