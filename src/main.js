import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';

import router from '@/router';

const pinia = createPinia();

import { library } from '@fortawesome/fontawesome-svg-core';

import { faEnvelope, faUser, faLock, faTableTennisPaddleBall, faArrowRotateLeft, faTrashAlt, faArrowLeft, faArrowRight, faLongArrowAltLeft, faLongArrowAltRight, faTrophy, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faEnvelope, faUser, faLock, faTableTennisPaddleBall, faArrowRotateLeft, faTrashAlt, faArrowLeft, faArrowRight, faLongArrowAltLeft, faLongArrowAltRight, faTrophy, faXmark);

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

createApp(App)
  .use(pinia)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('v-select', vSelect)
  .mount('#app');
