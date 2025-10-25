/**
 * Loads and renders all major stages for the predictions form.
 * Handles dynamic UI for stage selection and team picks.
 */
import { renderStageForm } from './renderStageForm.js';
import { activateTeamBtnListeners } from './renderStageForm.js';
import { formatDate } from './formatDate.js';

export async function loadMajorStages() {
    
    const main = document.querySelector('main');
    
    let userId = localStorage.getItem('userId');
    let displayName = userId;
    try {
        const playersResp = await fetch('../data/players.json');
        const players = await playersResp.json();
        const found = players.find(p => String(p.id) === String(userId));
        if (found) displayName = found.display_name;
    } catch (e) {}
    const userHeader = document.createElement('div');
    userHeader.className = 'user-header';
    userHeader.style.display = 'flex';
    userHeader.style.alignItems = 'center';
    userHeader.style.justifyContent = 'center';
    userHeader.style.gap = '12px';
    userHeader.style.margin = '0 0 24px 0';
    
    userHeader.innerHTML = `
        <span style="display:flex;align-items:center;gap:8px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
            <span id="userDisplayName" style="font-weight:600;font-size:1.15em;color:#ffd700;">${displayName}</span>
        </span>
        <button id="logoutBtn" title="Sair" style="background:none;border:none;cursor:pointer;padding:4px 8px;margin-left:8px;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    `;
    
    userHeader.querySelector('#logoutBtn').onclick = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('display_name');
        const mainEl = document.querySelector('main');
        if (mainEl) {
            
            mainEl.innerHTML = `
                <div class="token-container">
                    <form id="token-form">
                        <div class="token-form-group">
                            <div class="token-input-group">
                                <div id="error-msg" class="hidden"></div>
                                <input type="text" class="token-input" id="token-input" placeholder="Digite seu token..." maxlength="5" required />
                            </div>
                            <button type="submit" class="btn-continuar">Continuar</button>
                        </div>
                    </form>
                </div>
                <div id="userId" class="hidden"></div>
            `;
        }
        
        const form = document.getElementById('token-form');
        const tokenInput = document.getElementById('token-input');
        const errorMsg = document.getElementById('error-msg');
        const tokenContainer = document.querySelector('.token-container');
        const userIdDiv = document.getElementById('userId');
        function shake(element) {
            element.classList.add('shake');
            setTimeout(() => {
                element.classList.remove('shake');
            }, 500);
        }
        function showError(msg) {
            errorMsg.textContent = msg;
            errorMsg.style.display = 'block';

                const startDate = new Date(s.start_guess_period + 'T00:00:00-03:00'.slice(10));
                
                const [dataStr, horaStrRaw] = s.start_guess_period.split('T');
                let utc3;
                if (horaStrRaw) {
                    const [h, m] = horaStrRaw.split(':');
                    utc3 = new Date(Date.UTC(
                        Number(dataStr.split('-')[0]),
                        Number(dataStr.split('-')[1]) - 1,
                        Number(dataStr.split('-')[2]),
                        Number(h) + 21, // UTC-3
                        Number(m || 0)
                    ));
                } else {
                    utc3 = new Date(startDate.getTime() - 3 * 60 * 60 * 1000);
                }
                const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
                const dia = utc3.getDate();
                const mes = meses[utc3.getMonth()];
                const hora = utc3.getHours().toString().padStart(2, '0');
                const min = utc3.getMinutes().toString().padStart(2, '0');
                const horaFinal = min === '00' ? `${hora}h` : `${hora}:${min}h`;
                content.innerHTML = `<div class="stage-tbd">Palpites disponíveis em ${dia} de ${mes} <span style='font-size:1.1em;'>🕒</span> ${horaFinal}</div>`;
            errorMsg.style.fontWeight = 'bold';
            tokenInput.classList.add('error');
            shake(tokenInput);
            shake(errorMsg);
        }
        function hideError() {
            errorMsg.style.display = 'none';
            tokenInput.classList.remove('error');
        }
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            hideError();
            userIdDiv.style.display = 'none';
            const token = tokenInput.value.trim().toUpperCase();
            if (!token) return;
            try {
                const res = await fetch('https://redondo-major.netlify.app/.netlify/functions/validateToken', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });
                const data = await res.json();
                if (data.valid) {
                    tokenContainer.style.display = 'none';
                    userIdDiv.style.display = 'block';
                    localStorage.setItem('userId', data.userId);
                    if (data.display_name) {
                        localStorage.setItem('display_name', data.display_name);
                    }
                    
                    loadMajorStages();
                } else {
                    showError('Token inválido ..');
                }
            } catch (err) {
                showError('Erro de conexão com a API.');
            }
        });
    };
    main.appendChild(userHeader);
    const response = await fetch('../data/major.json');
    const major = await response.json();
    const teamsResp = await fetch('../data/teams.json');
    const teams = await teamsResp.json();
    const stages = [
        { key: 'stage_01', label: 'Stage 01' },
        { key: 'stage_02', label: 'Stage 02' },
        { key: 'stage_03', label: 'Stage 03' },
        { key: 'playoffs', label: 'Playoffs' }
    ];
    
    let firstOpenOrAvailable = null;
    let idxStage = 0;
    const now = new Date();
    let anyStageOpen = false;
    const container = document.createElement('div');
    container.className = 'stages-list';
    container.style.maxWidth = '600px';
    container.style.margin = '32px auto';
    container.style.width = '100%';
    for (const stage of stages) {
        if (!major[stage.key]) continue;
        const s = major[stage.key];
        if (!s.start_guess_period || !s.end_guess_period) continue;
        const start = new Date(s.start_guess_period);
        const end = new Date(s.end_guess_period);
        let state = '';
        if (now < start) state = 'future';
        else if (now > end) state = 'past';
        else state = 'open';
        if (!firstOpenOrAvailable && (state === 'open' || state === 'future')) firstOpenOrAvailable = idxStage;
        const header = document.createElement('div');
        header.className = 'stage-header';
        header.innerHTML = `<span>${stage.label}</span>`;
        const content = document.createElement('div');
        content.className = 'stage-content';

    content.style.display = 'none';
        if (state === 'future') {

            const [dataStr, horaStrRaw] = s.start_guess_period.split('T');
            let utc3;
            if (horaStrRaw) {
                const [h, m] = horaStrRaw.split(':');
                utc3 = new Date(Date.UTC(
                    Number(dataStr.split('-')[0]),
                    Number(dataStr.split('-')[1]) - 1,
                    Number(dataStr.split('-')[2]),
                    Number(h) + 21, // UTC-3
                    Number(m || 0)
                ));
            } else {
                utc3 = new Date(new Date(s.start_guess_period).getTime() - 3 * 60 * 60 * 1000);
            }
            const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
            const dia = utc3.getDate();
            const mes = meses[utc3.getMonth()];
            const hora = utc3.getHours().toString().padStart(2, '0');
            const min = utc3.getMinutes().toString().padStart(2, '0');
            const horaFinal = min === '00' ? `${hora}h` : `${hora}:${min}h`;
            content.innerHTML = `<div class="stage-tbd">Palpites disponíveis em ${dia} de ${mes} às ${horaFinal}</div>`;
            content.style.opacity = '0.5';
            content.style.pointerEvents = 'none';
        } else {
            const htmlJogos = await renderStageForm(s, teams);

            content.innerHTML = htmlJogos;

            activateTeamBtnListeners();
            if (state === 'past') {
                content.style.opacity = '0.5';
                content.style.pointerEvents = 'none';
            } else {
                anyStageOpen = true;
                setTimeout(() => {
                    
                    activateTeamBtnListeners();
                    
                    content.querySelectorAll('.thirty-pick').forEach(el => {
                        el.addEventListener('click', function(e) {
                            e.stopPropagation();
                            content.querySelectorAll('.thirty-list').forEach(list => list.remove());
                            const idx = this.getAttribute('data-thirty');
                            const list = document.createElement('div');
                            list.className = 'thirty-list';
                            s.teams.forEach(tid => {
                                const t = teams.find(tm => tm.id === tid);
                                const item = document.createElement('div');
                                item.className = 'thirty-list-item';
                                item.textContent = t ? t.name : 'Time '+tid;
                                item.addEventListener('click', ev => {
                                    ev.stopPropagation();
                                    el.textContent = item.textContent;
                                    el.classList.add('selected');
                                    list.remove();
                                });
                                list.appendChild(item);
                            });
                            const clear = document.createElement('div');
                            clear.className = 'thirty-list-item';
                            clear.style.color = '#d32f2f';
                            clear.textContent = 'Limpar';
                            clear.addEventListener('click', ev => {
                                ev.stopPropagation();
                                el.textContent = 'Escolha um time ...';
                                el.classList.remove('selected');
                                list.remove();
                            });
                            list.appendChild(clear);
                            el.parentNode.appendChild(list);
                        });
                    });
                    document.addEventListener('click', function closeLists(e) {
                        content.querySelectorAll('.thirty-list').forEach(list => list.remove());
                        document.removeEventListener('click', closeLists);
                    });
                }, 0);
            }
        }
        header.addEventListener('click', () => {

            if (content.style.display === 'none') {

                container.querySelectorAll('.stage-content').forEach(c => c.style.display = 'none');
                container.querySelectorAll('.stage-header').forEach(h => h.classList.remove('open'));
                content.style.display = 'block';
                header.classList.add('open');

                activateTeamBtnListeners();

                const btns = content.querySelectorAll('.team-btn-name');

            } else {
                content.style.display = 'none';
                header.classList.remove('open');
            }

        });
    
        container.appendChild(header);
        container.appendChild(content);
        idxStage++;
    }
    
    if (!anyStageOpen) {
        const msg = document.createElement('div');
        msg.className = 'no-stage-open';
        msg.textContent = 'Nenhum período de palpites está aberto no momento.';
        container.appendChild(msg);
    }
    main.appendChild(container);
    const btnDiv = document.createElement('div');
    btnDiv.style.width = '100%';
    btnDiv.style.display = 'flex';
    btnDiv.style.justifyContent = 'center';
    btnDiv.style.margin = '32px 0 0 0';
    btnDiv.innerHTML = '<button type="button" class="btn-continuar" id="btnSalvarPalpites">Salvar Palpites</button>';
    main.appendChild(btnDiv);
}
