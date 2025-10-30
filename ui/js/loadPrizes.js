/**
 * @file Loads and fills the prize distribution for the leaderboard page.
 * @author afk-gharcia
 * @description Fetches prize data from the backend and updates the leaderboard UI accordingly.
 */

import { API_BASE_URL } from './config.js';

export async function loadPrizes() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/calculatePrizes`);
    if (!res.ok) throw new Error('Erro ao buscar prêmios');
    const prizes = await res.json();
    document.getElementById('prize-first').textContent = prizes.first_place;
    document.getElementById('prize-second').textContent = prizes.second_place;
    document.getElementById('prize-third').textContent = prizes.third_place;
  } catch (err) {
    document.getElementById('prize-first').textContent = '-';
    document.getElementById('prize-second').textContent = '-';
    document.getElementById('prize-third').textContent = '-';
    console.error('Erro ao buscar prêmios:', err);
  }
}
