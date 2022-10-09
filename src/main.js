import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';


import router from '@/router';

const pinia = createPinia();


import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faLock, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUser, faLock, faTableTennisPaddleBall);

createApp(App)
  .use(router)
  .use(pinia)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
