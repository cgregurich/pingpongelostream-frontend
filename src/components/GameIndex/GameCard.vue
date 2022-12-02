<script setup>
import axios from "axios";
import { onBeforeMount, onMounted, onUpdated, reactive, ref } from 'vue'
import { API_URL, GAMES } from '@/stores/utils/backendRouteParts.js'
import SelectDropDown from "../SelectDropDown.vue";
import TeamCard from "./TeamCard.vue";
import Pagination from "../Pagination.vue";
import router from '@/router/index';
import GameIndexSkeleton from "./GameIndexSkeleton.vue";

const games = ref([]);

const pageHeader = ref('Completed');
const dropDownSelections = { Completed:'Completed Games', Scheduled:'Scheduled Games to be Played', Playing:'Currently Playing Games'}
var gameOption = 'completed';
var value = 'completed';

const currentSeason = ref(1);
const selectedSeason = ref();
const seasons = ref([]);

// Variables for Pagination component
const totalPages = ref(10);
const totalItems = ref(10);
const perPage = 5;
const currentPage = ref(1);

onMounted(async () => {
  await getSeasons();
  await getRequest();
})

/**
 * To display date nicely for each game
 * @param {*} date 
 */
function formatDate(date) {
  const options = {year: 'numeric', month: 'long', day: 'numeric'}
  return new Date(date).toLocaleDateString('en', options)
}

const getSeasons = async () => {
  try {
    const currentSeasonResponse = await axios.get(API_URL + "/seasons/current");
    if(currentSeasonResponse.status === 200) {
      currentSeason.value = currentSeasonResponse.data.response.season_number;
      selectedSeason.value = currentSeason.value;
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const seasonsResponse = await axios.get(API_URL + "/seasons");
    if(seasonsResponse.status === 200) {
      seasons.value = seasonsResponse.data.response;
    }
  } catch (err) {
    console.log(err);
  } 
}

function updateSeason(seasonNum) {
  console.log(seasonNum);
  selectedSeason.value = seasonNum;
  getRequest();
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
function getGames(value) {
  if(value == 'completed') {
    gameOption = value = 'completed';
    pageHeader.value = 'Completed';
    getRequest();
  }
  else if(value == 'scheduled') {
    gameOption = value = 'scheduled';
    pageHeader.value = 'Scheduled';
    getRequest();
  }
  else if(value == 'playing'){
    gameOption = value = 'playing';
    pageHeader.value = 'Playing';
    getRequest();
  }
  else {
    gameOption = value;
    console.log("Something went wrong, gameOption is " + gameOption)
  }
}

/**
 * Game options are: scheduled, playing, completed
 * 
 */
const getRequest = async () => {
  // Get Games
  try {
    const response = await axios.get(API_URL + GAMES + "/season/" + selectedSeason.value + "?page=" + currentPage.value + "&size=" + perPage +"&type=" + gameOption);
    if(response.status === 200) {
        const fetchedGames = response.data.response;
        totalPages.value = fetchedGames.totalPages;
        games.value = fetchedGames.games;
        // console.log(games.value);
    }
  } catch (err) {
    console.error(err);
  }  
}

/**
 * Function that calls getGames if the currentPage needs changing
 */
function getPage(value) {
  console.log("value: " + value + " and gameOption: " + gameOption);
  value != gameOption && getGames(value);
  // Object.assign(totalItems, games.value.length);
  // Object.assign(totalPages, Math.ceil(totalItems.value/perPage));
}

/**
 * Used for pagination component
 * @param {*} page 
 */
function onPageChange(page) {
  console.log("page is " + page);
  currentPage.value = page;
  getRequest();
}

function maxButtonsForPagination() {
  return totalPages.value < 3 ? totalPages.value : 3;
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
        bg-white
      "
    >
    <div class="flex flex-row w-full p-4 pt-7">
      <div class="flex w-full lg:text-5xl md:text-4xl sm:text-5xl font-semibold relative left-20 justify-center">{{pageHeader}}</div>
      <div class="flex lg:w-full md:w-1/2 mb-12">
        <SelectDropDown menu-title="Game Options" class="w-2/3 absolute left-20" v-if="games">
          <section class="pb-1 border-b border-site-color-two">
            <button :id="gameOption" @click="getPage('completed')">{{dropDownSelections.Completed}}</button>
          </section>
          <section class="py-1 border-b border-site-color-two">
            <button :id="gameOption" @click="getPage('scheduled')">{{dropDownSelections.Scheduled}}</button>
          </section>
          <section class="pt-1">
            <button :id="gameOption" @click="getPage('playing')">{{dropDownSelections.Playing}}</button>
          </section>
        </SelectDropDown>
      </div>
    </div>
    <div class="flex flex-row">
      <div class="flex flex-col border border-site-color-two p-1 m-1 rounded bg-grey-100 hover:cursor-pointer hover:shadow-md" 
            :class="{'bg-site-color-two text-white' : season.season_number == selectedSeason}" @click="updateSeason(season.season_number)" v-for="season in seasons" :key="season.id">
        Season {{season.season_number}}
      </div>
    </div>
      <div class="flex flex-col w-3/4 mt-10">
        <!-- TODO Something when no games are displayed -->
        <div class="self-center pb-10" v-if="(games.length == 0)">No Games To Show</div>
        
            <div class="flex flex-col w-full" v-for="game in games" :key="game.teams">
              <div class="flex flex-row self-center pb-1"><h1>{{ formatDate(game.completed_at) }}</h1></div>
                  <div class="flex flex-col border shadow-md rounded-xl bg-neutral-100 py-2 md:px-2 lg:px-5 sm:py-1 hover:shadow-gray-400">
                    <router-link :to="{ name: 'GameDetail', params: {id: game.id}}">
                      <template #default>
                        <TeamCard :winningTeam=getWinningTeam(game) :losingTeam=getLosingTeam(game) />
                      </template>
                      <template #fallback>
                        <GameIndexSkeleton/>
                      </template>
                    </router-link>
                  </div><br/>
              </div>
            </div>
          <div
            class="line w-4/5 mt-1 bg-opacity-10 bg-black h-[1px] mb-4"
          ></div>
          <Pagination v-if="(totalPages > 1)"
            :maxVisibleButtons="maxButtonsForPagination()"
            :totalPages='totalPages'
            :totalItems="totalItems"
            :perPage="perPage"
            :currentPage="currentPage"
            @pagechanged='onPageChange'/>
      </div>
  </div>
</template>