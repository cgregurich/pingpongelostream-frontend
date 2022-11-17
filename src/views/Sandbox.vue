<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from 'vue';



onBeforeMount(() => {
  console.log('on before mount');
  // console.log('onBeforeMount myComputed: ', myComputed.value);
});

onMounted(() => {
  console.log('onMounted start');
  // console.log('onMounted myComputed:', myComputed.value);
});

const myComputed = computed(() => {
  console.log('myComputed being computed');
  return 'hi there';
});

</script>

<template>
<button>Add to ref thign</button>
</template>

dom -> onMounted