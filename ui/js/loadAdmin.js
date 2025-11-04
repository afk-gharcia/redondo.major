/**
 * @file Loads administrative data for the frontend.
 * @author afk-gharcia
 * @description Fetches admin data from the backend using an authentication token.
 */

import { API_BASE_URL } from './config.js';

export async function loadAdmin(authentication_token) {
  if (!authentication_token) throw new Error('authentication_token é obrigatório');
  const url = `${API_BASE_URL}/api/admin?authentication_token=${encodeURIComponent(authentication_token)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao carregar dados administrativos');
  }
  const data = await res.json();
 
  return data;
}
