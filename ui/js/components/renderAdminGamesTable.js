import { API_BASE_URL } from '../config.js';

export function renderAdminGamesTable(games) {
	const container = document.getElementById('admin-games-list');
	if (!container) return;
	if (!games || !games.length) {
		container.innerHTML = '<div style="color:#ffd700;opacity:0.7;">Nenhum game encontrado</div>';
		return;
	}
	let html = `<table class="admin-games-table" style="width:100%;max-width:900px;margin:0 auto;background:#181818;border-radius:12px;box-shadow:0 2px 16px #0007;overflow:hidden;">
		<thead>
			<tr style="background:#222;color:#ffd700;font-weight:bold;text-transform:lowercase;">
				<th style="padding:10px 8px;">key</th>
				<th style="padding:10px 8px;">team 1</th>
				<th style="padding:10px 8px;">team 2</th>
				<th style="padding:10px 8px;text-align:center;"></th>
			</tr>
		</thead>
		<tbody>`;
	games.forEach((game, idx) => {
		const editId = `edit-game-btn-${idx}`;
		html += `<tr>
			<td style="padding:8px 6px;">${game.key || ''}</td>
			<td style="padding:8px 6px;">${game.team_01_name || game.team1_name || ''}</td>
			<td style="padding:8px 6px;">${game.team_02_name || game.team2_name || ''}</td>
			<td style="padding:8px 6px;text-align:center;vertical-align:middle;">
				<button id="${editId}" title="Editar game" aria-label="Editar game" style="background:none;border:none;cursor:pointer;padding:0 4px;vertical-align:middle;outline:none;transition:box-shadow 0.2s;">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
				</button>
			</td>
		</tr>`;
	});
	html += '</tbody></table>';
	container.innerHTML = html;
	// Delegação de eventos para o botão editar
	container.onclick = (e) => {
		const btn = e.target.closest('button[id^="edit-game-btn-"]');
		if (!btn) return;
		const idx = parseInt(btn.id.replace('edit-game-btn-', ''));
		const game = games[idx];
		if (!game) return;
		// Popup de edição de game
		const teams = (window.adminData && window.adminData.teams) || [];
		const teamNames = teams.map(t => t.name);
		// Cria overlay
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.top = 0;
		overlay.style.left = 0;
		overlay.style.width = '100vw';
		overlay.style.height = '100vh';
		overlay.style.background = 'rgba(0,0,0,0.35)';
		overlay.style.display = 'flex';
		overlay.style.alignItems = 'center';
		overlay.style.justifyContent = 'center';
		overlay.style.zIndex = 9999;
		// Popup box
		const popup = document.createElement('div');
		popup.style.background = '#23272b';
		popup.style.borderRadius = '18px';
		popup.style.boxShadow = '0 4px 32px #000a';
		popup.style.padding = '32px 28px 24px 28px';
		popup.style.minWidth = '320px';
		popup.style.maxWidth = '90vw';
		popup.style.display = 'flex';
		popup.style.flexDirection = 'column';
		popup.style.alignItems = 'center';
		// Título
		const title = document.createElement('h2');
		title.textContent = 'Editar Game';
		title.style.color = '#ffd700';
		title.style.marginBottom = '18px';
		title.style.fontSize = '1.18em';
		title.style.fontWeight = 'bold';
		popup.appendChild(title);
		// Campo key
		const keyLabel = document.createElement('label');
		keyLabel.textContent = 'Key:';
		keyLabel.style.color = '#ffd700';
		keyLabel.style.marginBottom = '4px';
		keyLabel.style.alignSelf = 'flex-start';
		popup.appendChild(keyLabel);
		const keyInput = document.createElement('input');
		keyInput.type = 'text';
		keyInput.value = game.key || '';
		keyInput.style.fontSize = '1.08em';
		keyInput.style.padding = '10px 16px';
		keyInput.style.borderRadius = '8px';
		keyInput.style.border = '1.5px solid #ffd700';
		keyInput.style.background = '#181818';
		keyInput.style.color = '#ffd700';
		keyInput.style.marginBottom = '18px';
		keyInput.style.width = '100%';
		keyInput.style.boxSizing = 'border-box';
		popup.appendChild(keyInput);
		// Campo team 1
		const team1Label = document.createElement('label');
		team1Label.textContent = 'Team 1:';
		team1Label.style.color = '#ffd700';
		team1Label.style.marginBottom = '4px';
		team1Label.style.alignSelf = 'flex-start';
		popup.appendChild(team1Label);
		const team1Select = document.createElement('select');
		team1Select.style.fontSize = '1.08em';
		team1Select.style.padding = '8px 12px';
		team1Select.style.borderRadius = '8px';
		team1Select.style.border = '1.5px solid #ffd700';
		team1Select.style.background = '#181818';
		team1Select.style.color = '#ffd700';
		team1Select.style.marginBottom = '18px';
		team1Select.style.width = '100%';
		team1Select.style.boxSizing = 'border-box';
		teamNames.forEach(name => {
			const opt = document.createElement('option');
			opt.value = name;
			opt.textContent = name;
			if (name === (game.team_01_name || game.team1_name)) opt.selected = true;
			team1Select.appendChild(opt);
		});
		popup.appendChild(team1Select);
		// Campo team 2
		const team2Label = document.createElement('label');
		team2Label.textContent = 'Team 2:';
		team2Label.style.color = '#ffd700';
		team2Label.style.marginBottom = '4px';
		team2Label.style.alignSelf = 'flex-start';
		popup.appendChild(team2Label);
		const team2Select = document.createElement('select');
		team2Select.style.fontSize = '1.08em';
		team2Select.style.padding = '8px 12px';
		team2Select.style.borderRadius = '8px';
		team2Select.style.border = '1.5px solid #ffd700';
		team2Select.style.background = '#181818';
		team2Select.style.color = '#ffd700';
		team2Select.style.marginBottom = '18px';
		team2Select.style.width = '100%';
		team2Select.style.boxSizing = 'border-box';
		teamNames.forEach(name => {
			const opt = document.createElement('option');
			opt.value = name;
			opt.textContent = name;
			if (name === (game.team_02_name || game.team2_name)) opt.selected = true;
			team2Select.appendChild(opt);
		});
		popup.appendChild(team2Select);
		// Mensagem de erro
		const errorMsg = document.createElement('div');
		errorMsg.style.color = '#d32f2f';
		errorMsg.style.fontWeight = 'bold';
		errorMsg.style.marginBottom = '10px';
		errorMsg.style.display = 'none';
		popup.appendChild(errorMsg);
		// Botões
		const btnRow = document.createElement('div');
		btnRow.style.display = 'flex';
		btnRow.style.gap = '12px';
		btnRow.style.justifyContent = 'center';
		const btnCancel = document.createElement('button');
		btnCancel.textContent = 'Cancelar';
		btnCancel.style.background = '#333';
		btnCancel.style.color = '#fff';
		btnCancel.style.border = 'none';
		btnCancel.style.borderRadius = '8px';
		btnCancel.style.padding = '8px 18px';
		btnCancel.style.fontWeight = 'bold';
		btnCancel.onclick = () => overlay.remove();
		const btnSave = document.createElement('button');
		btnSave.textContent = 'Salvar';
		btnSave.style.background = '#ffd700';
		btnSave.style.color = '#23272b';
		btnSave.style.border = 'none';
		btnSave.style.borderRadius = '8px';
		btnSave.style.padding = '8px 18px';
		btnSave.style.fontWeight = 'bold';
		btnSave.onclick = async () => {
			const newKey = keyInput.value.trim();
			const newTeam1 = team1Select.value;
			const newTeam2 = team2Select.value;
			if (!newKey || !newTeam1 || !newTeam2) {
				errorMsg.textContent = 'Preencha todos os campos.';
				errorMsg.style.display = 'block';
				return;
			}
			if (newTeam1 === newTeam2) {
				// Permite ambos iguais apenas se ambos forem id 0
				const team1Obj = teams.find(t => t.name === newTeam1);
				const team2Obj = teams.find(t => t.name === newTeam2);
				if (!(team1Obj && team2Obj && String(team1Obj.id) === '0' && String(team2Obj.id) === '0')) {
					errorMsg.textContent = 'Os times devem ser diferentes, exceto se ambos forem "id 0".';
					errorMsg.style.display = 'block';
					return;
				}
			}
			btnSave.disabled = true;
			btnSave.textContent = 'Salvando...';
			try {
				// Descobrir os ids dos times pelo nome
				const team1Obj = teams.find(t => t.name === newTeam1);
				const team2Obj = teams.find(t => t.name === newTeam2);
				if (!team1Obj || !team2Obj) throw new Error('Times inválidos');
				const res = await fetch(`${API_BASE_URL}/api/games`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						key: newKey,
						major_phase_id: game.major_phase_id,
						team_01_id: Number(team1Obj.id),
						team_02_id: Number(team2Obj.id)
					})
				});
				if (!res.ok) throw new Error((await res.json()).error || 'Erro ao salvar');
				overlay.remove();
				location.reload();
			} catch (err) {
				errorMsg.textContent = err.message || 'Erro ao salvar.';
				errorMsg.style.display = 'block';
				btnSave.disabled = false;
				btnSave.textContent = 'Salvar';
			}
		};
		btnRow.appendChild(btnCancel);
		btnRow.appendChild(btnSave);
		popup.appendChild(btnRow);
		overlay.appendChild(popup);
		document.body.appendChild(overlay);
	};
	// Animação fade-in igual ao padrão
	const table = container.querySelector('table.admin-games-table');
	if (table) {
		table.style.opacity = '0';
		table.style.animation = 'stageTabsFadeIn 0.8s cubic-bezier(.77,0,.18,1) 0s 1 normal forwards';
		setTimeout(() => { table.style.opacity = '1'; }, 800);
	}
}
