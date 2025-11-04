/**
 * @file Renders stage content for frontend.
 * @author afk-gharcia
 * @description Renders and manages the main stage content, including games, picks, and champion selection.
 */

import { formatCustomDate, isPeriodOpen } from './utils.js';
import { prefillPredictions } from './prefillPredictions.js';
import { updateFootBox } from './footBox.js';
import { showFormPredictPopup } from './formPredictPopup.js';


export async function renderStageContent(phase, container, predictions, onSave) {
  
  const now = Date.now();
  const start = phase.start_guess_period ? new Date(phase.start_guess_period).getTime() : 0;
  const end = phase.end_guess_period ? new Date(phase.end_guess_period).getTime() : 0;
  const stageBox = container.querySelector('.stage-content-box');
  if (stageBox) {
    if (start > now) {
      
      stageBox.style.display = 'none';
    } else if (end < now) {
      
      stageBox.querySelectorAll('button, input, select, textarea').forEach(el => {
        el.disabled = true;
        el.style.cursor = 'not-allowed';
      });
    }
  }

  let stageBoxHtml;
  let isPlayoff = phase && (phase.major_phase_name || '').toLowerCase().includes('playoff');
  if (isPlayoff) {
    
    stageBoxHtml = await fetch('components/stageBoxPlayoff.html').then(r => r.text());
    
    const cssId = 'stageBoxPlayoff-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'css/components/stageBoxPlayoff.css';
      document.head.appendChild(link);
    }
  } else {
    stageBoxHtml = await fetch('components/stageBox.html').then(r => r.text());
  }
  
  let formHtml = '';
  if (Array.isArray(phase.games) && phase.games.length > 0) {
    if (isPlayoff) {
      
      formHtml += `<form class="stage-form">`;
      phase.games.forEach((game, gidx) => {
        const t1 = game.team_01_name || 'Time 1';
        const t2 = game.team_02_name || 'Time 2';
        formHtml += `
          <div class="game-row">
            <button type="button" class="team-btn-playoff team-btn-home" data-game="${gidx}" data-team="1">${t1}</button>
            <button type="button" class="team-btn score-btn" data-game="${gidx}" style="min-width:38px;max-width:38px;padding:0 0.5em;">x</button>
            <button type="button" class="team-btn-playoff team-btn-away" data-game="${gidx}" data-team="2">${t2}</button>
          </div>
        `;
      });
      formHtml += `</form>`;
    } else {
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
  }
  
  stageBoxHtml = stageBoxHtml.replace('<!--STAGE_FORM-->', formHtml);
  container.innerHTML = stageBoxHtml;

  
const mainBox = isPlayoff
  ? container.querySelector('.stage-content-box')
  : container.querySelector('.stage-content-tab');
if (mainBox && start > now) {
  mainBox.style.display = 'none';
} else if (mainBox && end < now) {
  
  mainBox.querySelectorAll('button, input, select, textarea, .champion-option, .score-option, .classification-pick').forEach(el => {
    el.disabled = true;
    el.style.pointerEvents = 'none';
    el.style.cursor = 'not-allowed';
  });
}
  
  if (isPlayoff) {
    const championBox = container.querySelector('.major-champion-box');
    if (championBox) {
      championBox.style.cursor = 'pointer';
      championBox.onclick = function() {
        
        document.querySelectorAll('.champion-popup').forEach(d => d.remove());
        
        const popup = document.createElement('div');
        popup.className = 'champion-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#23272b';
        popup.style.borderRadius = '12px';
        popup.style.boxShadow = '0 4px 32px #000a';
        popup.style.padding = '24px 18px';
        popup.style.zIndex = 9999;
        popup.innerHTML = `<div style=\"color:#ffd700;font-weight:bold;font-size:1.1em;margin-bottom:12px;text-align:center;\">Selecione o campeão</div>`;
        (phase.teams || []).forEach(team => {
          const btn = document.createElement('button');
          btn.className = 'champion-option';
          let teamName = typeof team === 'string' ? team : (team.name || team.team_name || 'Time');
          btn.textContent = teamName;
          btn.style.background = 'none';
          btn.style.border = '1.5px solid #ffd700';
          btn.style.color = '#ffd700';
          btn.style.fontWeight = 'bold';
          btn.style.fontSize = '1.08em';
          btn.style.padding = '8px 0';
          btn.style.width = '100%';
          btn.style.marginBottom = '6px';
          btn.onclick = () => {
            championBox.textContent = teamName;
            championBox.classList.add('major-champion-selected');
            popup.remove();
          };
          popup.appendChild(btn);
        });
        
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancelar';
        cancel.style.background = '#ffd700';
        cancel.style.color = '#23272b';
        cancel.style.fontWeight = 'bold';
        cancel.style.fontSize = '1em';
        cancel.style.border = 'none';
        cancel.style.borderRadius = '8px';
        cancel.style.padding = '8px 18px';
        cancel.style.marginTop = '14px';
        cancel.onclick = () => popup.remove();
        popup.appendChild(cancel);
        document.body.appendChild(popup);
        
        setTimeout(() => {
          document.addEventListener('mousedown', function handler(ev) {
            if (!popup.contains(ev.target)) {
              popup.remove();
              document.removeEventListener('mousedown', handler);
            }
          });
        }, 0);
      };
    }
  }

  
  if (isPlayoff) {
    
    const { prefillPlayoffPredictions } = await import('./prefillPlayoffPredictions.js');
    prefillPlayoffPredictions(phase, container, predictions);
  } else {
    prefillPredictions(phase, container, predictions);
  }

  
  const form = container.querySelector('.stage-form');
  if (form) {
    if (isPlayoff) {
      
      form.querySelectorAll('.team-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        btn.tabIndex = -1;
      });
    } else {
      
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
  }
    
    container.querySelectorAll('.score-btn').forEach(btn => {
      btn.disabled = false;
      btn.style.cursor = 'pointer';
      btn.onclick = function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.score-dropdown').forEach(d => d.remove());
        
        const dropdown = document.createElement('div');
        dropdown.className = 'score-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.zIndex = 1000;
        dropdown.style.background = '#23272b';
        dropdown.style.border = '1.5px solid #ffd700';
        dropdown.style.borderRadius = '8px';
        dropdown.style.boxShadow = '0 4px 32px #000a';
        dropdown.style.padding = '6px 0';
        dropdown.style.minWidth = '70px';
        dropdown.style.textAlign = 'center';
        ['2-0','2-1','1-2','0-2'].forEach(score => {
          const opt = document.createElement('button');
          opt.className = 'score-option';
          opt.textContent = score;
          opt.style.background = 'none';
          opt.style.border = 'none';
          opt.style.color = '#ffd700';
          opt.style.fontWeight = 'bold';
          opt.style.fontSize = '1.08em';
          opt.style.padding = '6px 0';
          opt.style.width = '100%';
          opt.onclick = () => {
            btn.textContent = score;
            dropdown.remove();
          };
          dropdown.appendChild(opt);
        });
        
        const rect = btn.getBoundingClientRect();
        dropdown.style.left = rect.left + window.scrollX + 'px';
        dropdown.style.top = (rect.bottom + window.scrollY + 2) + 'px';
        document.body.appendChild(dropdown);
        
        setTimeout(() => {
          document.addEventListener('mousedown', function handler(ev) {
            if (!dropdown.contains(ev.target)) {
              dropdown.remove();
              document.removeEventListener('mousedown', handler);
            }
          });
        }, 0);
      };
    });

  
  container.querySelectorAll('.classification-pick').forEach((el, idx) => {
    el.addEventListener('click', () => {
      showFormPredictPopup({
        teams: phase.teams || [],
        type: el.getAttribute('data-type'),
        index: idx
      });
    });
  });

  
  const footBox = document.getElementById('foot-box');
  updateFootBox(footBox, phase.start_guess_period, phase.end_guess_period, onSave);
}
