import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import Sandbox from '@/components/Sandbox.vue';
import Home from '@/components/Home.vue';
import PlayMatch from '@/components/PlayMatch.vue';
import Leaderboard from '@/components/Leaderboard.vue';
import About from '@/components/About.vue';
import Profile from '@/components/Profile.vue';
import Example from '@/components/Example.vue';

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: Home },
  { path: '/sandbox', component: Sandbox, name: 'Sandbox'},
  { path: '/leaderboard', component: Leaderboard, name: 'Leaderboard' },
  { path: '/about', component: About, name: 'About'},
  { path: '/profile', component: Profile, name: 'Profile'},
  { path: '/play', component: PlayMatch, name: 'Play'},
  { path: '/example', component: Example, name: 'Example'},
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


const pinia = createPinia();



createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app');
