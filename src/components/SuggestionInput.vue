<script setup>
import TextInput from '@/components/TextInput.vue';
import { ref, reactive, computed } from 'vue';


const props = defineProps({
  items: Array,
  enteredText: String,
});

const emit = defineEmits(['update:enteredText'])


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
  emit('update:enteredText', suggestion);
  inputField.value.focus();
}

const showSuggestions = computed(() => {
  if (!suggestions.value) return false;
  // don't show suggestions if the component isn't focused, or if there are no suggestions
  if (!isFocused.value || suggestions.value?.length === 0) return false;
  // also don't show if there's only a single suggestion and it matches what is entered
  if (suggestions.value?.length === 1 && suggestions.value[0].toLowerCase() === props.enteredText.toLowerCase()) return false;
  return true;  
});
  
</script>

<template>
<div class="search-input relative" @click="inputField.focus()" @mousedown.stop.prevent>
  <input class="border border-black px-1" type="text" ref="inputField" @focus="isFocused = true" @blur="isFocused = false" v-model="enteredText" @input="$emit('update:enteredText', $event.target.value)">
  <div v-show="showSuggestions" class="suggestions absolute w-full bg-white border border-black">
    <div @click="suggestionClicked(suggestion)" class="suggestion cursor-default hover:text-white hover:bg-blue-500" v-for="(suggestion, index) in suggestions" :key="index">{{ suggestion }}</div>
  </div>
</div>
</template>