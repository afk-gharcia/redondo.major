// spotBoxPopup.js
// Simple popup for selecting a team for spot-label

export function showTeamSelectPopup(teams, onSelect, disabledIds = []) {
  // Remove any existing popup
  const old = document.getElementById('team-select-popup');
  if (old) old.remove();

  const popup = document.createElement('div');
  popup.id = 'team-select-popup';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = '#23272b';
  popup.style.border = '2px solid #fff';
  popup.style.borderRadius = '10px';
  popup.style.padding = '24px 20px 16px 20px';
  popup.style.zIndex = 9999;
  popup.style.boxShadow = '0 4px 32px #000a';
  popup.style.minWidth = '220px';

  const title = document.createElement('div');
  title.textContent = 'Escolha o time:';
  title.style.color = '#fff';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '1.1em';
  title.style.marginBottom = '16px';
  popup.appendChild(title);

  teams.forEach(team => {
    const btn = document.createElement('button');
    btn.textContent = team.name;
    btn.style.display = 'block';
    btn.style.width = '100%';
    btn.style.margin = '4px 0';
    btn.style.padding = '8px 0';
    btn.style.background = '#23272b';
    btn.style.color = '#fff';
    btn.style.border = '1.5px solid #fff';
    btn.style.borderRadius = '6px';
    btn.style.fontSize = '1em';
    btn.style.cursor = 'pointer';
    btn.onmouseover = () => btn.style.background = '#333';
    btn.onmouseout = () => btn.style.background = '#23272b';
    if (disabledIds.includes(team.id)) {
      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
    } else {
      btn.onclick = () => {
        popup.remove();
        onSelect(team);
      };
    }
    popup.appendChild(btn);
  });

  const cancel = document.createElement('button');
  cancel.textContent = 'Cancelar';
  cancel.style.marginTop = '18px';
  cancel.style.width = '100%';
  cancel.style.background = '#111';
  cancel.style.color = '#fff';
  cancel.style.border = '1.5px solid #fff';
  cancel.style.borderRadius = '6px';
  cancel.style.fontSize = '1em';
  cancel.style.cursor = 'pointer';
  cancel.onclick = () => popup.remove();
  popup.appendChild(cancel);

  document.body.appendChild(popup);
}
