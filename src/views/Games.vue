<script setup>
import axios from "axios";
import { useGameStore } from "../stores/modules/games";
import { API_URL, GAMES } from '@/stores/utils/backendRouteParts.js'
import { ref, reactive, computed, onBeforeUpdate, onMounted } from 'vue'
import Pagination from '../components/Pagination.vue'

const games = [];
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
          m-6
          pb-5
          border border-gray-300
          shadow-lg
        "
      >
        <p class="flex header text-4xl font-semibold m-4">Recent Games</p>

        <div class="flex stat-container items-center text-center mx-4">
            <ul>
              <li class="flex flex-col" v-for="game in games" :key="game.teams">
                <div class="flex flex-row"> {{ game.completed_at }} </div>
                <br/>
                <div class="flex flex-row">
                  <div class="flex flex-col" v-for="team in game.teams" :key="team.id">
                    <div class="flex" v-for="member in team.members" :key="member.id">{{ member.name }}</div>
                  </div>
                </div>
                <div class="flex flex-row" v-if="gameNum !== perPage">___________________________</div>
                <br/>
              </li>
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
