import { defineStore } from 'pinia';
import axios from 'axios';
import { apiCall } from '../utils/apiCall';
import { API_URL, REGISTER, LOGIN, SELF } from '../utils/backendRouteParts';

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
        async register(name, email, password, password_confirmation) {
            await apiCall(
                () => axios.post(
                    API_URL + REGISTER,
                    {
                        'name': name,
                        'email': email,
                        'password': password,
                        'password_confirmation': password_confirmation,
                        'device_name': window.navigator.userAgent
                    }
                ),
                (data) => {
                    this.token = data.token;
                    console.log('inside store', data);
                },
                undefined,
                async () => { await this.getUser(); },
                undefined,
                (err) => {
                    console.log(err);
                }
            );
        },
        async login(email, password) {
            await apiCall(
                () => axios.post(
                    API_URL + LOGIN,
                    {
                        'email': email,
                        'password': password,
                        'device_name': window.navigator.userAgent
                    }
                ),
                (data) => {
                    this.token = data.token;
                    console.log('inside store', data);
                },
                undefined,
                async () => { await this.getUser() }
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
