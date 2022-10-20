<script setup>
import axios from 'axios';
import { ref, reactive } from 'vue';
import FormInput from '@/components/FormInput.vue';

const userID = ref('2');
const playerName = ref('');
const playerProfilePhotoPath = ref('');
const elo = ref(0);
const ranking = ref(0);

async function getUser() {
  const url = `http://pingpong.test/api/players/${userID.value}`;
  const response = await axios.get(url);
  const player = response.data.response.player;
  playerName.value = player.name;
  playerProfilePhotoPath.value = player.profile_photo_path;
}

async function getStats() {
  const currentSeason = 1;
  const url = `http://pingpong.test/api/players/${userID.value}/teams/singles/ranking/season/${currentSeason}`;
  const response = await axios.get(url);
  const data = response.data.response;
  console.log(data);
  elo.value = data.elo;
  ranking.value = data.ranking;

}
</script>

<template>

  <FormInput labelText="User ID" v-model:enteredText="userID"/>
  <button @click="getUser">Get User</button>
  <button @click="getStats">Get Stats</button>
  <button @click="test" class="border-2 border-black m-12 text-4xl">button click</button>
  <div class="player">name: {{ playerName }}<br>
    <img :src="playerProfilePhotoPath" alt=""><br>
    elo: {{ elo }}
    <br>
    ranking: #{{ ranking }}
  </div>
</template>