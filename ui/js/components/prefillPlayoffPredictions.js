
/**
 * @file Prefill playoff predictions for frontend.
 * @author afk-gharcia
 * @description Prefills saved playoff predictions in the UI components.
 */

export function prefillPlayoffPredictions(phase, container, predictions) {
  if (!Array.isArray(predictions)) return;
  
  predictions.filter(p => p.type === 'playoff').forEach(pred => {
    const gameIdx = phase.games.findIndex(g => g.key === pred.key);
    if (gameIdx !== -1 && Array.isArray(pred.value) && pred.value.length === 2) {
      const [teamId, score] = pred.value;
      
      let finalScore = score;
      if (phase.games[gameIdx].team_02_id === teamId) {
        if (score === '2-0') finalScore = '0-2';
        else if (score === '2-1') finalScore = '1-2';
      }
      
      let scoreBtn = container.querySelector(`.score-btn[data-game="${gameIdx}"]`);
      if (scoreBtn) {
        scoreBtn.textContent = finalScore;
        scoreBtn.classList.add('score-btn-selected');
      }
      
      let btnHome = container.querySelector(`.team-btn-playoff[data-game="${gameIdx}"][data-team="1"]`);
      let btnAway = container.querySelector(`.team-btn-playoff[data-game="${gameIdx}"][data-team="2"]`);
      if (btnHome && phase.games[gameIdx].team_01_id === teamId) {
        btnHome.classList.add('team-btn-selected');
      }
      if (btnAway && phase.games[gameIdx].team_02_id === teamId) {
        btnAway.classList.add('team-btn-selected');
      }
    }
  });
  
  const predChampion = predictions.find(p => p.type === 'champion');
  if (predChampion && predChampion.value) {
    const team = (phase.teams || []).find(t => t.team_id === predChampion.value);
    if (team) {
      const champBox = container.querySelector('.major-champion-box');
      if (champBox) {
        champBox.textContent = team.team_name;
        champBox.classList.add('major-champion-selected');
      }
    }
  }
}
