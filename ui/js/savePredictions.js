import { API_BASE_URL } from './config.js';

/**
 * Salva os palpites do player para uma fase do major.
 * @param {Object} params
 * @param {string} params.player_id
 * @param {number} params.major_phase_id
 * @param {Array} params.phaseGames - array de jogos da fase
 * @param {Array} params.phaseTeams - array de times da fase
 * @param {HTMLElement} contentBox - elemento do form/tab
 * @returns {Promise<Object>} resposta da API
 */
export async function savePredictions({ player_id, major_phase_id, phaseGames, phaseTeams, contentBox }) {
  const predictions = [];
  // Games (type: 'game')
  if (Array.isArray(phaseGames)) {
    phaseGames.forEach((game, gidx) => {
      const btnSel = contentBox.querySelector(`.team-btn[data-game="${gidx}"].team-btn-selected`);
      if (btnSel) {
        let value = null;
        if (btnSel.getAttribute('data-team') === '1') value = game.team_01_id;
        if (btnSel.getAttribute('data-team') === '2') value = game.team_02_id;
        predictions.push({ key: game.key, value, type: 'game' });
      }
    });
  }
  // Classification picks (type: 3-0, 0-3, classified)
  const picks = contentBox.querySelectorAll('.classification-pick.classification-pick-selected');
  const classifiedTeams = new Set();
  picks.forEach((pickEl) => {
    const type = pickEl.getAttribute('data-type');
    const teamName = pickEl.textContent.trim();
    if (teamName) {
      const team = (phaseTeams || []).find(t => t.team_name === teamName);
      if (team) {
        if (type === '3-0') {
          predictions.push({ key: null, value: team.team_id, type: '3-0' });
          predictions.push({ key: null, value: team.team_id, type: 'classified' });
          classifiedTeams.add(team.team_id);
        } else if (type === 'classified') {
          if (!classifiedTeams.has(team.team_id)) {
            predictions.push({ key: null, value: team.team_id, type: 'classified' });
            classifiedTeams.add(team.team_id);
          }
        } else if (type === '0-3') {
          predictions.push({ key: null, value: team.team_id, type: '0-3' });
        }
      }
    }
  });
  // Envia para o endpoint
  const response = await fetch(`${API_BASE_URL}/api/predictions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player_id, major_phase_id, predictions })
  });
  return response.json();
}
