import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';
import { useAuthStore } from '@/stores/modules/auth';

const authStore = useAuthStore();

export async function getAllPlayers() {
  const response = await axios.get(`${API_URL}/players`);
  if (response.status === 200) return response.data.response.players;
  else return null;
}

export async function createGame(gameData) {
  const config = { headers: authStore.bearerToken };
  const response = await axios.post(`${API_URL}/games`, gameData, config);
  if (response.status === 200) {
    return response.data.response.game.id;
  }
  else return null
}

export async function getPlayerSinglesTeamID(playerID) {
  const response = await axios.get(`${API_URL}/players/${playerID}/teams/singles`);
  if (response.status === 200) return response.data.response.team_id;
  else return null;
}

export async function getGame(gameID) {
  const response = await axios.get(`${API_URL}/games/${gameID}`);
  if (response.status === 200) return response.data.response.game;
  else return null;
}

export async function getGameMode(gameModeID) {
  const response = await axios.get(`${API_URL}/modes/${gameModeID}`);
  if (response.status === 200) return response.data.response;
  else return null;
}

export async function getGameModes() {
  const response = await axios.get(`${API_URL}/modes`);
  if (response.status === 200) return response.data.response;
  else return null;
}

export async function getTeamIDWithPlayers(playerIDs) {
  const data = { player_ids: playerIDs };
  const response = await axios.post(`${API_URL}/players/teams`, data);
  if (response.status === 200) { 
    const teams = response.data.response;
    if (teams.length === 0) {
      return -1;
    }
    else {
      return teams[0].id;
    }
  }
  else return null;
}

export async function createNewTeam(playerIDs) {
  const data = { player_ids: playerIDs };
  const config = { headers: authStore.bearerToken };
  const response = await axios.post(`${API_URL}/teams`, data, config);
  if (response.status === 200) return response.data.response.id;
  else return null;
}