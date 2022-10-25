import { defineStore } from 'pinia';
import axios from 'axios';
import { apiCall } from '../utils/apiCall';
import { API_URL, GAME } from '../utils/backendRouteParts';
import { data } from 'autoprefixer';

export const useGameStore = defineStore('game', {
    state: () => ({
        game: null,
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
                    API_URL + GAME
                ),
                (data) => {
                    this.getGames = data.game;
                    console.log('inside store', this.game);
                }
            )
        }
    }
});
