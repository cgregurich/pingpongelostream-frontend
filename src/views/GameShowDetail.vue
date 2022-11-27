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
      setNum: 1,
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
    formatDate(date) {
      const options = {year: 'numeric', month: 'long', day: 'numeric'}
      return new Date(date).toLocaleDateString('en', options)
    },

  },
}
</script>

<template>
<div class="flex justify-center">
  <div class="
        flex flex-col
        sm:w-[60rem]
        rounded-3xl
        m-10
        p-5
        border border-gray-300
        shadow-lg
        bg-white">
    <div class="flex justify-center">{{ formatDate(game.completed_at) }}</div>
    <div class="flex border-b border-r border-gray-300 p-2" v-for="team in game.teams" :key="team.id">
      <div class="flex-1">
        <div class="flex text-3xl font-semibold p-1" v-for="member in team.members" :key="member.id">
          {{member.name}}
        </div>
      </div>
      <div class="flex-1 py-4 text-5xl font-semibold">
        <div class="flex" v-if="game.teams.indexOf(team) == 0">
          <div class="flex-1" v-for="set in game.sets" :key="set.id">
              {{set.team1_score}}
          </div>
        </div>
        <div class="flex" v-if="game.teams.indexOf(team) == 1">
          <div class="flex-1" v-for="set in game.sets" :key="set.id">
              {{set.team2_score}}
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="flex py-4">
      <div class="flex" v-for="set in game.sets" :key="set.id">
          {{set.set_number}}. 
          {{set.team1_score}} - 
          {{set.team2_score}}
      </div>
    </div> -->
  </div>
</div>
</template>