// Popup de confirmação para deletar relação stage-team
// Uso: showConfirmDeleteStageTeam({ phase, team, onConfirm })

export function showConfirmDeleteStageTeam({ phase, team, onConfirm }) {
  const old = document.getElementById('stage-team-delete-popup');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'stage-team-delete-popup';
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
  title.textContent = 'Confirmar exclusão';
  title.style.color = '#ffd700';
  title.style.marginBottom = '18px';
  title.style.fontSize = '1.18em';
  title.style.fontWeight = 'bold';
  popup.appendChild(title);

  const msg = document.createElement('div');
  msg.innerHTML = `Deseja realmente deletar a relação <b>${phase}</b> / <b>${team}</b>?`;
  msg.style.color = '#ffd700';
  msg.style.marginBottom = '18px';
  msg.style.textAlign = 'center';
  popup.appendChild(msg);

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

  const btnDelete = document.createElement('button');
  btnDelete.textContent = 'Deletar';
  btnDelete.style.background = '#d32f2f';
  btnDelete.style.color = '#fff';
  btnDelete.style.border = 'none';
  btnDelete.style.borderRadius = '8px';
  btnDelete.style.padding = '8px 18px';
  btnDelete.style.fontWeight = 'bold';
  btnDelete.onclick = async () => {
    btnDelete.disabled = true;
    btnDelete.textContent = 'Deletando...';
    try {
      if (typeof onConfirm === 'function') await onConfirm();
      overlay.remove();
    } catch (err) {
      errorMsg.textContent = err.message || 'Erro ao deletar.';
      errorMsg.style.display = 'block';
    } finally {
      btnDelete.disabled = false;
      btnDelete.textContent = 'Deletar';
    }
  };

  btnRow.appendChild(btnCancel);
  btnRow.appendChild(btnDelete);
  popup.appendChild(btnRow);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  overlay.tabIndex = -1;
  overlay.focus();
  overlay.onkeydown = (e) => {
    if (e.key === 'Escape') overlay.remove();
  };
}
