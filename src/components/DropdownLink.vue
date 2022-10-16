<script setup>
    defineProps({
        to: Object,
        as: String,
    });
</script>

<template>
    <div>
        <button
            v-if="as == 'button'"
            type="submit"
            class="block w-full px-4 py-2 text-sm leading-5 text-gray-700 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition"
        >
            <slot />
        </button>
        <router-link
            v-else
            :to="to"
            class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition"
        >
            <slot />
        </router-link>
    </div>
</template>