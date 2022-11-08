<script setup>

const props = defineProps({
    sets: Array
})

function figureScores(sets) {
    let team1Wins = 0;
    let team2Wins = 0;
    for(let i = 0; i < sets.length; i++) {
        sets[i].team1_score > sets[i].team2_score ? team1Wins++ : team2Wins++
    }
    if(team1Wins > team2Wins) {
        Wins = team1Wins;
        Losses = team2Wins;
    }
    else {
        Wins = team2Wins;
        Losses = team1Wins;
    }
}
let Wins = 0;
let Losses = 0;
figureScores(props.sets);
</script>

<template>
        <div class="flex ml-10 self-center font-sans text-xl " >{{Wins}}-{{Losses}}</div>
</template>