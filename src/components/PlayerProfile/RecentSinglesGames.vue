<script setup>
import { ref, reactive, computed, toRaw } from 'vue';
import GameSummaryCard from '@/components/GameSummaryCard.vue';
import * as apiCalls from '@/utils/apiCalls.js';
import * as toasts from '@/utils/toasts.js';

const props = defineProps({
  playerID: Number,
  seasonID: Number,
});

const singlesTeamID = ref(null);
const player = reactive({});
const games = reactive([]);

async function loadPlayer() {
  const fetchedPlayer = await apiCalls.getPlayer(props.playerID);
  if (fetchedPlayer) Object.assign(player, fetchedPlayer);
}

async function loadSinglesTeamID() {
  const fetchedTeamID = await apiCalls.getPlayerSinglesTeamID(props.playerID);
  if (fetchedTeamID) singlesTeamID.value = fetchedTeamID;
}

async function loadGames() {
  const fetchedGames = await apiCalls.getGamesForTeam(singlesTeamID.value, props.seasonID);
  if (fetchedGames) Object.assign(games, fetchedGames);
}

function getOpponentTeam(game) {
  /*
  Formats opponent team data in the way that GameSummaryCard expects it.
  i.e. an array of objects where each object is 
  { name: <player name>, profilePhotoPath: <url> }
  */
  const teamData = game.opponent_team.members.map(member => ({ name: member.name, profilePhotoPath: member.profile_photo_url }));
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

const selfTeam = computed(() => {
  /*
  Formats the given player's singles team in the way that GameSummaryCard expects.
  */
  const selfTeamData = [{ name: player.name, profilePhotoPath: player.profile_photo_url }];
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
  await loadPlayer();
  await loadSinglesTeamID();
  await loadGames();
}

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