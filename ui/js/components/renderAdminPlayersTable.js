
import { API_BASE_URL } from '../config.js';

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
				<th style="padding:10px 8px;"></th>
			</tr>
		</thead>
		<tbody>`;
	players.forEach((player, idx) => {
		const tokenId = `token-cell-${idx}`;
		const eyeId = `eye-btn-${idx}`;
		const delId = `del-btn-${idx}`;
		html += `<tr>
			<td style="padding:8px 6px;font-family:monospace;font-size:1.08em;">
				<span id="${tokenId}">***</span>
				<button id="${eyeId}" title="Mostrar/Esconder token" style="background:none;border:none;cursor:pointer;padding:0 4px;vertical-align:middle;">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
				</button>
			</td>
			<td style="padding:8px 6px;">${player.slug_name || ''}</td>
			<td style="padding:8px 6px;">${player.display_name || ''}</td>
			<td style="padding:8px 6px;text-align:center;vertical-align:middle;">
				<button id="${delId}" title="Excluir player" aria-label="Excluir player" style="background:none;border:none;cursor:pointer;padding:0 4px;vertical-align:middle;position:relative;outline:none;transition:box-shadow 0.2s;">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="transition:stroke 0.2s;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
					<span class="del-progress" style="position:absolute;left:0;top:0;width:0;height:100%;background:#d32f2f33;z-index:1;transition:width 0.3s;"></span>
				</button>
				<style>
				.admin-players-table button[id^='del-btn-']:hover svg {
					stroke: #fff;
					background: #d32f2f;
					border-radius: 50%;
					box-shadow: 0 2px 8px #d32f2f55;
				}
				.admin-players-table button[id^='del-btn-']:focus {
					outline: 2px solid #ffd700;
					box-shadow: 0 0 0 2px #ffd70055;
				}
				.admin-players-table button[id^='del-btn-'] svg {
					transition: stroke 0.2s, background 0.2s;
				}
				</style>
			</td>
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
		newPlayerBtn.onclick = () => {
			// Popup estilo showPlayerEditPopup, mas sem título e com placeholder customizado
			import('./playerEditPopup.js').then(({ showPlayerEditPopup }) => {
				showPlayerEditPopup({
					currentName: '',
					playerId: null,
					onSuccess: async (newName) => {
						try {
							const res = await fetch(`${API_BASE_URL}/api/players`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ display_name: newName })
							});
							if (!res.ok) throw new Error((await res.json()).error || 'Erro ao criar player');
							location.reload();
						} catch (err) {
							alert('Erro ao criar player: ' + (err.message || 'Erro desconhecido'));
						}
					},
					popupCustomize: (popup, input) => {
						// Remove o título se existir
						const h2 = popup.querySelector('h2');
						if (h2) h2.remove();
						input.placeholder = 'new player';
					}
				});
			});
		};
	}
	// Adiciona funcionalidade de mostrar/esconder token e deletar player
	players.forEach((player, idx) => {
		const tokenId = `token-cell-${idx}`;
		const eyeId = `eye-btn-${idx}`;
		const delId = `del-btn-${idx}`;
		const tokenSpan = document.getElementById(tokenId);
		const eyeBtn = document.getElementById(eyeId);
		const delBtn = document.getElementById(delId);
		let visible = false;
		if (tokenSpan && eyeBtn) {
			eyeBtn.onclick = () => {
				visible = !visible;
				tokenSpan.textContent = visible ? (player.token || '') : '***';
				eyeBtn.querySelector('svg').style.opacity = visible ? '0.5' : '1';
			};
		}
		if (delBtn) {
			delBtn.onclick = () => {
				// Popup de confirmação
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
				const msg = document.createElement('div');
				msg.textContent = `Deseja realmente deletar o player "${player.display_name}"?`;
				msg.style.color = '#ffd700';
				msg.style.fontWeight = 'bold';
				msg.style.marginBottom = '18px';
				msg.style.textAlign = 'center';
				popup.appendChild(msg);
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
				const btnDelete = document.createElement('button');
				btnDelete.textContent = 'Deletar';
				btnDelete.style.background = '#d32f2f';
				btnDelete.style.color = '#fff';
				btnDelete.style.border = 'none';
				btnDelete.style.borderRadius = '8px';
				btnDelete.style.padding = '8px 18px';
				btnDelete.style.fontWeight = 'bold';
				btnDelete.onclick = async () => {
					btnDelete.disabled = true;
					btnDelete.textContent = 'Deletando...';
					try {
						await fetch(`${API_BASE_URL}/api/players`, {
							method: 'DELETE',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ id: player.id })
						});
						delBtn.closest('tr').remove();
						overlay.remove();
					} catch (err) {
						alert('Erro ao deletar player: ' + (err.message || 'Erro desconhecido'));
						btnDelete.disabled = false;
						btnDelete.textContent = 'Deletar';
					}
				};
				btnRow.appendChild(btnCancel);
				btnRow.appendChild(btnDelete);
				popup.appendChild(btnRow);
				overlay.appendChild(popup);
				document.body.appendChild(overlay);
				overlay.tabIndex = -1;
				overlay.focus();
				overlay.onkeydown = (e) => {
					if (e.key === 'Escape') overlay.remove();
				};
			};
		}
	});
}

