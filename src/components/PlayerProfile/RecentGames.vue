<script setup>
import { ref, reactive, computed, onBeforeUpdate} from 'vue';
import GameSummaryCard from '@/components/GameSummaryCard.vue';
import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';

const props = defineProps({
  playerID: Number,
  seasonID: Number,
});

const team = reactive({});
const singlesTeamID = ref(null);
const games = reactive([]);

async function loadSinglesTeamID() {
  const response = await axios.get(`${API_URL}/players/${props.playerID}/teams/singles`);
  if (response.status === 200) {
    singlesTeamID.value = response.data.response.team_id;
  }
}

async function loadGames() {
  const response = await axios.get(`${API_URL}/teams/${singlesTeamID.value}/games/${props.seasonID}`);
  console.log(response);
  if (response.status === 200) {
    const fetchedGames = response.data.response.games;
    const fetchedTeam = response.data.response.team;
    Object.assign(games, fetchedGames);
    Object.assign(team, fetchedTeam);
  }
}

function getOpponentTeam(game) {
  /*
  Formats opponent team data in the way that GameSummaryCard expects it.
  i.e. an array of objects where each object is 
  { name: <player name>, profilePhotoPath: <url> }
  */
  const teamData = game.opponent_team.members.map(member => ({ name: member.name, profilePhotoPath: member.profile_photo_path }));
  return teamData;
}

function getScore(game) {
  /*
  Formats the game's score in the way that GameSummaryCard expects them.
  i.e. { teamOne: <score>, teamTwo: <score> }
  */
  const teamOne = game.given_team.set_score;
  const teamTwo = game.opponent_team.set_score;
  return { teamOne, teamTwo };
}

function getElos(game) {
  /*
  Formats the game's players' elos in the way that GameSummaryCard expects them.
  */
  const elos = {
    teamOne: {
      elo: 2500,
      eloDiff: 439
    },
    teamTwo: {
      elo: 2342,
      eloDiff: -123
    }
  };
  return elos;
}

const selfTeam = computed(() => {
  /*
  Formats the given player's singles team in the way that GameSummaryCard expects.
  */
  const selfTeamData = team.members.map(member => ({ name: member.name, profilePhotoPath: member.profile_photo_path }));
  return selfTeamData;
});

const singlesGames = computed(() => {
  /*
  Returns all the games for the given player where the opponent_team has only 
  one members i.e. all the 1v1 games.
  */
  return games.filter(game => game.opponent_team.members.length === 1);
});

async function loadData() {
  await loadSinglesTeamID();
  await loadGames();
}


onBeforeUpdate(async () => await loadData());
await loadData();

</script>


<template>
  <div class="recent-games max-w-[750px] w-full flex flex-col items-center px-6 mt-6">
    <div class="flex justify-between w-full">
      <div class="text-lg ml-2">Recent Games</div>
    </div>

    <GameSummaryCard
      v-for="game in singlesGames.slice(0, 3)"
      :key="game.id" 
      :teamOne="selfTeam"
      :teamTwo="getOpponentTeam(game)"
      :score="getScore(game)"
      :elos="getElos(game)"
    />
    <div class="flex justify-end w-full">
      <div class="text-sm hover:underline cursor-pointer mt-1 mr-2">View Complete Game History</div>
    </div>
  </div>
</template>