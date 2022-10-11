import { defineStore } from 'pinia';
import axios from 'axios';
import { apiCall } from '../utils/apiCall';
import { API_URL, LOGIN, SELF } from '../utils/backendRouteParts';

export const useAuthStore = defineStore('user', {
    state: () => ({
        user: null,
        token: null
    }),
    getters: {
        bearerToken(state) {
            return { 'Authorization': 'Bearer ' + state.token };
        },
        baseHeader(state) {
            return { headers: state.bearerToken };
        }
    },
    actions: {
        async login(username, password) {
            await apiCall(
                () => axios.post(
                    API_URL + LOGIN,
                    {
                        'email': username,
                        'password': password,
                        'device_name': window.navigator.userAgent
                    }
                ),
                (data) => {
                    this.token = data.token;
                    console.log('inside store', data);
                },
                undefined,
                () => { this.getUser() }
            );
        },
        async getUser() {
            console.log(this.bearerToken);
            await apiCall(
                () => axios.get(
                    API_URL + SELF,
                    this.baseHeader
                ),
                (data) => {
                    this.user = data.user;
                    console.log('inside store', this.user);
                }
            );
        }
    }
});
