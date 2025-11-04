/**
 * @file Renders admin stages table for frontend.
 * @author afk-gharcia
 * @description Renders and manages the admin stages table and add/delete popups.
 */
 
export function renderAdminStagesTable(teams_stage) {
    const container = document.getElementById('admin-stages-list');
    if (!container) return;
    if (!teams_stage || !teams_stage.length) {
        container.innerHTML = '<div style="color:#ffd700;opacity:0.7;">Nenhum stage encontrado</div>';
        return;
    }
    let html = `<table class="admin-stages-table" style="width:100%;max-width:900px;margin:0 auto;background:#181818;border-radius:12px;box-shadow:0 2px 16px #0007;overflow:hidden;">
        <thead>
            <tr style="background:#222;color:#ffd700;font-weight:bold;text-transform:lowercase;">
                <th style="padding:10px 8px;">stage</th>
                <th style="padding:10px 8px;">team name</th>
                <th style="padding:10px 8px;text-align:center;"></th>
            </tr>
        </thead>
        <tbody>`;
    teams_stage.forEach((item, idx) => {
        const delId = `delete-stage-team-btn-${idx}`;
        html += `<tr>
            <td style="padding:8px 6px;">${item.phase ?? ''}</td>
            <td style="padding:8px 6px;">${item.name ?? ''}</td>
            <td style="padding:8px 6px;text-align:center;vertical-align:middle;">
                <button id="${delId}" title="Deletar relação" aria-label="Deletar relação" style="background:none;border:none;cursor:pointer;padding:0 4px;vertical-align:middle;outline:none;transition:box-shadow 0.2s;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    
    container.onclick = async (e) => {
        const btn = e.target.closest('button[id^="delete-stage-team-btn-"]');
        if (!btn) return;
        const idx = parseInt(btn.id.replace('delete-stage-team-btn-', ''));
        const item = teams_stage[idx];
        if (!item) return;
        
        const { showConfirmDeleteStageTeam } = await import('./confirmDeleteStageTeam.js');
        showConfirmDeleteStageTeam({
            phase: item.phase,
            team: item.name,
            onConfirm: async () => {
                
                let phase_id = null, team_id = null;
                
                if (window.adminData) {
                    
                    const phaseObj = (window.adminData.games || []).find(g => g.phase === item.phase);
                    phase_id = phaseObj ? (phaseObj.phase_id || phaseObj.major_phase_id) : null;
                    
                    const teamObj = (window.adminData.teams || []).find(t => t.name === item.name);
                    team_id = teamObj ? teamObj.id : null;
                }
                if (!phase_id || !team_id) throw new Error('IDs não encontrados');
                
                const res = await fetch('https://redondo-major.vercel.app/api/majorTeams', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phase_id, team_id })
                });
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao deletar relação');
                
                if (typeof window.carregarAdminDashboard === 'function') {
                    await window.carregarAdminDashboard();
                } else {
                    window.location.reload();
                }
            }
        });
    };
   
    const btn = document.createElement('button');
    btn.textContent = '+ New Line';
    btn.style.background = '#ffd700';
    btn.style.color = '#23272b';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.padding = '8px 18px';
    btn.style.fontWeight = 'bold';
    btn.style.margin = '18px auto 0 auto';
    btn.style.display = 'block';
    btn.onclick = async () => {
        
        const { showStageTeamAddPopup } = await import('./stageTeamAddPopup.js');
        
        const teams = (window.adminData && window.adminData.teams) || [];
        
        let phases = [];
        if (window.adminData && Array.isArray(window.adminData.games)) {
            const seen = new Set();
            window.adminData.games.forEach(g => {
                if (g.major_phase_id && g.phase && !seen.has(g.major_phase_id)) {
                    phases.push({ id: g.major_phase_id, phase: g.phase });
                    seen.add(g.major_phase_id);
                }
            });
        }
        
        phases = phases.sort((a, b) => a.id - b.id);
        showStageTeamAddPopup({
            phases,
            teams,
            onSuccess: async ({ phaseId, teamId }) => {
                
                try {
                    const res = await fetch('https://redondo-major.vercel.app/api/majorTeams', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phase_id: phaseId, team_id: teamId })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao adicionar relação');
                    
                    if (typeof window.carregarAdminDashboard === 'function') {
                        await window.carregarAdminDashboard();
                    } else {
                        window.location.reload();
                    }
                } catch (err) {
                    throw err;
                }
            }
        });
    };
    container.appendChild(btn);
    
    const table = container.querySelector('table.admin-stages-table');
    if (table) {
        table.style.opacity = '0';
        table.style.animation = 'stageTabsFadeIn 0.8s cubic-bezier(.77,0,.18,1) 0s 1 normal forwards';
        setTimeout(() => { table.style.opacity = '1'; }, 800);
    }
}
