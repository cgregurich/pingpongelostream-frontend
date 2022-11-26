<script setup>

const props = defineProps({
    winningTeam: Object,
    losingTeam: Object
})

</script>

<template>
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
        <div class="flex pb-2 justify-center text-3xl">
            <div class="px-3 font-semibold">{{ props.winningTeam.pivot.set_score }}</div>
            <div class=""> - </div>
            <div class="px-3">{{ props.losingTeam.pivot.set_score }}</div>
        </div>
</template>
