<script setup>
import { ref } from 'vue';
const props = defineProps({
  players: Array,
  teamNumber: Number,
  setScore: Number,
  gameScore: Number,
  disabled: Boolean,
  wonSets: Array,
  server: Number,
  foreground: String,
  background: String,
});

function getClasses() {
  const classes = [];
  if (props.disabled) classes.push('cursor-not-allowed');
  if (props.teamNumber === 1) {
    classes.push('bg-play-game-color-one');
    classes.push('text-play-game-color-two');
  }
  else if (props.teamNumber === 2) {
    classes.push('bg-play-game-color-two');
    classes.push('text-play-game-color-one');
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
  <!-- Serving Indicator -->
  <!-- For Left Team -->
  <div v-show="teamNumber === 1 && server === teamNumber" class="serving w-[50px] h-[50px] rounded-full absolute top-24 right-10 bg-play-game-color-two"></div>
  <!-- For Right Team -->
  <div v-show="teamNumber === 2 && server === teamNumber" class="serving w-[50px] h-[50px] rounded-full absolute top-24 left-10 bg-play-game-color-one"></div>

  <!-- Player Names -->
  <div class="players flex justify-around w-full">
    <div v-for="(player, index) in players" :key="index" class="username text-2xl">
      {{ player }}
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
  <div v-show="teamNumber === 1" class="p1-won-sets w-full flex justify-around">
    <div class="won-set text-xl font-bold bg-play-game-color-two text-play-game-color-one rounded-lg px-2 py-3" v-for="(set, index) in wonSets" :key="index">
      {{ set.p1Score }} - {{ set.p2Score }}
    </div>
  </div>
  
  <!-- For Right Team -->
  <div v-if="teamNumber === 2" class="p2-won-sets w-full flex justify-around">
    <div class="won-set text-xl font-bold bg-play-game-color-one text-play-game-color-two rounded-lg px-2 py-3" v-for="(set, index) in wonSets" :key="index">
      {{ set.p1Score }} - {{ set.p2Score }}
    </div>
  </div>
</div>
</template>