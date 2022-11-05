<script setup>
import { ref, reactive } from 'vue';
import SuggestionInput from '@/components/SuggestionInput.vue';
const input = ref(null);
function noop() {

}
const items = reactive([
  'Bill',
  'Bob',
  'Steve',
  'Colin'
]);
const enteredText = ref('');
</script>

<template>
<div class="container bg-red-200" @click="input.focus()" @mousedown.stop.prevent="">
  <input ref="input" type="text" class="border border-black">
</div>  
<SuggestionInput :items="items" v-model:enteredText="enteredText"/>
</template>