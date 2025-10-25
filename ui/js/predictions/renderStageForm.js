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

    return `<div class="stage-form">
        <div class="stage-form-left">${gamesHtml}</div>
        <div class="stage-divider"></div>
        <div class="stage-form-right"></div>
    </div>`;
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
