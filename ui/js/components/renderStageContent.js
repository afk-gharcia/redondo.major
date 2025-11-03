// Módulo para renderizar o conteúdo do stage (formulário, classificação, listeners, foot-box)
import { formatCustomDate, isPeriodOpen } from './utils.js';
import { prefillPredictions } from './prefillPredictions.js';
import { updateFootBox } from './footBox.js';
import { showFormPredictPopup } from './formPredictPopup.js';

/**
 * Renderiza o conteúdo do stage, preenche predictions, listeners e foot-box.
 * @param {Object} phase - Dados da fase.
 * @param {HTMLElement} container - Elemento onde renderizar o conteúdo.
 * @param {Array} predictions - Predictions salvas para a fase.
 * @param {Function} onSave - Callback chamado ao clicar em Salvar.
 */
export async function renderStageContent(phase, container, predictions, onSave) {
  // Se for playoff, mantém o layout mas substitui o conteúdo por uma caixa de campeão
  if (phase && (phase.major_phase_name || '').toLowerCase().includes('playoff')) {
    // Carrega o template do stageBox.html
    let stageBoxHtml = await fetch('components/stageBox.html').then(r => r.text());
    // Substitui o form e a classificação por uma caixa de campeão
    const championHtml = `
      <div class="playoff-champion-box" style="display:flex;justify-content:center;align-items:center;height:180px;">
        <div class="champion-pick" style="background:#181818;border-radius:12px;padding:32px 28px;min-width:220px;max-width:90vw;box-shadow:0 2px 16px #0004;display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:background 0.18s;margin:auto;align-self:center;">
          <span class="champion-pick-label" style="color:#ffd700;font-weight:700;font-size:1.1em;margin-bottom:12px;text-align:center;display:block;width:100%;">Selecione o Campeão..</span>
          <span class="champion-pick-value" style="color:#fff;font-size:1.15em;min-height:28px;text-align:center;display:block;width:100%;"></span>
        </div>
      </div>
    `;
  // Substitui apenas o form (deixa o resto do layout igual)
  stageBoxHtml = stageBoxHtml.replace('<!--STAGE_FORM-->', championHtml);
  // Remove o bloco 3-1/3-2
  stageBoxHtml = stageBoxHtml.replace(/<div class="classification-tables-col">[\s\S]*?<span class="classification-title">3-1\/3-2<\/span>[\s\S]*?<\/div>\s*<\/div>/, '');
  // Remove o divisor vertical
  stageBoxHtml = stageBoxHtml.replace(/<div class="stage-divider"><\/div>/, '');
  container.innerHTML = stageBoxHtml;

    // Listener para abrir popup ao clicar
    const pickBox = container.querySelector('.champion-pick');
    pickBox.addEventListener('click', () => {
      showFormPredictPopup({
        teams: phase.teams || [],
        type: 'champion',
        index: 0
      });
    });
    // Preencher valor salvo se existir
    if (Array.isArray(predictions)) {
      const predChampion = predictions.find(p => p.type === 'champion');
      if (predChampion && Array.isArray(predChampion.value) && predChampion.value.length > 0) {
        const team = (phase.teams || []).find(t => t.team_id === predChampion.value[0]);
        if (team) {
          container.querySelector('.champion-pick-value').textContent = team.team_name;
        }
      }
    }
    // Atualiza o foot-box normalmente
    const footBox = document.getElementById('foot-box');
    updateFootBox(footBox, phase.start_guess_period, phase.end_guess_period, onSave);
    return;
  }

  // Carrega o template do stageBox.html
  let stageBoxHtml = await fetch('components/stageBox.html').then(r => r.text());
  // Monta o form dinâmico dos jogos
  let formHtml = '';
  if (Array.isArray(phase.games) && phase.games.length > 0) {
    formHtml += `<form class="stage-form">`;
    phase.games.forEach((game, gidx) => {
      const t1 = game.team_01_name || 'Time 1';
      const t2 = game.team_02_name || 'Time 2';
      formHtml += `
        <div class="game-row">
          <button type="button" class="team-btn team-btn-home" data-game="${gidx}" data-team="1">${t1}</button>
          <span class="team-btn-x">x</span>
          <button type="button" class="team-btn team-btn-away" data-game="${gidx}" data-team="2">${t2}</button>
        </div>
      `;
    });
    formHtml += `</form>`;
  }
  // Insere o formHtml no placeholder do stageBox
  stageBoxHtml = stageBoxHtml.replace('<!--STAGE_FORM-->', formHtml);
  container.innerHTML = stageBoxHtml;

  // Preencher predictions salvas
  prefillPredictions(phase, container, predictions);

  // Listeners dos botões de times
  const form = container.querySelector('.stage-form');
  if (form) {
    form.querySelectorAll('.team-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const gameIdx = this.getAttribute('data-game');
        if (this.classList.contains('team-btn-selected')) {
          this.classList.remove('team-btn-selected');
        } else {
          form.querySelectorAll(`.team-btn[data-game="${gameIdx}"]`).forEach(b => b.classList.remove('team-btn-selected'));
          this.classList.add('team-btn-selected');
        }
      });
    });
  }

  // Listeners dos picks de classificação
  container.querySelectorAll('.classification-pick').forEach((el, idx) => {
    el.addEventListener('click', () => {
      showFormPredictPopup({
        teams: phase.teams || [],
        type: el.getAttribute('data-type'),
        index: idx
      });
    });
  });

  // Atualiza o foot-box
  const footBox = document.getElementById('foot-box');
  updateFootBox(footBox, phase.start_guess_period, phase.end_guess_period, onSave);
}
