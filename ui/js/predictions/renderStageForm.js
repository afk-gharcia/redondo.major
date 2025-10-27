import { showTeamSelectPopup } from './spotBoxPopup.js';

/**
 * Renders the form for a single stage in the predictions page.
 * Generates HTML for games and next stage spots selection.
 */
export async function renderStageForm(stageData, teams) {
    
    let gamesHtml = '<div class="stage-games">';
    stageData.games.forEach((game, idx) => {
        const home = teams.find(t => t.id === game.home)?.name || `Time ${game.home}`;
        const away = teams.find(t => t.id === game.away)?.name || `Time ${game.away}`;
        function trimEndName(name, maxLen = 13) {
            if (name.length <= maxLen) return name;
            return name.slice(0, maxLen - 3) + '...';
        }
        const homeShort = trimEndName(home);
        const awayShort = trimEndName(away);
        const homeId = `btn-home-${idx}`;
        const awayId = `btn-away-${idx}`;
        gamesHtml += `
        <div class="game-row">
            <div id="${homeId}" role="button" tabindex="0" class="team-btn team-btn-name team-btn-home" title="${home}">${homeShort}</div>
            <div class="team-btn team-btn-x" aria-disabled="true">X</div>
            <div id="${awayId}" role="button" tabindex="0" class="team-btn team-btn-name team-btn-away" title="${away}">${awayShort}</div>
        </div>`;
    });
    gamesHtml += '</div>';


    // Estrutura correta: 2 colunas, fixa e clicável
    let nextSpotsHtml = `<div class="next-spots-list">
      ${Array.from({length: 10}).map((_, i) => {
        let extraClass = '';
        if (i === 2) extraClass = ' next-spot-gap';
        if (i === 8) extraClass = ' next-spot-gap';
        let fixedText = '';
        let fixedClass = '';
        if (i < 2) {
          fixedText = '3-0';
          fixedClass = ' spot-green';
        } else if (i > 7) {
          fixedText = '0-3';
          fixedClass = ' spot-red';
        }
        return `<div class="next-spot-row${extraClass}"><div class="spot-fixed${fixedClass}">${fixedText}</div><div class="spot-box spot-box-selectable" role="button" tabindex="0"></div></div>`;
      }).join('')}
    </div>`;

    const actionsHtml = `
      <div class="stage-form-actions">
        <button type="button" class="btn-limpar">Limpar</button>
        <button type="button" class="btn-salvar">Salvar</button>
      </div>
    `;

    return `<div class="stage-form">
        <div class="stage-form-left">${gamesHtml}</div>
        <div class="stage-divider"></div>
        <div class="stage-form-right">${nextSpotsHtml}</div>
    </div>${actionsHtml}`;
}

