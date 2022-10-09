import { createRouter, createWebHistory } from 'vue-router';

import Sandbox from '@/views/Sandbox.vue';
import Home from '@/views/Home.vue';
import PlayMatch from '@/views/PlayMatch.vue';
import Leaderboard from '@/views/Leaderboard.vue';
import Profile from '@/views/Profile.vue';
import Example from '@/views/Example.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/sandbox', component: Sandbox, name: 'Sandbox'},
  { path: '/leaderboard', component: Leaderboard, name: 'Leaderboard' },
  { path: '/profile', component: Profile, name: 'Profile'},
  { path: '/play', component: PlayMatch, name: 'Play'},
  { path: '/example', component: Example, name: 'Example'},
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // linkActiveClass: 'border-2 border',
});

export default router;