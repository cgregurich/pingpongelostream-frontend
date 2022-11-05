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
  const config = {
    headers: authStore.bearerToken
  };
  const response = await axios.post(`${API_URL}/games`, gameData, config);
  return response.status === 200;
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