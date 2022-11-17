<script setup>
import axios from "axios";
import { onMounted, reactive } from 'vue'
import { API_URL, GAMES } from '@/stores/utils/backendRouteParts.js'
import SelectDropDown from "../SelectDropDown.vue";
import TeamCard from "./TeamCard.vue";
// import Pagination from '../components/Pagination.vue'


const games = reactive([]);
var winningTeamObject = "";
var losingTeamObject = "";
const dropDownSelections = { Recent:'Recent Played Games', Scheduled:'Scheduled Games to be Played', Playing:'Currently Playing Games'}
var gameOption = 'recent';
var currentSeason = 1;
// const totalPages = 10;
const currentPage = 1;
// const perPage = 6;
// var gameNum = 0;
// var page = 1;

// function onPageChange(page) {
//       console.log(page)
//       this.currentPage = page;
//     }

onMounted(async () => {
  await getRequest();
})

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
const getGames = async (value) => {
  if(value == 'recent') {
    getRequest(value);
  }
  else if(value == 'scheduled') {
    getRequest(value);
  }
  else if(value == 'playing'){
    getRequest(value);
  }
  else {
    gameOption = value;
    console.log("Something went wrong, gameOption is " + gameOption)
  }
}

const getRequest = async (value) => {
  try {
    const response = await axios.get(API_URL + GAMES + "/season/" + currentSeason);
    // /paginated/season/" + currentSeason "?page=" + currentPage + "&size=10&type=" + gameOption
    if(response.status === 200) {
        const fetchedGames = response.data.response.games;
        console.log(fetchedGames);
        Object.assign(games, fetchedGames);
    }
    gameOption = value;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Function that calls getGames if the currentPage needs changing
 */
function getPage(value) {
  console.log("value: " + value + " and gameOption: " + gameOption);
  value != gameOption && getGames(value)
}

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
        bg-amber-100
      "
    >
    <div class="flex flex-row w-full p-4 pt-7">
      <div class="flex w-full text-5xl font-semibold relative left-20">Recent Games</div>
      <div class="flex w-full mb-12">
        <SelectDropDown menu-title="Game Options" class="w-2/3 absolute left-20">
          <section class="pb-1 border-b border-purple-300">
            <button @click="getPage('recent')">{{dropDownSelections.Recent}}</button>
          </section>
          <section class="py-1 border-b border-purple-300">
            <button @click="getPage('scheduled')">{{dropDownSelections.Scheduled}}</button>
          </section>
          <section class="pt-1">
            <button @click="getPage('playing')">{{dropDownSelections.Playing}}</button>
          </section>
        </SelectDropDown>
      </div>
    </div>
      <div class="flex flex-col w-3/4 mt-10">
            <div class="flex flex-col w-full" v-for="game in games" :key="game.teams">
              <div class="flex flex-row self-center pb-1"><h1>{{ formatDate(game.completed_at) }}</h1></div>
                <!-- <div class="flex flex-row w-full last:items-end border shadow-md rounded-xl py-2 px-4 lg:py-2 lg:px-10 bg-indigo-100 hover:bg-indigo-500"> -->
                  <div class="flex flex-col border shadow-md rounded-xl  bg-neutral-100 py-2 md:px-2 lg:px-5 sm:py-1 hover:shadow-gray-400">
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