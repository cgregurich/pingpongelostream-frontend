<script setup>
import TextInput from '@/components/TextInput.vue';
import { ref, reactive, computed } from 'vue';


const props = defineProps({
  items: Array,
  enteredText: String,
});

const emit = defineEmits(['update:enteredText'])

// const items = [
//   'Bob',
//   'Bill',
//   'Bonnie',
//   'Beluga',
//   'Conrad',
//   'Colin',
//   'indigo',
//   'illinois',
// ];

// const input = ref('');
const isFocused = ref(false);

const suggestions = computed(() => {
  if (props.enteredText=== '') return;
  return props.items.filter(item => fuzzyMatch(props.enteredText, item));
  // return items.filter(item => fuzzyMatch(input.value, item));
});

/*
FIXME: a work in progress. The problem with this is that the suggestions don't 
currently prefer items that have the given query closer to the start.
Eg. if items are: Bill, Bob, John, Illinois, and I search "ill", Illinois should
come up first, right? With this implementation, Bill comes up first, because it
has a match "_ill" and is before Illinois in the list.
I noticed even a simple approach (i.e. string.includes(query)) has the same problem.
*/
function fuzzyMatch(query, string) {
  query = query.toLowerCase();
  string = string.toLowerCase();
  let queryPointer = 0;
  for (let c of string) {
    if (queryPointer >= query.length) break;
    if (c === query[queryPointer]) queryPointer++;
  }
  if (queryPointer >= query.length) return true;
  return false;
}

const inputField = ref();

function suggestionClicked(suggestion) {
  console.log('emitting ', suggestion);
  emit('update:enteredText', suggestion);
  inputField.value.focus();
}
  
</script>

<template>
<div class="search-input relative">
  <!-- isFocused: {{ isFocused }} -->
  <input type="text" ref="inputField" @focus="isFocused = true" @blur="isFocused = false" v-model="enteredText" @input="$emit('update:enteredText', $event.target.value)">
  <div v-show="suggestions?.length > 0 && isFocused" class="suggestions absolute w-full bg-white border border-black">
    <div @click="suggestionClicked(suggestion)" class="suggestion hover:bg-blue-300 hover:text-white cursor-default" v-for="(suggestion, index) in suggestions" :key="index">{{ suggestion }}</div>
  </div>
</div>
</template>