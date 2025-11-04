/**
   * @file Admin password popup for frontend.
   * @author afk-gharcia
   * @description Renders and handles the admin password authentication popup.
   */

export function showAdminPassPopup({ onSubmit }) {
  const old = document.getElementById('admin-pass-popup');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'admin-pass-popup';
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
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.25s';

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
  popup.style.transform = 'scale(0.92)';
  popup.style.transition = 'transform 0.22s cubic-bezier(.4,1.6,.6,1)';

  const input = document.createElement('input');
  input.type = 'password';
  input.placeholder = 'Digite o ADMIN PASS';
  input.maxLength = 64;
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

  const btnSubmit = document.createElement('button');
  btnSubmit.textContent = 'Entrar';
  btnSubmit.style.background = '#ffd700';
  btnSubmit.style.color = '#23272b';
  btnSubmit.style.border = 'none';
  btnSubmit.style.borderRadius = '8px';
  btnSubmit.style.padding = '8px 18px';
  btnSubmit.style.fontWeight = 'bold';
  btnSubmit.onclick = () => {
    const pass = input.value.trim();
    if (!pass) {
      errorMsg.textContent = 'Digite o ADMIN PASS.';
      errorMsg.style.display = 'block';
      return;
    }
    if (typeof onSubmit === 'function') onSubmit(pass, { error: (msg) => {
      errorMsg.textContent = msg;
      errorMsg.style.display = 'block';
    }, close: () => overlay.remove() });
  };

  btnRow.appendChild(btnCancel);
  btnRow.appendChild(btnSubmit);
  popup.appendChild(btnRow);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  
  setTimeout(() => {
    overlay.style.opacity = '1';
    popup.style.transform = 'scale(1)';
  }, 10);

  input.focus();
  input.onkeydown = (e) => {
    if (e.key === 'Enter') btnSubmit.click();
  };
  overlay.tabIndex = -1;
  overlay.focus();
  overlay.onkeydown = (e) => {
    if (e.key === 'Escape') overlay.remove();
  };
}
