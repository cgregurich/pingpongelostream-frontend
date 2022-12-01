import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';

import router from '@/router';

const pinia = createPinia();

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faLock, faTableTennisPaddleBall, faEnvelope, faTrophy, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUser, faLock, faTableTennisPaddleBall, faEnvelope, faTrophy, faXmark);

createApp(App)
  .use(pinia)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
