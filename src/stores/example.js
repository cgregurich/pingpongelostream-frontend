import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
export const exampleStore = defineStore('example', () => {

  // "state" is just refs
  const count = ref(0);
  const username = ref('bobert11');

  // "getters" are just computed()
  const doubleCount = computed(() => count.value * 2);

  // "actions" are just functions
  function increment() {
    count.value++;
  }
  return { count, username, doubleCount, increment };
});
