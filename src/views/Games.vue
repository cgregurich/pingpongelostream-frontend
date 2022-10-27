<script setup>
import axios from "axios";
import { useGameStore } from "../stores/modules/games";
import { API_URL, GAMES } from '@/stores/utils/backendRouteParts.js'
import { ref, reactive, computed, onBeforeUpdate, onMounted } from 'vue'

const games = [];
const teamMembers = [];


async function displayGames() {
  const response = await axios.get(API_URL + GAMES);
  if(response.status === 200) {
    const fetchedGames = response.data.response.games;
    // console.log(fetchedGames);
    // Object.assign(games, fetchedGames);
    for(let i = 0; i < 10; i++) {
      games.push(fetchedGames[i]);
    }
    console.log(games);
  }
  }

  onMounted(async() => {
    await displayGames();
  })
</script>


<template>
  <body>
    <div class="body flex justify-center w-full">
      <div
        class="
          game-list-container
          flex flex-col
          items-center
          sm:w-[30rem]
          w-full
          bg-gray-100
          rounded-3xl
          m-4
          pb-5
          border border-gray-300
          shadow-lg
        "
      >
        <p class="header text-4xl font-semibold m-4">Recent Games</p>
        <div>Working on retrieving data from DB...</div>

        <div class="stat-container flex flex-col items-center text-center mx-4">
          <div class="stat-label"></div>
          <!-- <div class="stat-data font-semibold text-2xl"> {{ games }}</div> -->
            <ul>
              <li v-for="game in games" :key="game.teams">
                {{ game.teams }}
              </li>
            </ul>
        </div>
        <div
          class="line w-4/5 lg:mt-40 mt-1 bg-opacity-10 bg-black h-[1px] mb-4"
        ></div>
        <div class="footer">Put pagination here</div>
      </div>
    </div>
  </body>
</template>
