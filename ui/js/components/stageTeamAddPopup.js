// Popup para adicionar nova relação de stage e team
// Uso: showStageTeamAddPopup({ phases, teams, onSuccess })

export function showStageTeamAddPopup({ phases, teams, onSuccess }) {
  const old = document.getElementById('stage-team-add-popup');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'stage-team-add-popup';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.35)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 9999;

  const popup = document.createElement('div');
  popup.style.background = '#23272b';
  popup.style.borderRadius = '18px';
  popup.style.boxShadow = '0 4px 32px #000a';
  popup.style.padding = '32px 28px 24px 28px';
  popup.style.minWidth = '320px';
  popup.style.maxWidth = '90vw';
  popup.style.display = 'flex';
  popup.style.flexDirection = 'column';
  popup.style.alignItems = 'center';

  const title = document.createElement('h2');
  title.textContent = 'Adicionar Stage/Team';
  title.style.color = '#ffd700';
  title.style.marginBottom = '18px';
  title.style.fontSize = '1.18em';
  title.style.fontWeight = 'bold';
  popup.appendChild(title);

  // Select de Stage
  const phaseLabel = document.createElement('label');
  phaseLabel.textContent = 'Stage:';
  phaseLabel.style.color = '#ffd700';
  phaseLabel.style.marginBottom = '4px';
  phaseLabel.style.alignSelf = 'flex-start';
  popup.appendChild(phaseLabel);
  const phaseSelect = document.createElement('select');
  phaseSelect.style.fontSize = '1.08em';
  phaseSelect.style.padding = '8px 12px';
  phaseSelect.style.borderRadius = '8px';
  phaseSelect.style.border = '1.5px solid #ffd700';
  phaseSelect.style.background = '#181818';
  phaseSelect.style.color = '#ffd700';
  phaseSelect.style.marginBottom = '18px';
  phaseSelect.style.width = '100%';
  phases.forEach(phase => {
    const opt = document.createElement('option');
    opt.value = phase.id;
    opt.textContent = phase.phase;
    phaseSelect.appendChild(opt);
  });
  popup.appendChild(phaseSelect);

  // Select de Team
  const teamLabel = document.createElement('label');
  teamLabel.textContent = 'Team:';
  teamLabel.style.color = '#ffd700';
  teamLabel.style.marginBottom = '4px';
  teamLabel.style.alignSelf = 'flex-start';
  popup.appendChild(teamLabel);
  const teamSelect = document.createElement('select');
  teamSelect.style.fontSize = '1.08em';
  teamSelect.style.padding = '8px 12px';
  teamSelect.style.borderRadius = '8px';
  teamSelect.style.border = '1.5px solid #ffd700';
  teamSelect.style.background = '#181818';
  teamSelect.style.color = '#ffd700';
  teamSelect.style.marginBottom = '18px';
  teamSelect.style.width = '100%';
  teams.forEach(team => {
    const opt = document.createElement('option');
    opt.value = team.id;
    opt.textContent = team.name;
    teamSelect.appendChild(opt);
  });
  popup.appendChild(teamSelect);

  const errorMsg = document.createElement('div');
  errorMsg.style.color = '#d32f2f';
  errorMsg.style.fontWeight = 'bold';
  errorMsg.style.marginBottom = '10px';
  errorMsg.style.display = 'none';
  popup.appendChild(errorMsg);

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.gap = '12px';
  btnRow.style.justifyContent = 'center';

  const btnCancel = document.createElement('button');
  btnCancel.textContent = 'Cancelar';
  btnCancel.style.background = '#333';
  btnCancel.style.color = '#fff';
  btnCancel.style.border = 'none';
  btnCancel.style.borderRadius = '8px';
  btnCancel.style.padding = '8px 18px';
  btnCancel.style.fontWeight = 'bold';
  btnCancel.onclick = () => overlay.remove();

  const btnSave = document.createElement('button');
  btnSave.textContent = 'Salvar';
  btnSave.style.background = '#ffd700';
  btnSave.style.color = '#23272b';
  btnSave.style.border = 'none';
  btnSave.style.borderRadius = '8px';
  btnSave.style.padding = '8px 18px';
  btnSave.style.fontWeight = 'bold';
  btnSave.onclick = async () => {
    const phaseId = phaseSelect.value;
    const teamId = teamSelect.value;
    if (!phaseId || !teamId) {
      errorMsg.textContent = 'Selecione um stage e um time.';
      errorMsg.style.display = 'block';
      return;
    }
    btnSave.disabled = true;
    btnSave.textContent = 'Salvando...';
    try {
      if (typeof onSuccess === 'function') await onSuccess({ phaseId, teamId });
      overlay.remove();
    } catch (err) {
      errorMsg.textContent = err.message || 'Erro ao salvar.';
      errorMsg.style.display = 'block';
    } finally {
      btnSave.disabled = false;
      btnSave.textContent = 'Salvar';
    }
  };

  btnRow.appendChild(btnCancel);
  btnRow.appendChild(btnSave);
  popup.appendChild(btnRow);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  overlay.tabIndex = -1;
  overlay.focus();
  overlay.onkeydown = (e) => {
    if (e.key === 'Escape') overlay.remove();
  };
}
