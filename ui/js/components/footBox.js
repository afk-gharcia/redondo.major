
/**
 * @file Foot box component logic for frontend.
 * @author afk-gharcia
 * @description Handles rendering and updating the prediction period and save button.
 */

import { formatCustomDate, isPeriodOpen } from './utils.js';

export async function ensureFootBoxHtml(footBox) {
  if (!footBox.querySelector('.foot-box-period') || !footBox.querySelector('#foot-box-save-btn')) {
    const html = await fetch('components/footBox.html').then(r => r.text());
    footBox.innerHTML = html;
  }
}


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
