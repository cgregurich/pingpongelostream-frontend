import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';
import { useAuthStore } from '@/stores/modules/auth';

const authStore = useAuthStore();





export async function getAllPlayers() {
  try {
    const response = await axios.get(`${API_URL}/players`);
    return response.data.response.players;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function createGame(gameData) {
  try {
    const config = { headers: authStore.bearerToken };
    const response = await axios.post(`${API_URL}/games`, gameData, config);
    return response.data.response.game.id;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function getPlayerSinglesTeamID(playerID) {
  try {
    const response = await axios.get(`${API_URL}/players/${playerID}/teams/singles`);
    return response.data.response.team_id;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function getGame(gameID) {
  try {
    const response = await axios.get(`${API_URL}/games/${gameID}`);
    return response.data.response.game;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function getGameMode(gameModeID) {
  try {
    const response = await axios.get(`${API_URL}/modes/${gameModeID}`);
    return response.data.response;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function getGameModes() {
  try {
    const response = await axios.get(`${API_URL}/modes`);
    return response.data.response;
  }
  catch(err) {
    console.error(err);
    return null
  }
}

export async function getTeamIDWithPlayers(playerIDs) {
  try {
    const data = { player_ids: playerIDs };
    const response = await axios.post(`${API_URL}/players/teams`, data);
    const teams = response.data.response;
    if (teams.length === 0) return -1;
    else return teams[0].id;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function createNewTeam(playerIDs) {
  try {
    const data = { player_ids: playerIDs };
    const config = { headers: authStore.bearerToken };
    const response = await axios.post(`${API_URL}/teams`, data, config);
    return response.data.response.id;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function startGame(gameID) {
  try {
    const config = { headers: authStore.bearerToken };
    const response = await axios.get(`${API_URL}/games/${gameID}/play`, config);
    return response.data.response.game;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function updateOngoingGame(gameID, setNum, points) {
  try {
    const data = { points: points };
    const config = { headers: authStore.bearerToken };
    const response = await axios.post(`${API_URL}/games/${gameID}/playing/sets/${setNum}`, data, config);
    return response.data.response;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function completeGame(gameID) {
  try {
    const config = { headers: authStore.bearerToken };
    const response = await axios.post(`${API_URL}/games/${gameID}/complete`, null, config);
    return response.data.response;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function getCurrentSeason() {
  try {
    const response = await axios.get(`${API_URL}/seasons/current`);
    return response.data.response.season_number;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

export async function getSinglesLeaderboard() {
  try {
    const response = await axios.get(`${API_URL}/leaderboards/singles`);
    return response.data.response.teams;
  }
  catch (err) {
    console.error(err);
    return null;
  }
}

export async function getDoublesLeaderboard() {
  try {
    const response = await axios.get(`${API_URL}/leaderboards/doubles`);
    return response.data.response.teams;

  }
  catch (err) {
    console.error(err);
    return null;
  }
}