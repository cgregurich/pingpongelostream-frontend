import { defineStore } from 'pinia';
import axios from 'axios';
import { apiCall } from '../utils/apiCall';
import { API_URL, GAMES } from '../utils/backendRouteParts';

export const useGameStore = defineStore('game', {
    state: () => ({
        gameData: null,
        // token: null
        currentSeason,
        pageNum,
        gameOption,
    }),
    getters: {
        baseHeader(state) {
            return { headers: state.bearerToken };
        }
    },
    actions: {
        async getGames() {
            await apiCall(
                () => axios.get(
                    API_URL + GAMES + "/season/" + currentSeason + "?page=" + pageNum + "&size=5&type=" + gameOption,
                    this.baseHeader
                ),
                (data) => {
                    this.gameData = data.gameData;
                    console.log('inside store', this.gameData);
                }
            )
        }
    }
});
