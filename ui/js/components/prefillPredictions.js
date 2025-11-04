/**
 * @file Prefill predictions for frontend.
 * @author afk-gharcia
 * @description Prefills saved predictions in the UI components for regular stages.
 */
export function prefillPredictions(phase, container, predictions) {
  if (!Array.isArray(predictions)) return;
  
  predictions.filter(p => p.type === 'game').forEach(pred => {
    const gameIdx = phase.games.findIndex(g => g.key === pred.key);
    if (gameIdx !== -1) {
      let btn = null;
      const game = phase.games[gameIdx];
      if (game.team_01_id === pred.value) {
        btn = container.querySelector(`.team-btn[data-game="${gameIdx}"][data-team="1"]`);
      } else if (game.team_02_id === pred.value) {
        btn = container.querySelector(`.team-btn[data-game="${gameIdx}"][data-team="2"]`);
      }
      if (btn) btn.classList.add('team-btn-selected');
    }
  });
  
  const pred3_0 = predictions.find(p => p.type === '3-0');
  let ids3_0 = [];
  if (pred3_0 && Array.isArray(pred3_0.value)) {
    pred3_0.value.forEach(teamId => {
      const team = (phase.teams || []).find(t => t.team_id === teamId);
      if (team) {
        const picks = container.querySelectorAll('.classification-pick[data-type="3-0"]');
        for (let i = 0; i < picks.length; i++) {
          if (!picks[i].textContent.trim()) {
            picks[i].textContent = team.team_name;
            picks[i].classList.add('classification-pick-selected');
            break;
          }
        }
        ids3_0.push(teamId);
      }
    });
  }
  
  const pred0_3 = predictions.find(p => p.type === '0-3');
  if (pred0_3 && Array.isArray(pred0_3.value)) {
    pred0_3.value.forEach(teamId => {
      const team = (phase.teams || []).find(t => t.team_id === teamId);
      if (team) {
        const picks = container.querySelectorAll('.classification-pick[data-type="0-3"]');
        for (let i = 0; i < picks.length; i++) {
          if (!picks[i].textContent.trim()) {
            picks[i].textContent = team.team_name;
            picks[i].classList.add('classification-pick-selected');
            break;
          }
        }
      }
    });
  }
  
  const predClassified = predictions.find(p => p.type === 'classified');
  if (predClassified && Array.isArray(predClassified.value)) {
    const classifiedFiltered = predClassified.value.filter(teamId => !ids3_0.includes(teamId));
    classifiedFiltered.forEach(teamId => {
      const team = (phase.teams || []).find(t => t.team_id === teamId);
      if (team) {
        const picks = container.querySelectorAll('.classification-pick[data-type="classified"]');
        for (let i = 0; i < picks.length; i++) {
          if (!picks[i].textContent.trim()) {
            picks[i].textContent = team.team_name;
            picks[i].classList.add('classification-pick-selected');
            break;
          }
        }
      }
    });
  }
}
