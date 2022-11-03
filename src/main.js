import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';

import router from '@/router';

const pinia = createPinia();

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faLock, faTableTennisPaddleBall, faArrowRotateLeft, faTrashAlt, faArrowLeft, faArrowRight, faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUser, faLock, faTableTennisPaddleBall, faArrowRotateLeft, faTrashAlt, faArrowLeft, faArrowRight, faLongArrowAltLeft, faLongArrowAltRight);

createApp(App)
  .use(pinia)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
