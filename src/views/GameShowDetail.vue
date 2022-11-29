<script>
import axios from "axios";
import { ref, reactive, computed, onBeforeUpdate} from 'vue';
import { API_URL, GAMES } from '@/stores/utils/backendRouteParts.js'
import GameSummaryCard from '../components/GameSummaryCard.vue';
import GameShowContent from "../components/GameShowContent.vue";


export default {
    data() {
        return {
            game: null,
            setNum: 1,
            // player: [],
            team1Score: 0,
            team2Score: 0,
        };
    },
    props: {},
    async created() {
        // async function getResponsePlayer(id) {
        //   const playerResponse = await axios.get(API_URL + "/players/" + id);
        //   if(playerResponse.status === 200) {
        //     const fetchedPlayer = playerResponse.data.response.player;
        //     return fetchedPlayer;
        //   }
        // }
        try {
            const gameResponse = await axios.get(API_URL + GAMES + "/" + this.$route.params.id);
            if (gameResponse.status === 200) {
                const fetchedGame = gameResponse.data.response.game;
                this.game = fetchedGame;
                console.log(this.game);
            }
        }
        catch (err) {
            console.error(err);
        }
        // console.log(this.game.teams[0].members[0].id)
        // try {
        //   this.game.teams.forEach(element => {
        //     element.members.forEach(element2 => {
        //       this.player.push(getResponsePlayer(element2.id));
        //     })
        //   });
        //   console.log(this.player);
        // } catch (err) {
        //   console.error(err);
        // }
        this.game.sets.forEach(element => element.team1_score > element.team2_score ? this.team1Score++ : this.team2Score++);
    },
    methods: {
        formatDate(date) {
            const options = { year: "numeric", month: "long", day: "numeric" };
            return new Date(date).toLocaleDateString("en", options);
        },
        async getProfilePhoto(playerId) {
            try {
                const playerResponse = await axios.get(API_URL + "/players/" + playerId);
                if (playerResponse.status === 200) {
                    const fetchedPlayer = playerResponse.data.response.player;
                    this.player = fetchedPlayer;
                    // console.log(this.player);
                    return this.player;
                }
            }
            catch (err) {
                console.error(err);
            }
        },
    },
    components: { GameShowContent }
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
    <div class="flex justify-center pb-5">{{ formatDate(game.completed_at) }}</div>
      <!-- Tennis style set scores in a box -->
    <div class="border border-gray-300 rounded-md shadow-md"> 
    <div class="flex p-4" v-for="team in game.teams" :key="team.id" :class="{'border-b border-gray-300' : game.teams.indexOf(team) == 0 }">
      <div class="flex-1">
        <div class="flex lg:text-3xl sm:text-2xl font-semibold p-1" v-for="member in team.members" :key="member.id">
          <img class="border border-blue-800 rounded-full w-9 shadow-2xl" :src="getProfilePhoto(member.id).profile_photo_path">
          <!-- <img class="rounded-full w-10 shadow-2xl" src="https://media.istockphoto.com/id/938218100/vector/ping-pong-rackets-and-ball.jpg?s=612x612&w=is&k=20&c=1kbr77_rXFKJmF86JO3jS7z_2Te_bY_VzOSesCsDMf8="> -->
          <div class="pl-3">
            {{member.name}}
          </div>
        </div>
      </div>
      <div class="flex-1 lg:text-5xl sm:text-4xl self-center font-normal text-gray-700">
        <div class="flex" v-if="game.teams.indexOf(team) == 0">
          <div class="flex-1 text-center" :class="{ 'text-black font-semibold' : set.team1_score > set.team2_score}" v-for="set in game.sets" :key="set.id">
              {{set.team1_score}}
          </div>
        </div>
        <div class="flex" v-if="game.teams.indexOf(team) == 1">
          <div class="flex-1 text-center" :class="{ 'text-black font-semibold' : set.team2_score > set.team1_score}" v-for="set in game.sets" :key="set.id">
              {{set.team2_score}}
          </div>
        </div>
      </div>
    </div>
    </div>
    <!-- Wordy part. TODO: add leaderboard info -->
    <GameShowContent
      :game="game"
      :team1="game.teams[0]"
      :team2="game.teams[1]"
      :team1Score="team1Score"
      :team2Score="team2Score"
    />
  </div>
</div>
</template>