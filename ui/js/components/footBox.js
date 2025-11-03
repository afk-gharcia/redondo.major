// Módulo para renderizar e controlar o foot-box
import { formatCustomDate, isPeriodOpen } from './utils.js';

/**
 * Garante que o HTML base do foot-box está presente.
 * @param {HTMLElement} footBox
 * @returns {Promise<void>}
 */
export async function ensureFootBoxHtml(footBox) {
  if (!footBox.querySelector('.foot-box-period') || !footBox.querySelector('#foot-box-save-btn')) {
    const html = await fetch('components/footBox.html').then(r => r.text());
    footBox.innerHTML = html;
  }
}

/**
 * Atualiza o foot-box com o texto do período e controla o botão Salvar.
 * @param {HTMLElement} footBox - Elemento do foot-box.
 * @param {string} start - Data/hora de início do período.
 * @param {string} end - Data/hora de fim do período.
 * @param {Function} onSave - Callback chamado ao clicar em Salvar.
 */
export async function updateFootBox(footBox, start, end, onSave) {
  await ensureFootBoxHtml(footBox);
  let periodText = '';
  let showSaveBtn = false;
  const periodStatus = isPeriodOpen(start, end);
  if (periodStatus === 'before') {
    periodText = `Os palpites abrem em ${formatCustomDate(new Date(start))}`;
  } else if (periodStatus === 'after') {
    periodText = 'Período de palpites encerrado';
  } else {
    periodText = `Envie seus palpites até ${formatCustomDate(new Date(end))}`;
    showSaveBtn = true;
  }
  const periodSpan = footBox.querySelector('.foot-box-period');
  if (periodSpan) periodSpan.textContent = periodText;
  const saveBtn = footBox.querySelector('#foot-box-save-btn');
  if (saveBtn) {
    saveBtn.style.display = showSaveBtn ? '' : 'none';
    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar';
    saveBtn.onclick = showSaveBtn && typeof onSave === 'function' ? onSave : null;
  }
}
