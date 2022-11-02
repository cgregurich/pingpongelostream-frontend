<script setup>
import Navbar from '@/components/Navbar.vue';
import { useAuthStore } from './stores/modules/auth';

const authStore = useAuthStore();
</script>

<template>
  <Navbar :user="authStore.user">
    <router-view></router-view>
  </Navbar>
</template>

<style scoped>
</style>
