<script setup>

const props = defineProps({
    winningTeam: Object,
    losingTeam: Object
})

</script>

<template>
    <div class="flex-4 flex-col self-center px-3 hover:animate-ping">
        <div class="flex-row font-semibold" v-for="member in winningTeam.members" :key="member.id">
            {{ member.name }}
        </div>
    </div>
    <div class="flex-1 flex-col self-center text-center"><h1>bt</h1></div>
    <div class="flex-4 flex-col self-center px-3">
        <div class="flex-row" v-for="member in losingTeam.members" :key="member.id">
            {{ member.name }}
        </div>
    </div>
</template>