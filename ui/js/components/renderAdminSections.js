/**
 * @file Renders admin sections for frontend.
 * @author afk-gharcia
 * @description Renders and manages the admin dashboard sections and tab navigation.
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
        
        const tabs = [
            { id: 'admin-tab-players', label: 'Players' },
            { id: 'admin-tab-games', label: 'Games' },
            { id: 'admin-tab-stages', label: 'Stages' }
        ];
        const tabsContainer = document.getElementById('admin-tabs');
        
        let renderAdminPlayersTable, renderAdminGamesTable, renderAdminStagesTable;
        import('./renderAdminPlayersTable.js').then(mod => {
            renderAdminPlayersTable = mod.renderAdminPlayersTable;
        });
        import('./renderAdminGamesTable.js').then(mod => {
            renderAdminGamesTable = mod.renderAdminGamesTable;
            
            const gamesTab = document.getElementById('admin-tab-games');
            if (gamesTab && gamesTab.style.display !== 'none') {
                renderAdminGamesTable(data.games || []);
            }
        });
        import('./renderAdminStagesTable.js').then(mod => {
            renderAdminStagesTable = mod.renderAdminStagesTable;
            
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
                    
                    tabDiv.classList.remove('active');
                    document.getElementById(tab.id).style.display = 'none';
                } else {
                    
                    tabsContainer.querySelectorAll('.stage-tab').forEach(t => t.classList.remove('active'));
                    tabDiv.classList.add('active');
                    
                    tabs.forEach(t => {
                        document.getElementById(t.id).style.display = 'none';
                    });
                    
                    document.getElementById(tab.id).style.display = '';
                    
                    if (tab.id === 'admin-tab-players' && typeof renderAdminPlayersTable === 'function') {
                        renderAdminPlayersTable(data.tokens_players || []);
                    }
                    
                    if (tab.id === 'admin-tab-games' && typeof renderAdminGamesTable === 'function') {
                        renderAdminGamesTable(data.games || []);
                    }
                    
                    if (tab.id === 'admin-tab-stages' && typeof renderAdminStagesTable === 'function') {
                        renderAdminStagesTable(data.stages || data.teams_stage || []);
                    }
                }
            };
            tabsContainer.appendChild(tabDiv);
        });
        
        tabsContainer.querySelectorAll('.stage-tab').forEach(t => t.classList.remove('active'));
        tabs.forEach((tab) => {
            document.getElementById(tab.id).style.display = 'none';
        });
}
