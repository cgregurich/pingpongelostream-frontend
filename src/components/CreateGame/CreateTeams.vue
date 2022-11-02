
<script setup>
import TextInput from '@/components/TextInput.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import PlayerCard from '@/components/CreateGame/PlayerCard.vue';
import PlayerCardSkeleton from '@/components/CreateGame/PlayerCardSkeleton.vue';
import { ref, reactive, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';


/*

WILO 11/1

main goal is now connecting it to the backend. packaging up the data and submitting a POST request to /api/games.
Currently that route doesn't even work for me, even when sending no data.
But besides that, I need to find a way to get the team_id for the two teams. With singles,
it's fairly straightforward and I've implemented it. 
For doubles, it's a challenge. There are two paths: the pair of players have played together before,
and therefore have a team_id in the DB. I need to find that.
Or, the two players have not played together before, in which case I need to create a new team.
There's currently no teams routes, so I'm kinda stuck.

I can and should make a utils.js file or something to have my axios api calls that aren't
related to the pinia store. I still have random axios calls floating around in my profile page,
as well as in this file now.

Also need to improve the UI.

*/

const props = defineProps({
  gameMode: Object,
});



const teamOneInput = ref('');
const teamTwoInput = ref('');
const unassignedInput = ref('');
const isLoading = ref(false);

const players = reactive([]);

const unassignedMembers = reactive([]);
const teamOneMembers = reactive([]);
const teamTwoMembers = reactive([]);


onMounted(async () => {
  isLoading.value = true;
  const response = await axios.get(`${API_URL}/players`);
  Object.assign(players, response.data.response.players);
  isLoading.value = false;
  setUp(); // TODO: remove, used for testing
});

function setUp() {
  unassignedMembers.push(getPlayer('alex wissing'));
  unassignedMembers.push(getPlayer('colin gregurich'));
  unassignedMembers.push(getPlayer('terrah quinlan'));
  unassignedMembers.push(getPlayer('kelvin chin'));
}

function getPlayer(search) {
  // Tries to find player where search matches name or email
  let player = players.filter(player => player.name.toLowerCase() === search.toLowerCase() || player.email.toLowerCase() === search.toLowerCase())[0];
  return player;
}

function unassignedAddMember() {
  const newMember = getPlayer(unassignedInput.value);
  if (canAddMember(newMember)) {
    unassignedMembers.push(newMember);
    unassignedInput.value = '';
  }
}

function canAddMember(member) {
  return member != null && !unassignedMembers.includes(member) && !teamTwoMembers.includes(member) && !teamOneMembers.includes(member);
}

function moveToTeamOne(member) {
  if (teamOneMembers.length >= membersAllowedPerTeam.value) return;
  deleteMember(member);
  teamOneMembers.push(member);
}

function moveToTeamTwo(member) {
  if (teamTwoMembers.length >= membersAllowedPerTeam.value) return;
  deleteMember(member);
  teamTwoMembers.push(member);
}

function moveToUnassigned(member) {
  deleteMember(member);
  unassignedMembers.push(member);
}

function deleteMember(member) {
  if (teamOneMembers.includes(member)) {
    const indexToDelete = teamOneMembers.indexOf(member);
    teamOneMembers.splice(indexToDelete, 1);
  }
  else if (teamTwoMembers.includes(member)) {
    const indexToDelete = teamTwoMembers.indexOf(member);
    teamTwoMembers.splice(indexToDelete, 1);
  }
  else if (unassignedMembers.includes(member)) {
    const indexToDelete = unassignedMembers.indexOf(member);
    unassignedMembers.splice(indexToDelete, 1);
  }
}

const totalPlayers = computed(() => unassignedMembers.length + teamOneMembers.length + teamTwoMembers.length);
const membersAllowedPerTeam = computed(() => props.gameMode?.players / 2 || 0);

watch(membersAllowedPerTeam, () => {
  /*
  Watch for membersAllowedPerTeam to change, and if the number of members on a team
  is greater than the new membersAllowedPerTeam, we need to move the overflow
  of players back to unassigned.
  */
  let extraMembers = null;
  if (teamOneMembers.length > membersAllowedPerTeam.value) {
    // Starting at the first "overflow" member, splice to the end of the members
    extraMembers = teamOneMembers.splice(membersAllowedPerTeam.value, teamOneMembers.length - membersAllowedPerTeam.value);
    // Then move each of these members to unassigned 
    extraMembers.forEach(member => moveToUnassigned(member));
  }
  // Same as above, but for team two
  if (teamTwoMembers.length > membersAllowedPerTeam.value) {
    extraMembers = teamTwoMembers.splice(membersAllowedPerTeam.value, teamTwoMembers.length - membersAllowedPerTeam.value);
    extraMembers.forEach(member => moveToUnassigned(member));
  }
});

const canCreateGame = computed(() => {
  return teamOneMembers.length === membersAllowedPerTeam.value && teamTwoMembers.length === membersAllowedPerTeam.value;
});


function createGameClicked() {
  if (!canCreateGame.value) { 
    console.log('Can\'t create game!!');
    return;
  }
  if (props.gameMode.id === 1) {
    // singles
    createSinglesGame();
  }
  else if (props.gameMode.id === 2) {
    // doubles
    createDoublesGame();
  }

}

async function createSinglesGame() {
  // FIXME: currently doing singles since that's easier. will work on doubles after
  const teamOneID = await getPlayerOneSinglesTeamID();
  const teamTwoID = await getPlayerTwoSinglesTeamID();
  const teamOneFirstServerID = teamOneMembers[0].id;
  const teamTwoFirstServerID = teamTwoMembers[0].id;
  const firstServer = 'team1'; // FIXME: is this even what the backend wants?
  const requestBody = {
    mode_id: props.gameMode.id,
    team1_id: teamOneID,
    team2_id: teamTwoID,
    team1_first_server_id: teamOneFirstServerID,
    team2_first_server_id: teamTwoFirstServerID,
    first_server: 'team1'
  };
  const response = await axios.post(`${API_URL}/games`, requestBody);
  console.log(response);
}

async function createDoublesGame() {
  const teamOneID = await getTeamOneID();
  const teamTwoID = await getTeamTwoID();
  const teamOneFirstServerID = teamOneMembers[0].id; // FIXME: just taking the first player for now
  const teamTwoFirstServerID = teamTwoMembers[0].id; // FIXME: just taking the first player for now
}

async function getPlayerOneSinglesTeamID() {
  // FIXME: only worrying about, and assuming, singles right now
  const response = await axios.get(`${API_URL}/players/${teamOneMembers[0].id}/teams/singles`);
  return response.data.response.team_id;
}

async function getPlayerTwoSinglesTeamID() {
  // FIXME: only worrying about, and assuming, singles right now
  const response = await axios.get(`${API_URL}/players/${teamTwoMembers[0].id}/teams/singles`);
  return response.data.response.team_id;

}

</script>
<template>



<div class="flex relative h-[calc(100vh-4rem-1px)]">
  <!-- Team One Container -->
  <div class="team-one flex flex-col items-center justify-start bg-purple-800 w-full h-full">
    <div class="team-name flex justify-center items-center text-purple-200 text-2xl">Team One</div>
    <div class="members-container flex flex-col items-center justify-center w-5/6 h-5/6 mx-4">
      <div class="member" v-for="member in teamOneMembers" :key="member.id">
        <PlayerCard :player="member" :team="1" @delete="deleteMember(member)" @moveRight="moveToUnassigned(member)"/>
      </div>
      <div class="member-skeleton" v-for="i in membersAllowedPerTeam - teamOneMembers.length" :key="i">
        <PlayerCardSkeleton />
      </div>
    </div>
  </div>

  <!-- Unassigned PlayerOnes -->
  <div class="unassigned flex flex-col items-center justify-start bg-gray-000 bg-purple-200 w-full h-full overflow-auto">

    <div class="flex justify-center items-center text-2xl text-purple-800">Unassigned</div>
    <div class="add-member flex items-center">
      <TextInput class="" v-model:enteredText="unassignedInput" @keydown.enter="unassignedAddMember" />
      <PrimaryButton text="Add" @click="unassignedAddMember" class="ml-4 text-xs" />
    </div>
    <PrimaryButton class="text-xs" text="Create Game" @click="createGameClicked" :disabled="!canCreateGame"/>
    <div class="members-container flex flex-col items-center justify-center">
      <div class="member" v-for="member in unassignedMembers" :key="member.id">
        <PlayerCard :player="member" @delete="deleteMember(member)" @moveLeft="moveToTeamOne(member)" @moveRight="moveToTeamTwo(member)"/>
      </div>
    </div>
  </div>

  <!-- Team Two Container -->
  <div class="team-two flex flex-col items-center justify-start bg-purple-800 w-full h-full">
    <div class="team-name flex justify-center items-center text-purple-200 text-2xl">Team Two</div>
    <div class="members-container flex flex-col items-center justify-center w-5/6 h-5/6 mx-4">
      <div class="member" v-for="member in teamTwoMembers" :key="member.id">
        <PlayerCard :player="member" :team="2" @delete="deleteMember(member)" @moveLeft="moveToUnassigned(member)"/>
      </div>
      <div class="member-skeleton" v-for="i in membersAllowedPerTeam - teamTwoMembers.length" :key="i">
        <PlayerCardSkeleton />
      </div>
    </div>
  </div>
</div>

</template>