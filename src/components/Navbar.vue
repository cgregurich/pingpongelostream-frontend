<script setup>
import { ref } from 'vue';
const navItems = ref([
  { text: 'Play A Match', routeName: 'Play' },
  { text: 'Leaderboard', routeName: 'Leaderboard' },
  { text: 'Profile', routeName: 'Profile' },
  { text: 'Example', routeName: 'Example' },
  { text: 'Log In', routeName: 'Login' },
  { text: 'Register', routeName: 'Register' },
  ]);
// const bg = ref('bg-emerald-600');
// const fg = ref('text-white');
</script>


<template>
<nav class="navbar flex items-center py-2" :class="bg">
  <div class="logo flex items-center text-2xl font-bold" :class="[fg, bg]">
    <font-awesome-icon icon="fa-table-tennis-paddle-ball" class="pl-4 pr-1" />
    Attic Ping Pong
  </div>
  <router-link
    v-for="(navItem, index) in navItems"
    :key="index"
    class="mx-6 px-6 text-lg w-max border-0 border-black"
    :class="fg"
    active-class="border-b-4 border-black"
    :to="{ name: navItem.routeName }"
  >
    {{ navItem.text }}
  </router-link>
</nav>  
</template>