const noLoginRequired = [
  { path: '/', component: () => import('@/views/Home.vue'), name: 'Home' },
  { path: '/login', component: () => import('@/views/Login.vue'), name: 'Login' }
]
const loginNotRequired = [
  { path: '/sandbox', component: () => import('@/views/Sandbox.vue'), name: 'Sandbox' },
  { path: '/leaderboard', component: () => import('@/views/Leaderboard.vue'), name: 'Leaderboard' },
  { path: '/profile', component: () => import('@/views/Profile.vue'), name: 'Profile' },
  { path: '/example', component: () => import('@/views/Example.vue'), name: 'Example' },
  { path: '/games', component: () => import('@/views/Games.vue'), name: 'Games' },
  { path: '/players', component: () => import('@/views/Players.vue'), name: 'Players' },
  { path: '/players/:id', component: () => import('@/views/Profile.vue'), name: 'Player' }
];

const loginRequired = [
  { path: '/dashboard', component: () => import('@/views/Dashboard.vue'), name: 'Dashboard' },
  { path: '/livestream', component: () => import('@/views/Livestream.vue'), name: 'Livestream' },
  { path: '/games/create', component: () => import('@/views/CreateGame.vue'), name: 'CreateGame' },
  { path: '/profile/edit', component: () => import('@/views/EditProfile.vue'), name: 'EditProfile' },
  { path: '/play/:gameID', props: route => ({ gameID: Number(route.params.gameID) }), component: () => import('@/views/PlayGame.vue'), name: 'Play'}
];

const publicRoutes = [ ... noLoginRequired, ...loginNotRequired ];
const privateRoutes = [ ...loginRequired ];

console.log(noLoginRequired, loginNotRequired, loginRequired, publicRoutes, privateRoutes);

export {
    noLoginRequired,
    loginNotRequired,
    loginRequired,
    publicRoutes,
    privateRoutes
};
