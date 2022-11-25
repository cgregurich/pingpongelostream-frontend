<script setup>
import { ref } from 'vue';
const props = defineProps({
  players: Array,
  teamNumber: Number,
  setScore: Number,
  gameScore: Number,
  disabled: Boolean,
  wonSets: Array,
  servingPlayerID: Number,
  foreground: String,
  background: String,
});

function getClasses() {
  const classes = [];
  if (props.disabled) classes.push('cursor-not-allowed');
  if (props.teamNumber === 1) {
    classes.push('bg-site-color-one');
    classes.push('text-site-color-two');
  }
  else if (props.teamNumber === 2) {
    classes.push('bg-site-color-two');
    classes.push('text-site-color-one');
  }
  return classes;
}


</script>


<template>
<!-- 
  Why the weird duplication in the HTML? This was the best way I could figure out
  how to implement the opposite colors between team 1 and team 2 while having
  a single TeamContainer component. Otherwise there'd be a some functions in the
  <script> that returns an array of classes based on conditionals, and then I'd
  use :class to use those classes. Then I would also have needed to come up with 
  a way to conditionally set the absolute positioning of the server indicator
  (since team 1's indicator is on the right side and team 2's indicator is on the
  left side)
  So while this means the code isn't DRY, it's less convoluted than it otherwise
  would've been
 -->
<div 
  class="team-container relative flex flex-col items-center justify-around w-full select-none"
  :class="getClasses()"
>
  <!-- Players -->
  <div class="players flex justify-around w-full">
    <!-- Player Name and Profile Pic -->
    <div v-for="(player, index) in players" :key="index" class="player-name flex flex-col items-center text-2xl">
      <div class="player-info flex items-center">
        <div class="image-container">
          <img class="h-12 w-12 rounded-full mr-4 border border-black border-opacity-10" :src="player.profile_photo_path">
          <div class="h-[50px] w-[1px]"></div>
        </div>
        <div class="name-container flex flex-col justify-center items-center">
          {{ player.name }}
          <!-- Serving Indicator -->
          <div class="serving-indicator w-[50px] h-[50px] rounded-full bg-site-color-two" v-show="teamNumber === 1 && servingPlayerID === player.id"></div>
          <div class="serving-indicator w-[50px] h-[50px] rounded-full bg-site-color-one" v-show="teamNumber === 2 && servingPlayerID === player.id"></div>
          <!-- This exists to avoid the visible shifting when the serving indicator toggles -->
          <div class="serving-indicator-spacer h-[50px] w-[1px]" v-show="servingPlayerID !== player.id"></div>

        </div>
      </div>


    </div>
    <div v-if="players.length === 0" class="player-name-skeleton w-[150px] h-[32px] bg-black opacity-10 rounded-lg animate-pulse">
    </div>
  </div>

  <!-- Set Score -->
  <div class="set-score text-9xl flex flex-col items-center">
    {{ setScore }}
    <div class="buttons text-6xl flex justify-around w-min">
  </div>

  <!-- Game Score -->
  </div>
  <div class="game-score text-5xl">{{ gameScore }}</div>

  <!-- Previous Sets -->
  <!-- For Left Team -->
  <div v-show="teamNumber === 1" class="team-one-won-sets w-full flex justify-around items-center h-[75px]">
    <div class="won-set text-xl h-max font-bold bg-site-color-two text-site-color-one rounded-lg px-2 py-3" v-for="(set, index) in wonSets" :key="index">
      {{ set.teamOneScore }} - {{ set.teamTwoScore }}
    </div>
  </div>
  
  <!-- For Right Team -->
  <div v-if="teamNumber === 2" class="team-two-won-sets w-full flex justify-around items-center h-[75px]">
    <div class="won-set text-xl font-bold bg-site-color-one text-site-color-two rounded-lg px-2 py-3" v-for="(set, index) in wonSets" :key="index">
      {{ set.teamOneScore }} - {{ set.teamTwoScore }}
    </div>
  </div>
</div>
</template>