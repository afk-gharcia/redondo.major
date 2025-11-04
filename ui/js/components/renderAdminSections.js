// Renderiza as sessões fixas da página admin (Players, Games, Stages)
// Usa o mesmo visual dos stages da predictions

/**
 * Renderiza as sessões fixas da página admin.
 * @param {Object} data - Dados administrativos retornados do backend
 */
export function renderAdminSections(data) {
    const content = document.getElementById('admin-content');
    content.classList.remove('admin-content-hidden');
    content.innerHTML = `
        <div id="admin-tabs" class="stage-tabs" style="margin-bottom: 18px;"></div>
        <div id="admin-tab-content">
            <div id="admin-tab-players" class="admin-tab-panel">
                <div id="admin-players-list"></div>
            </div>
            <div id="admin-tab-games" class="admin-tab-panel" style="display:none;">
                <div id="admin-games-list"></div>
            </div>
            <div id="admin-tab-stages" class="admin-tab-panel" style="display:none;">
                <div id="admin-stages-list"></div>
            </div>
        </div>
    `;
        // Render the tabs (none selected by default)
        const tabs = [
            { id: 'admin-tab-players', label: 'Players' },
            { id: 'admin-tab-games', label: 'Games' },
            { id: 'admin-tab-stages', label: 'Stages' }
        ];
        const tabsContainer = document.getElementById('admin-tabs');
        // Importa funções de renderização diretamente dos arquivos separados
        let renderAdminPlayersTable, renderAdminGamesTable, renderAdminStagesTable;
        import('./renderAdminPlayersTable.js').then(mod => {
            renderAdminPlayersTable = mod.renderAdminPlayersTable;
        });
        import('./renderAdminGamesTable.js').then(mod => {
            renderAdminGamesTable = mod.renderAdminGamesTable;
            // Se a aba games já estiver ativa, renderiza imediatamente
            const gamesTab = document.getElementById('admin-tab-games');
            if (gamesTab && gamesTab.style.display !== 'none') {
                renderAdminGamesTable(data.games || []);
            }
        });
        import('./renderAdminStagesTable.js').then(mod => {
            renderAdminStagesTable = mod.renderAdminStagesTable;
            // Se a aba stages já estiver ativa, renderiza imediatamente
            const stagesTab = document.getElementById('admin-tab-stages');
            if (stagesTab && stagesTab.style.display !== 'none') {
                renderAdminStagesTable(data.stages || data.teams_stage || []);
            }
        });
        tabs.forEach((tab) => {
            const tabDiv = document.createElement('div');
            tabDiv.className = 'stage-tab';
            tabDiv.textContent = tab.label;
            tabDiv.style.cursor = 'pointer';
            tabDiv.onclick = () => {
                if (tabDiv.classList.contains('active')) {
                    // Deselect if already selected
                    tabDiv.classList.remove('active');
                    document.getElementById(tab.id).style.display = 'none';
                } else {
                    // Deselect all tabs
                    tabsContainer.querySelectorAll('.stage-tab').forEach(t => t.classList.remove('active'));
                    tabDiv.classList.add('active');
                    // Hide all panels
                    tabs.forEach(t => {
                        document.getElementById(t.id).style.display = 'none';
                    });
                    // Show the active panel
                    document.getElementById(tab.id).style.display = '';
                    // Se for Players, renderiza a tabela usando tokens_players
                    if (tab.id === 'admin-tab-players' && typeof renderAdminPlayersTable === 'function') {
                        renderAdminPlayersTable(data.tokens_players || []);
                    }
                    // Se for Games, renderiza a tabela usando games
                    if (tab.id === 'admin-tab-games' && typeof renderAdminGamesTable === 'function') {
                        renderAdminGamesTable(data.games || []);
                    }
                    // Se for Stages, renderiza a tabela usando stages
                    if (tab.id === 'admin-tab-stages' && typeof renderAdminStagesTable === 'function') {
                        renderAdminStagesTable(data.stages || data.teams_stage || []);
                    }
                }
            };
            tabsContainer.appendChild(tabDiv);
        });
        // Start with no tab selected
        tabsContainer.querySelectorAll('.stage-tab').forEach(t => t.classList.remove('active'));
        tabs.forEach((tab) => {
            document.getElementById(tab.id).style.display = 'none';
        });
}
