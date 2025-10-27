/**
 * Main script for the predictions page.
 * Loads and renders the major stages form for user predictions.
 */
import { loadMajorStages } from './loadMajorStages.js';

window.loadMajorStages = loadMajorStages;

document.addEventListener('DOMContentLoaded', () => {
  // Exibir mensagem de sucesso se houver
  const stageKey = localStorage.getItem('palpite_salvo_stage');
  if (stageKey) {
    const popup = document.createElement('div');
    popup.textContent = `Palpites Salvos para o ${stageKey.replace(/_/g, ' ').replace('stage', 'Stage').toUpperCase()}`;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#e6ffe6';
    popup.style.color = '#228B22';
    popup.style.fontWeight = 'bold';
    popup.style.textAlign = 'center';
    popup.style.padding = '18px 32px';
    popup.style.borderRadius = '12px';
    popup.style.boxShadow = '0 4px 32px #0003';
    popup.style.zIndex = '9999';
    popup.style.fontSize = '1.15em';
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
    }, 2500);
    localStorage.removeItem('palpite_salvo_stage');
  }
  loadMajorStages();
});
