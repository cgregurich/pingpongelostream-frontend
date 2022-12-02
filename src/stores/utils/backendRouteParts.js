const API_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const SELF = '/self';
const LOGIN = '/login';
const REGISTER = '/register';
const GAMES = '/games';
const PLAYERS = '/players';
const PROFILE = '/profile';
const DELETE = '/delete';
const PASSWORD = '/password';
const ALLTOKENS = '/get-all-tokens';
const DELETEALLTOKENS = '/full-sign-out';

console.log(API_URL, import.meta.env.VITE_BACKEND_BASE_URL);
export {
    API_URL,
    SELF,
    LOGIN,
    REGISTER,
    GAMES,
    PLAYERS,
    PROFILE,
    DELETE,
    PASSWORD,
    ALLTOKENS,
    DELETEALLTOKENS
};
