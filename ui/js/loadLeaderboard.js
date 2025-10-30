/**
 * @file Loads the leaderboard data and player scores for the frontend.
 * @author afk-gharcia
 * @description Fetches all leaderboard entries and detailed breakdowns from the backend API.
 */

import { API_BASE_URL } from './config.js';

export async function loadLeaderboard() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/leaderboard`);
    if (!res.ok) throw new Error('Erro ao buscar leaderboard');
    const data = await res.json();
    if (!data.success || !Array.isArray(data.leaderboard)) throw new Error('Formato inesperado de resposta do leaderboard');
    return data.leaderboard;
  } catch (err) {
    console.error('Erro ao carregar leaderboard:', err);
    return [];
  }
}
