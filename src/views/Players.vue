<script setup>
import axios from "axios";
import { API_URL, PLAYERS } from '@/stores/utils/backendRouteParts.js'
import { onMounted, ref } from 'vue'
import Pagination from '../components/Pagination.vue'

const players = ref([]);
const teamMembers = [];
const totalItems = ref(10);
const currentPage = ref(1);
const perPage = 10;
const totalPages = ref(1);
let gameNum = 0;
let page = 1;

onMounted(async () => {
  await getPlayersRequest();
  try {
    const responseNumPlay = await axios.get(API_URL + PLAYERS);

    if(responseNumPlay.status === 200) {
      const fetchedNum = responseNumPlay.data.response.players.length;
      totalItems.value = fetchedNum;
      totalPages.value = Math.ceil(totalItems.value / perPage);
    }
  } catch (err) {
    console.error(err);
  }
})

const getPlayersRequest = async () => {
  try {
    const response = await axios.get(API_URL + PLAYERS + "?page=" + currentPage.value + "&size=" + perPage);

    if(response.status === 200) {
      const fetchedPlayers = response.data.response.players;
      // Object.assign(players, fetchedPlayers);
      players.value = fetchedPlayers;
    }
  } catch (err) {
    console.error(err);
  }

  };

/**
 * Used for pagination component
 * @param {*} page 
 */
 function onPageChange(page) {
  console.log("page is " + page);
  currentPage.value = page;
  getPlayersRequest();
}

function maxButtonsForPagination() {
  return totalPages.value < 3 ? totalPages.value : 3;
}

</script>


<template>
  <body>
    <div class="body flex justify-center w-full">
      <div
        class="
          flex flex-col
          sm:w-[30rem]

          bg-white
          rounded-3xl
          m-6
          border border-site-color-two
          shadow-lg
          items-center
        "
      >
        <p class="flex text-4xl font-semibold m-4">Registered Players</p>

        <div class="flex flex-col px-8">
              <div class="flex flex-row" v-for="player in players" :key="player">
                <router-link class="flex w-full p-1" :to="{ name: 'Player', params: {id: player.id}}">
                  <div class="flex w-full border border-site-color-two shadow-md rounded-xl my-1 px-3 lg:py-3 lg:px-5 bg-stone-100 hover:bg-stone-50">
                    <div class="flex-1 w-auto">
                      <img class="rounded-full h-20 w-20 object-cover" :src="player.profile_photo_url">
                    </div>
                    <div class="flex-1 font-semibold self-center pl-4">{{player.name}}</div> 
                  </div>
                </router-link>
              </div>
        </div>
        <div v-if="players">
        <div class="w-4/5 lg:mt-3 mt-1 bg-opacity-10 bg-black h-[1px] mb-4" v-if="(totalPages > 1)"></div>
          <pagination v-if="(totalPages > 1)"
          :maxVisibleButtons="maxButtonsForPagination()"
          :totalPages='totalPages'
          :totalItems="totalItems"
          :perPage="perPage"
          :currentPage="currentPage"
          @pagechanged='onPageChange'
          />
      </div>
    </div>
    </div>
  </body>
</template>
