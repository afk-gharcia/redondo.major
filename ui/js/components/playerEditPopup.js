/**
 * @file Displays a popup for editing the player's display name in the frontend.
 * @author afk-gharcia
 * @description Provides a modal dialog for users to update their display name for the Redondo CS2 Major predictions page.
 */

import { editPlayer } from '../editPlayer.js';

export function showPlayerEditPopup({ currentName, playerId, onSuccess }) {
  
  const old = document.getElementById('player-edit-popup');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'player-edit-popup';
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
  title.textContent = 'Editar Nome';
  title.style.color = '#ffd700';
  title.style.marginBottom = '18px';
  title.style.fontSize = '1.18em';
  title.style.fontWeight = 'bold';
  popup.appendChild(title);

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName || '';
  input.maxLength = 32;
  input.style.fontSize = '1.08em';
  input.style.padding = '10px 16px';
  input.style.borderRadius = '8px';
  input.style.border = '1.5px solid #ffd700';
  input.style.background = '#181818';
  input.style.color = '#ffd700';
  input.style.marginBottom = '18px';
  input.style.width = '100%';
  input.style.boxSizing = 'border-box';
  input.autofocus = true;
  popup.appendChild(input);

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
    const newName = input.value.trim();
    if (!newName) {
      errorMsg.textContent = 'O nome não pode ser vazio.';
      errorMsg.style.display = 'block';
      return;
    }
    btnSave.disabled = true;
    btnSave.textContent = 'Salvando...';
    try {
      await editPlayer({ id: playerId, display_name: newName });
      if (typeof onSuccess === 'function') onSuccess(newName);
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
