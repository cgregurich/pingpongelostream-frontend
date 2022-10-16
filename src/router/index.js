import { createRouter, createWebHistory } from 'vue-router';

import Sandbox from '@/views/Sandbox.vue';
import Home from '@/views/Home.vue';
import PlayMatch from '@/views/PlayMatch.vue';
import Leaderboard from '@/views/Leaderboard.vue';
import Profile from '@/views/Profile.vue';
import Example from '@/views/Example.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import Games from '@/views/Games.vue';
import Players from '@/views/Players.vue';
import Livestream from '@/views/Livestream.vue';
import CreateGame from '@/views/CreateGame.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/sandbox', component: Sandbox, name: 'Sandbox'},
  { path: '/leaderboard', component: Leaderboard, name: 'Leaderboard' },
  { path: '/profile', component: Profile, name: 'Profile'},
  { path: '/play', component: PlayMatch, name: 'Play'},
  { path: '/example', component: Example, name: 'Example'},
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
  { path: '/games', component: Games, name: 'Games' },
  { path: '/players', component: Players, name: 'Players' },
  { path: '/livestream', component: Livestream, name: 'Livestream' },
  { path: '/games/create', component: CreateGame, name: 'CreateGame' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // linkActiveClass: 'border-2 border',
});

export default router;