import { createRouter, createWebHistory } from 'vue-router';
import { getAllRoutes, isRoutePublic } from './route-util';
import { useAuthStore } from '../stores/modules/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: getAllRoutes()
  // linkActiveClass: 'border-2 border',
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // pinia fails if this isnt in here
  let token = authStore.token;
  let tokenNotRequired = isRoutePublic(to);
  if (tokenNotRequired && token) {
    authStore.getUser()
      .then(() => next())
      .catch(() => {
        authStore.logout(); // if cant get user, token must be bad, logout.
        // dont need to change pages tho
      });
  }
  else if (!tokenNotRequired) { // must do auth check
    if (token !== undefined && token !== null) {
      authStore.getUser()
      .then(() => next())
      .catch(() => {
        authStore.logout(); // if cant get user, token must be bad, logout.
        router.push({ name: 'Login' });
      });
    }
    else {
      authStore.logout();
      router.push({ name: 'Login' });
    }
  }
  else {
    next(); // allow access
  }
});

export default router;