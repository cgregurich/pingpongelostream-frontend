<script setup>
import { ref } from 'vue';
const navItems = ref([
  { text: 'Play A Match', routeName: 'Play' },
  { text: 'Leaderboard', routeName: 'Leaderboard' },
  { text: 'About', routeName: 'About' },
  { text: 'Profie', routeName: 'Profile' },
  ]);
const bg = ref('bg-emerald-600');
const fg = ref('text-white');
</script>


<template>
<nav class="navbar flex items-center" :class="bg">
  <div class="logo flex items-center text-2xl font-bold" :class="[fg, bg]">
    Attic Ping Pong
  </div>
  <div class="nav-item mx-12 text-lg" :class="fg" v-for="(navItem, index) in navItems" :key="index">
    <router-link :to="{ name: navItem.routeName }">{{ navItem.text }}</router-link>
  </div>
</nav>  
</template>