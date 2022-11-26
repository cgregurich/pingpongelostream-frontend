<script>
import axios from "axios";
import { ref, reactive, computed, onBeforeUpdate} from 'vue';
import { API_URL, GAMES } from '@/stores/utils/backendRouteParts.js'
import GameSummaryCard from '../components/GameSummaryCard.vue';


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

const selfTeam = computed(() => {
  /*
  Formats the given player's singles team in the way that GameSummaryCard expects.
  */
  const selfTeamData = team.members.map(member => ({ name: member.name, profilePhotoPath: member.profile_photo_path }));
  return selfTeamData;
});

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
  console.log(game);
  const elos = {
    teamOne: {
      eloAfter: game.given_team.elo_after,
      eloChange: game.given_team.elo_change
    },
    teamTwo: {
      eloAfter: game.opponent_team.elo_after,
      eloChange: game.opponent_team.elo_change
    }
  };
  return elos;
}

export default {
  data() {
    return {
      game: null,
    }
  },
  props: {
  },
  async created() {
      try {
        const response = await axios.get(API_URL + GAMES + "/" + this.$route.params.id);
        if(response.status === 200) {
            const fetchedGame = response.data.response.game;
            this.game = fetchedGame;
            console.log(this.game);
        }
      } catch (err) {
        console.error(err);
      }
  },
  methods: {

  }
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
        bg-natural-100
      ">
    <div class="flex flex-row w-full p-4 pt-7">
      <div class="flex w-full text-3xl font-semibold relative left-20" v-for="team in game.teams" :key="team.id">
      <div class="flex" v-for="member in team.members" :key="member.id">{{member.name}}</div></div>
    </div>
    <div>{{game.completed_at}}</div>
      <div class="flex" v-for="set in game.sets" :key="set.id">
        {{set.team1_score}} - 
        {{set.team2_score}}
        
      </div>
    


    </div>
  </div>
</template>