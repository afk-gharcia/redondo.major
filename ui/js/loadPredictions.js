/**
 * @file Loads predictions data for the predictions page.
 * @author afk-gharcia
 * @description Fetches all phases, games, teams, and user predictions from the backend API.
 */

import { API_BASE_URL } from './config.js';

export async function loadPredictions(playerId) {
	if (!playerId) throw new Error('playerId is required');
	try {
		const res = await fetch(`${API_BASE_URL}/api/predictions?player_id=${encodeURIComponent(playerId)}`);
		if (!res.ok) throw new Error('Failed to fetch predictions');
		const data = await res.json();
		if (!data.success || !Array.isArray(data.phases)) throw new Error('Unexpected predictions response format');
		return data;
	} catch (err) {
		console.error('Error loading predictions:', err);
		return { success: false, phases: [] };
	}
}
