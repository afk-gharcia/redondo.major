// Função para carregar dados administrativos do endpoint /api/admin
// Requer authentication_token

import { API_BASE_URL } from './config.js';

/**
 * Carrega os dados administrativos do backend.
 * @param {string} authentication_token - Token de autenticação de admin
 * @returns {Promise<Object>} - Dados retornados do endpoint admin
 */
export async function loadAdmin(authentication_token) {
  if (!authentication_token) throw new Error('authentication_token é obrigatório');
  const url = `${API_BASE_URL}/api/admin?authentication_token=${encodeURIComponent(authentication_token)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao carregar dados administrativos');
  }
  const data = await res.json();
  // ...
  return data;
}
