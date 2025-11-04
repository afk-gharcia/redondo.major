/**
 * @file Saves user predictions for the frontend.
 * @author afk-gharcia
 * @description Collects and sends user predictions to the backend API.
 */

import { API_BASE_URL } from './config.js';


export async function savePredictions({ player_id, major_phase_id, phaseGames, phaseTeams, contentBox }) {
  const predictions = [];
  
  const isPlayoffStage = major_phase_id === 4 || (typeof phaseTeams !== 'undefined' && phaseTeams.phase_name === 'Playoff');
  if (Array.isArray(phaseGames)) {
    phaseGames.forEach((game, gidx) => {
      if (isPlayoffStage) {
        
        const scoreBtn = contentBox.querySelector(`.score-btn[data-game="${gidx}"]`);
        const score = scoreBtn ? scoreBtn.textContent.trim() : '';
        let value = null;
        if (score === '2-0' || score === '2-1') {
          value = [game.team_01_id, score];
        } else if (score === '0-2') {
          value = [game.team_02_id, '2-0'];
        } else if (score === '1-2') {
          value = [game.team_02_id, '2-1'];
        }
        if (value) {
          predictions.push({ key: game.key, value, type: 'playoff' });
        }
      } else {
        const btnSel = contentBox.querySelector(`.team-btn[data-game="${gidx}"].team-btn-selected`);
        if (btnSel) {
          let value = null;
          if (btnSel.getAttribute('data-team') === '1') value = game.team_01_id;
          if (btnSel.getAttribute('data-team') === '2') value = game.team_02_id;
          predictions.push({ key: game.key, value, type: 'game' });
        }
      }
    });
  }
  
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

  
  const champBox = contentBox.querySelector('.major-champion-box.major-champion-selected');
  if (champBox) {
    const champName = champBox.textContent.trim();
    const champTeam = (phaseTeams || []).find(t => t.team_name === champName);
    if (champTeam) {
      predictions.push({ key: 'champion', value: champTeam.team_id, type: 'champion' });
    }
  }
  
  const response = await fetch(`${API_BASE_URL}/api/predictions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player_id, major_phase_id, predictions })
  });
  return response.json();
}
