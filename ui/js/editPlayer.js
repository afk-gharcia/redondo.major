/**
 * @file Edits player data via the backend API for the frontend.
 * @author afk-gharcia
 * @description Sends PUT requests to update player name, slug, or admin status for the Redondo CS2 Major.
 */

import { API_BASE_URL } from '../js/config.js';

export async function editPlayer(params) {
  if (!params.id) throw new Error('id é obrigatório');
  const res = await fetch(`${API_BASE_URL}/api/players`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao editar player');
  return data;
}
