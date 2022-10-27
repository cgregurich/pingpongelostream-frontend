const API_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const SELF = '/self';
const LOGIN = '/login';
const REGISTER = '/register';
const GAMES = '/games';

console.log(API_URL, import.meta.env.VITE_BACKEND_BASE_URL);
export {
    API_URL,
    SELF,
    LOGIN,
    REGISTER,
    GAMES
};
