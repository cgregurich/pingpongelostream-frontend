<script>
export default {
	data() {
		return {

			game1: [{ winner: "Jane", loser: "Jim", score: "11 - 4", date: "10 / 4 / 22" }],
			game2: [{ winner: "Jack", loser: "Josephine", score: "11 - 9", date: "10 / 1 / 22" }],
			game3: [{ winner: "Job", loser: "Jerry", score: "13 - 11", date: "10 / 14 / 22" }],
			game4: [{ winner: "Jeckyl", loser: "Jaquelynn", score: "11 - 7", date: "10 / 7 / 22" }],
			game5: [{ winner: "John", loser: "Johnny", score: "12 - 10", date: "10 / 16 / 22" }],

		}
	}
}


</script>


<template>
  <body>
    <div class="body flex justify-center w-full">
      <div
        class="
          game-list-container
          flex flex-col
          items-center
          sm:w-[30rem]
          w-full
          bg-gray-100
          rounded-3xl
          m-4
          pb-5
          border border-gray-300
          shadow-lg
        "
      >
        <p class="header text-4xl font-semibold m-4">Recent Games</p>
        <div v-for="item in game1">
          {{ item.winner }} {{item.score}} {{ item.loser }}  -  {{item.date}}
        </div>
		<div v-for="item in game2">
          {{ item.winner }} {{item.score}} {{ item.loser }}  -  {{item.date}}
        </div>
		<div v-for="item in game3">
          {{ item.winner }} {{item.score}} {{ item.loser }}  -  {{item.date}}
        </div>
		<div v-for="item in game4">
          {{ item.winner }} {{item.score}} {{ item.loser }}  -  {{item.date}}
        </div>
		<div v-for="item in game5">
          {{ item.winner }} {{item.score}} {{ item.loser }}  -  {{item.date}}
        </div>
        <div
          class="line w-4/5 lg:mt-40 mt-1 bg-opacity-10 bg-black h-[1px] mb-4"
        ></div>
        <div class="footer">Put pagination here</div>
      </div>
    </div>
  </body>
</template>
