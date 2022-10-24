<script setup>
import Navbar from '@/components/Navbar.vue';
import { useAuthStore } from './stores/modules/auth';

const authStore = useAuthStore();
</script>

<template>
  <Navbar :user="authStore.user">
    <router-view class="m-auto w-screen h-[calc(100vh-4rem-1px)]"></router-view>
  </Navbar>
</template>

<style scoped>
</style>
