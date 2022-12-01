<script setup>

const props = defineProps({
  page: Number,
  numberOfPages: Number,
  gameMode: String,
});




</script>


<template>
<tr>
  <td class="bg-site-color-two text-white rounded-b-lg py-2" colspan="7">
    <div class="paginater flex justify-end text-xs">
      <!-- <select class="text-black rounded-lg border-none" v-model="gameMode" @change="$emit('update:gameMode', gameMode)"> -->
      <select class="text-black rounded-lg border-none" v-model="gameMode" @change="$emit('game-mode-changed', gameMode)">
        <option value="singles">Singles</option>
        <option value="doubles">Doubles</option>
      </select>
      <button class="mx-4" @click="$emit('paginate-previous')">Prev</button>
      <div @click="$emit('jump-to-page', i)" class="px-2 border-2 rounded-md cursor-pointer" :class="i === page ? ['border-white'] : 'border-site-color-two'" v-for="i in numberOfPages" :key="i">{{ i }}</div>
      <button class="mx-4" @click="$emit('paginate-next')">Next</button>
    </div>
  </td>
</tr>
</template>