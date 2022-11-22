<script setup>
import router from '@/router/index';

const props = defineProps({
    winningTeam: Object,
    losingTeam: Object
})


</script>

<template>
	<router-link :to="{ name: 'GameDetail'}">
        <div class="flex flex-row">
            <div class="flex-1 flex-col self-center px-4 py-2">
                <div class="flex-row text-right" v-for="member in props.winningTeam.members" :key="member.id">
                    {{ member.name }}
                </div>
            </div>
            <div class="flex-2 flex-col self-center text-center">vs</div>
            <div class="flex-1 flex-col self-center px-4 py-2">
                <div class="flex-row" v-for="member in props.losingTeam.members" :key="member.id">
                    {{ member.name }}
                </div>
            </div>
        </div>
        <div class="flex flex-row self-center pb-2">
            <div class="flex-row px-3 font-semibold text-center text-3xl">{{ props.winningTeam.pivot.set_score }}</div>
            <div class="flex-row text-center text-3xl "> - </div>
            <div class="flex-row px-3 text-center text-3xl">{{ props.losingTeam.pivot.set_score }}</div>
        </div>
    </router-link>
</template>
