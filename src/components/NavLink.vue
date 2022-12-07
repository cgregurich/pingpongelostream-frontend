<script setup>
    const props = defineProps({
        to: Object
    });
</script>

<template>
    <router-link
        :to="to"
        class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition"
        active-class="inline-flex items-center px-1 pt-1 border-b-2 border-site-color-two text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-site-color-two transition"    
    >
        <slot />
    </router-link>
</template>
