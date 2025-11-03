// Renderiza o conteúdo de cada seção fixa do admin
// Por enquanto: Players = tabela de Token, slug_name, display_name

/**
 * Renderiza a tabela de players na área #admin-players-list
 * @param {Array} players - Array de objetos player vindos do backend
 */
export function renderAdminPlayersTable(players) {
	const container = document.getElementById('admin-players-list');
	if (!container) return;
	if (!players || !players.length) {
		container.innerHTML = '<div style="color:#ffd700;opacity:0.7;">Nenhum player encontrado</div>';
		return;
	}
	let html = `<table class="admin-players-table" style="width:100%;max-width:600px;margin:0 auto;background:#181818;border-radius:12px;box-shadow:0 2px 16px #0007;overflow:hidden;">
		<thead>
			<tr style="background:#222;color:#ffd700;font-weight:bold;">
				<th style="padding:10px 8px;">token</th>
				<th style="padding:10px 8px;">slug_name</th>
				<th style="padding:10px 8px;">display_name</th>
			</tr>
		</thead>
		<tbody>`;
	players.forEach((player, idx) => {
		const tokenId = `token-cell-${idx}`;
		const eyeId = `eye-btn-${idx}`;
		html += `<tr>
			<td style="padding:8px 6px;font-family:monospace;font-size:1.08em;">
				<span id="${tokenId}">***</span>
				<button id="${eyeId}" title="Mostrar/Esconder token" style="background:none;border:none;cursor:pointer;padding:0 4px;vertical-align:middle;">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
				</button>
			</td>
			<td style="padding:8px 6px;">${player.slug_name || ''}</td>
			<td style="padding:8px 6px;">${player.display_name || ''}</td>
		</tr>`;
	});
	html += '</tbody></table>';
	html += '<div style="text-align:center;margin-top:18px;"><button id="admin-new-player-btn" style="background:#ffd700;color:#23272b;font-weight:bold;font-size:1.08em;padding:10px 28px;border-radius:10px;border:none;cursor:pointer;box-shadow:0 2px 8px #0003;transition:background 0.2s;">+ New Player</button></div>';
	container.innerHTML = html;
	// Adiciona animação de fade-in igual ao content
	const table = container.querySelector('table.admin-players-table');
	if (table) {
		table.style.opacity = '0';
		table.style.animation = 'stageTabsFadeIn 0.8s cubic-bezier(.77,0,.18,1) 0s 1 normal forwards';
		setTimeout(() => { table.style.opacity = '1'; }, 800);
	}
	const newPlayerBtn = document.getElementById('admin-new-player-btn');
	if (newPlayerBtn) {
		newPlayerBtn.style.opacity = '0';
		newPlayerBtn.style.animation = 'stageTabsFadeIn 0.8s cubic-bezier(.77,0,.18,1) 0.1s 1 normal forwards';
		setTimeout(() => { newPlayerBtn.style.opacity = '1'; }, 900);
	}
	// Adiciona funcionalidade de mostrar/esconder token
	players.forEach((player, idx) => {
		const tokenId = `token-cell-${idx}`;
		const eyeId = `eye-btn-${idx}`;
		const tokenSpan = document.getElementById(tokenId);
		const eyeBtn = document.getElementById(eyeId);
		let visible = false;
		if (tokenSpan && eyeBtn) {
			eyeBtn.onclick = () => {
				visible = !visible;
				tokenSpan.textContent = visible ? (player.token || '') : '***';
				eyeBtn.querySelector('svg').style.opacity = visible ? '0.5' : '1';
			};
		}
	});
}
