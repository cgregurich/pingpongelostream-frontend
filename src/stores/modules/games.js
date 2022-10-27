import { defineStore } from 'pinia';
import axios from 'axios';
import { apiCall } from '../utils/apiCall';
import { API_URL, GAMES } from '../utils/backendRouteParts';
import { data } from 'autoprefixer';

export const useGameStore = defineStore('game', {
    state: () => ({
        gameData: null,
        token: null
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
                    API_URL + GAMES,
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
