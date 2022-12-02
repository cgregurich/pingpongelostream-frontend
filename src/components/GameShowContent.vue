<template>
    <div class="flex p-10 text-2xl">
        {{firstTeamNames.toString()}} {{phrases[chosenPhrase]}} {{secondTeamNames.toString()}} {{winningScore}} to {{lossingScore}}
    </div>
    <div class="flex px-10 pb-10 text-2xl">
        {{firstTeamNames.toString()}}'s elo rating {{eloPhrase1[chosenEloPhrase1]}} {{game.team1_elo_change}} points to {{game.team1_elo_then}} while 
        {{secondTeamNames.toString()}}'s elo rating {{eloPhrase2[chosenEloPhrase2]}} {{game.team2_elo_change}} points to {{game.team2_elo_then}}
    </div>
</template>
  
<script>
  export default {
    name: 'GameShowContent',
    data() {
      return { 
        phrases: ['beat', 'was beaten by', 'were beaten by'],
        chosenPhrase: 0,
        eloPhrase1: ['improved', 'fell'],
        chosenEloPhrase1: 0,
        eloPhrase2: ['improved', 'fell'],
        chosenEloPhrase2: 0,
        firstTeamNames: [],
        secondTeamNames: [],
        winningScore: 0,
        lossingScore: 0,
     }
    },
    props: {
      game: {
        type: Object,
        required: true,
      },
      team1: {
        type: Object,
        required: true,
      },    
      team2: {
        type: Object,
        required: true
      },
      team1Score: {
        type: Number,
        required: true
      },
      team2Score: {
        type: Number,
        required: true
      }
    },
    mounted() {
        this.team1.members.forEach(element => this.firstTeamNames.push(element.name));
        this.firstTeamNames = this.firstTeamNames.join(" and ");
        this.team2.members.forEach(element => this.secondTeamNames.push(element.name));
        this.secondTeamNames = this.secondTeamNames.join(" and ");
        if(this.team1Score > this.team2Score) {
            this.chosenPhrase = 0;
            this.chosenEloPhrase1 = 0;
            this.chosenEloPhrase2 = 1;
            this.winningScore = this.team1Score;
            this.lossingScore = this.team2Score;
        }
        else {
            this.team1.members.length == 1 ? this.chosenPhrase = 1 : this.chosenPhrase = 2;
            this.chosenEloPhrase1 = 1;
            this.chosenEloPhrase2 = 0;
            this.lossingScore = this.team1Score;
            this.winningScore = this.team2Score;
        }

    }
  }
  </script>