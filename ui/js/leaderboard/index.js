import { loadJSON } from './loadJSON.js';
import { calculatePrizes } from './calculatePrizes.js';
import { calculatePoints } from './calculatePoints.js';
import { calculateTiebreaker } from './calculateTiebreaker.js';
import { getPlayerScoreDetails } from './getPlayerScoreDetails.js';

document.addEventListener('DOMContentLoaded', async () => {

  const [players, predictions, results, teams, major] = await Promise.all([
    loadJSON('../data/players.json'),
    loadJSON('../data/predictions.json'),
    loadJSON('../data/results.json'),
    loadJSON('../data/teams.json'),
    loadJSON('../data/major.json')
  ]);


  const games = {
    stage_01: Array.isArray(major.stage_01?.games) ? major.stage_01.games : [],
    stage_02: Array.isArray(major.stage_02?.games) ? major.stage_02.games : [],
    stage_03: Array.isArray(major.stage_03?.games) ? major.stage_03.games : [],
    playoff: Array.isArray(major.playoffs?.games) ? major.playoffs.games : []
  };

    const leaderboard = players.map(player => {
    const prediction = predictions[player.id];
    const points = (prediction && results) ? calculatePoints(prediction, results) : 0;
    const tiebreaker = (prediction && results) ? calculateTiebreaker(prediction, results) : 0;

    return {
      id: player.id,
      name: player.display_name,
      points,
      tiebreaker
    };
  });
  leaderboard.sort((a, b) => b.points - a.points);


  const prizes = calculatePrizes(leaderboard.length);
  document.getElementById('prize-first').textContent = prizes.first;
  document.getElementById('prize-second').textContent = prizes.second;
  document.getElementById('prize-third').textContent = prizes.third;


  const tbody = document.querySelector('#leaderboard-table tbody');
  tbody.innerHTML = leaderboard.map((entry, idx) => {
    let rowClass = '';
    if (idx === 0) rowClass = 'gold-row';
    else if (idx === 1) rowClass = 'silver-row';
    else if (idx === 2) rowClass = 'bronze-row';
    return `<tr class="player-row ${rowClass}" data-player-id="${entry.id}"><td>${idx + 1}</td><td>${entry.name}</td><td>${entry.points}</td><td>${entry.tiebreaker}</td></tr>`;
  }).join('');

  // Adiciona evento de clique para abrir espaço entre linhas
  // Variável para controlar o timer da animação
  let scoreLogAnimationTimer = null;
  tbody.querySelectorAll('.player-row').forEach(row => {
    row.addEventListener('click', function() {
      const playerId = this.getAttribute('data-player-id');
      const nextRow = this.nextSibling;
      // Se já existe uma linha de detalhe logo abaixo, remove só ela
      if (nextRow && nextRow.classList && nextRow.classList.contains('detail-row')) {
        nextRow.remove();
        return;
      }
      // Busca detalhes do jogador
      const prediction = predictions[playerId];
      const details = getPlayerScoreDetails(prediction, results, teams, games);
      let html = '';
      if (details.length) {
        html = details.map(group => {
          // Divide os itens em até 2 colunas de no máximo 10 itens
          const col1 = group.items.slice(0, 10);
          const col2 = group.items.slice(10, 20);
          return `
            <div class="score-log-group collapsed">
              <div class="score-log-title">${group.title} <span class="score-log-toggle" style="float:right;font-size:0.9em;opacity:0.7;">[+]</span></div>
              <div class="score-log-list-wrap">
                <ul class='score-log-list collapsed' style="text-align:left;"></ul>
                <ul class='score-log-list collapsed' style="text-align:left;"></ul>
              </div>
            </div>
          `;
        }).join('');
      } else {
        html = `<span style=\"color:#aaa;font-style:italic;\">No points breakdown available.</span>`;
      }
      // Cria a linha de detalhe
      const tr = document.createElement('tr');
      tr.className = 'detail-row';
      tr.innerHTML = `<td colspan=\"4\" style=\"padding: 24px 12px; background: #181818;\">${html}</td>`;
      this.parentNode.insertBefore(tr, this.nextSibling);

      // Animação: adiciona linhas do log ao expandir o grupo
      if (details.length) {
        const groups = tr.querySelectorAll('.score-log-group');
        groups.forEach((groupDiv, idx) => {
          const title = groupDiv.querySelector('.score-log-title');
          const uls = groupDiv.querySelectorAll('.score-log-list');
          groupDiv.classList.add('collapsed');
          uls.forEach(ul => ul.classList.add('collapsed'));
          const toggle = title.querySelector('.score-log-toggle');
          if (toggle) toggle.textContent = '[+]';
          // Função para animar os itens ao expandir
          function animateItems() {
            uls[0].innerHTML = '';
            uls[1].innerHTML = '';
            const col1 = details[idx].items.slice(0, 10);
            const col2 = details[idx].items.slice(10, 20);
            let i = 0, j = 0;
            function fitTextToOneLine(li) {
              const minFont = 10;
              let fontSize = 15;
              li.style.whiteSpace = 'nowrap';
              li.style.overflow = 'hidden';
              li.style.textOverflow = 'ellipsis';
              li.style.fontSize = fontSize + 'px';
              // Reduz até não quebrar ou atingir mínimo
              while (li.scrollWidth > li.clientWidth && fontSize > minFont) {
                fontSize -= 1;
                li.style.fontSize = fontSize + 'px';
              }
            }
            function addCol1() {
              if (!document.body.contains(tr)) return;
              if (i < col1.length) {
                const li = document.createElement('li');
                li.textContent = col1[i];
                li.className = 'score-log-item';
                if (/\(\+1\)/.test(col1[i])) li.classList.add('score-plus1');
                if (/\(\+2\)/.test(col1[i])) li.classList.add('score-plus2');
                if (/\(\+5\)/.test(col1[i])) li.classList.add('score-plus5');
                uls[0].appendChild(li);
                // Ajusta fonte se quebrar
                setTimeout(() => fitTextToOneLine(li), 0);
                i++;
                setTimeout(addCol1, 60);
              }
            }
            function addCol2() {
              if (!document.body.contains(tr)) return;
              if (j < col2.length) {
                const li = document.createElement('li');
                li.textContent = col2[j];
                li.className = 'score-log-item';
                if (/\(\+1\)/.test(col2[j])) li.classList.add('score-plus1');
                if (/\(\+2\)/.test(col2[j])) li.classList.add('score-plus2');
                if (/\(\+5\)/.test(col2[j])) li.classList.add('score-plus5');
                uls[1].appendChild(li);
                setTimeout(() => fitTextToOneLine(li), 0);
                j++;
                setTimeout(addCol2, 60);
              }
            }
            addCol1();
            addCol2();
          }
          title.addEventListener('click', () => {
            groupDiv.classList.toggle('collapsed');
            if (groupDiv.classList.contains('collapsed')) {
              uls.forEach(ul => {
                ul.classList.add('collapsed');
                ul.innerHTML = '';
              });
              if (toggle) toggle.textContent = '[+]';
            } else {
              uls.forEach(ul => ul.classList.remove('collapsed'));
              if (toggle) toggle.textContent = '[–]';
              animateItems();
            }
          });
        });
      }
    });
  });
});
