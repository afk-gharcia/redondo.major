
/**
 * @file Player tab component for frontend.
 * @author afk-gharcia
 * @description Renders and manages the player tab, including edit and logout actions.
 */

export function showPlayerTab(name, { onLogout, onEdit } = {}) {
	const playerTab = document.getElementById('player-tab');
	if (!name) {
		playerTab.classList.remove('show');
		setTimeout(() => {
			playerTab.innerHTML = '';
		}, 400);
		return;
	}
	playerTab.innerHTML = `
		<div class="player-tab-content">
			<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
			<span id="playerDisplayName" class="player-display-name"></span>
			<span class="player-tab-btns">
				<button id="editPlayerBtn" title="Editar" class="player-btn player-btn-edit" aria-label="Editar nome do jogador"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button>
				<button id="logoutBtn" title="Sair" class="player-btn player-btn-logout" aria-label="Sair"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
			</span>
		</div>
	`;
	document.getElementById('playerDisplayName').textContent = name;
	setTimeout(() => {
		playerTab.classList.add('show');
	}, 10);
	document.getElementById('logoutBtn').onclick = () => {
		if (typeof onLogout === 'function') {
			onLogout();
		} else {
			localStorage.removeItem('userId');
			localStorage.removeItem('display_name');
			window.location.reload();
		}
	};
	document.getElementById('editPlayerBtn').onclick = async () => {
		if (typeof onEdit === 'function') {
			onEdit();
		} else {
			
			const mod = await import('./playerEditPopup.js');
			const playerId = localStorage.getItem('userId');
			const currentName = localStorage.getItem('display_name') || '';
			mod.showPlayerEditPopup({
				currentName,
				playerId,
				onSuccess: (newName) => {
					localStorage.setItem('display_name', newName);
					showPlayerTab(newName);
				}
			});
		}
	};
}
