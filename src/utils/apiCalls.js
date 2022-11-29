import axios from 'axios';
import { API_URL } from '@/stores/utils/backendRouteParts.js';
import { useAuthStore } from '@/stores/modules/auth';

const authStore = useAuthStore();

export async function getSinglesLeaderboard() {
  try {
    const response = await axios.get(`${API_URL}/leaderboards/singles`);
    return response.data.response.teams;
  }
  catch (err) {
    return null;
  }
}

export async function getDoublesLeaderboard() {
  try {
    const response = await axios.get(`${API_URL}/leaderboards/doubles`);
    return response.data.response.teams;

  }
  catch (err) {
    return null;
  }
}