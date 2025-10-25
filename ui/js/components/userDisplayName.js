/**
 * Displays the authenticated user's display name in the interface.
 * Used in predictions and leaderboard pages to show the current user.
 */
export function showUserDisplayName(userId) {
  fetch('../data/players.json')
    .then(resp => resp.json())
    .then(players => {
      const player = players.find(p => p.id === userId);
      if (player) {
        const el = document.getElementById('userId');
        if (el) {
          el.textContent = player.display_name;
          el.style.display = 'block';
        }
      }
    });
}