export function activateTeamBtnListeners() {
    if (typeof window !== 'undefined') {
        window.activateTeamBtnListeners = activateTeamBtnListeners;
    }

    document.querySelectorAll('.stage-form').forEach(function(form) {

        form.onclick = null;
        form.onkeydown = null;
        form.addEventListener('click', function(e) {

            const btn = e.target.closest('.team-btn-name');
            if (btn && form.contains(btn)) {

                const row = btn.closest('.game-row');
                if (!row) return;
                const btns = Array.from(row.querySelectorAll('.team-btn-name'));
                btns.forEach(b => {
                    b.classList.remove('team-btn-selected');

                });
                btn.classList.add('team-btn-selected');

            }
        });
        form.addEventListener('keydown', function(e) {
            const btn = e.target.closest('.team-btn-name');
            if (btn && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

export function activateSpotBoxListeners(teams, stageTeams) {
  // Filtra os times do stage
  const allowedTeams = teams.filter(t => stageTeams.includes(t.id));
  document.querySelectorAll('.spot-box-selectable').forEach((el) => {
    el.onclick = () => {
      const selectedIds = Array.from(document.querySelectorAll('.spot-box-selectable[data-team-id]'))
        .map(e => Number(e.getAttribute('data-team-id')))
        .filter(id => !isNaN(id));
      showTeamSelectPopup(
        allowedTeams,
        (team) => {
          el.textContent = team.name;
          el.setAttribute('data-team-id', team.id);
        },
        selectedIds
      );
    };
    el.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    };
  });

  // Handler do botão Salvar (delegação para garantir funcionamento)
  // Delegação de evento para garantir funcionamento
  const stagesList = document.querySelector('.stages-list');
  if (stagesList) {
    stagesList.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn-salvar');
      if (!btn) return;

      // Debug visual
      btn.style.background = '#228B22';
      btn.style.color = '#fff';
      btn.textContent = 'Processando...';
      setTimeout(() => {
        btn.style.background = '';
        btn.style.color = '';
        btn.textContent = 'Salvar';
      }, 1200);

      // Busca robusta do .stage-form subindo pelo DOM, aceitando elementos intermediários
      let form = null;
      let node = btn;
      let debugPath = [];
      while (node && node !== document.body) {
        debugPath.push(node.tagName + (node.className ? '.' + node.className : ''));
        if (node.classList && node.classList.contains('stage-form')) {
          form = node;
          break;
        }
        node = node.parentNode;
      }
      // Se não encontrou, tenta buscar por querySelector a partir do content
      if (!form) {
        let content = btn;
        while (content && content !== document.body) {
          if (content.classList && content.classList.contains('stage-content')) {
            form = content.querySelector('.stage-form');
            if (form) break;
          }
          content = content.parentNode;
        }
      }
      if (!form) {
        console.error('[DEBUG] Não encontrou .stage-form. Caminho DOM:', debugPath.join(' > '));
        alert('Erro interno: não encontrou o formulário do stage.');
        return;
      }

      // 1. Coletar games
      const gameRows = form.querySelectorAll('.game-row');
      const games = Array.from(gameRows).map((row, idx) => {
        const selected = row.querySelector('.team-btn-selected');
        if (!selected) return null;
        const isHome = selected.classList.contains('team-btn-home');
        const teamName = selected.textContent;
        const teamId = allowedTeams.find(t => t.name === teamName)?.id;
        return { idx, isHome, teamId };
      });

      // 2. Coletar spots (classificados, 3-0, 0-3)
      const spotBoxes = form.querySelectorAll('.spot-box-selectable');
      const spotIds = Array.from(spotBoxes).map(el => Number(el.getAttribute('data-team-id'))).filter(id => !isNaN(id));
      const classifieds = spotIds.slice(2, 8);
      const thirty = spotIds.slice(0, 2);
      const zeroThree = spotIds.slice(8, 10);

      // 3. Montar objeto para predictions.json
      // O stageKey deve ser obtido pelo header do stage
      let stageKey = null;
      let parent = form.parentNode;
      while (parent && !stageKey) {
        const header = parent.querySelector && parent.querySelector('.stage-header');
        if (header) {
          stageKey = header.textContent?.toLowerCase().replace(/\s/g, '_');
        }
        parent = parent.parentNode;
      }
      // Fallback: tenta obter pelo DOM do form
      if (!stageKey) {
        const possible = form.querySelector('.stage-header');
        if (possible) {
          stageKey = possible.textContent?.toLowerCase().replace(/\s/g, '_');
        }
      }
      if (!stageKey) {
        console.error('[DEBUG] Não encontrou stageKey');
        alert('Erro ao identificar o stage.');
        return;
      }
      const prediction = {};
      games.forEach((g, i) => {
        if (g && g.teamId) {
          prediction[`${stageKey}_game_0${i+1}`] = g.teamId;
        }
      });
      prediction[`${stageKey}_classifieds`] = classifieds;
      prediction[`${stageKey}_30`] = thirty;
      prediction[`${stageKey}_03`] = zeroThree;

      // Mensagem de sucesso em popup
      const popup = document.createElement('div');
      // Estilização inspirada no popup de seleção de times
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.background = '#23272b';
      popup.style.border = '2px solid #fff';
      popup.style.borderRadius = '10px';
  popup.style.padding = '38px 32px 22px 32px'; // padding-top maior para espaço do X
      popup.style.zIndex = '9999';
      popup.style.boxShadow = '0 4px 32px #000a';
      popup.style.minWidth = '260px';
      popup.style.maxWidth = '92vw';
      popup.style.fontFamily = 'inherit';
      popup.style.display = 'flex';
      popup.style.flexDirection = 'column';
      popup.style.alignItems = 'center';
      popup.style.animation = 'fadeIn 0.3s';

      // Mensagem
      const msg = document.createElement('div');
      msg.textContent = `Palpites Salvos para o ${stageKey.replace(/_/g, ' ').replace('stage', 'Stage').toUpperCase()}`;
      msg.style.color = '#fff';
      msg.style.fontWeight = 'bold';
      msg.style.fontSize = '1.18em';
      msg.style.marginBottom = '8px';
      msg.style.textShadow = '0 2px 8px #000a';
      popup.appendChild(msg);

      // Botão X para fechar
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.position = 'absolute';
  closeBtn.style.top = '6px';
  closeBtn.style.right = '8px';
      closeBtn.style.background = 'none';
      closeBtn.style.border = 'none';
      closeBtn.style.color = '#fff';
      closeBtn.style.fontSize = '1.7em';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.fontWeight = 'bold';
      closeBtn.setAttribute('aria-label', 'Fechar');
      closeBtn.onmouseover = () => closeBtn.style.color = '#ffd700';
      closeBtn.onmouseout = () => closeBtn.style.color = '#fff';
      closeBtn.onclick = () => {
        popup.remove();
        window.location.reload();
      };
      popup.appendChild(closeBtn);

      // Animação fadeIn
      const style = document.createElement('style');
      style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: scale(0.95) translate(-50%, -50%); } to { opacity: 1; transform: scale(1) translate(-50%, -50%); } }`;
      document.head.appendChild(style);

      document.body.appendChild(popup);
    });
  }
}
