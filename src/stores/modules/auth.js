import { defineStore } from 'pinia';
import axios from 'axios';
import { apiCall } from '../utils/apiCall';
import { API_URL, REGISTER, LOGIN, SELF, PROFILE, DELETE } from '../utils/backendRouteParts';

export const useAuthStore = defineStore('user', {
    state: () => ({
        user: null,
        token: window.localStorage.getItem('auth-token') || null,
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
            return await apiCall(
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
                    window.localStorage.setItem('auth-token', this.token);
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
            return await apiCall(
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
                    window.localStorage.setItem('auth-token', this.token);
                },
                undefined,
                async () => { await this.getUser() }
            );
        },
        async getUser() {
            console.log(this.bearerToken);
            return await apiCall(
                () => axios.get(
                    API_URL + SELF,
                    this.baseHeader
                ),
                (data) => {
                    this.user = data.user;
                    console.log('inside store', this.user);
                }
            );
        },
        async logout() {
            console.log('logging out');
            this.token = null;
            this.user = null;
            window.localStorage.clear();
        },
        async updateProfile(updatedUserInfo, callback, errorHandler) {
            console.log(updatedUserInfo);
            let data = new FormData();
            data.append('_method', 'PUT');
            data.append('name', updatedUserInfo.name);
            data.append('email', updatedUserInfo.email);
            data.append('photo', updatedUserInfo.photo, updatedUserInfo.photo.name);
            return await apiCall(
                () => axios.post( // php doesn't parse mutli-part/form-data on puts, so create a fake put
                    API_URL + PROFILE,
                    data,
                    {headers: { ...this.baseHeader.headers, 'Content-Type': 'multipart/form-data' }}
                ),
                (data) => {
                    console.log(data);
                    this.user = data.user;
                },
                undefined,
                typeof callback == 'function' ? callback : undefined,
                undefined,
                typeof errorHandler == 'function' ? errorHandler : (e) => { console.error(e); }
            );
        },
        async deleteUser(pass, callback, errorHandler, setState) {
            return await apiCall(
                () => axios.post(
                    API_URL + PROFILE + DELETE,
                    pass,
                    this.baseHeader
                ),
                () => {
                    this.logout();
                },
                undefined,
                typeof callback == 'function' ? callback : undefined,
                undefined,
                typeof errorHandler == 'function' ? errorHandler : (e) => { console.error(e); }
            );
        }
    }
});
