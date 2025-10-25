// =========================
// calculatePrizes
// =========================
/**
 * Calculates the prize distribution for the leaderboard.
 * @param {number} numPlayers - Number of participants
 * @returns {object} Object with first, second, and third prize values
 */
export function calculatePrizes(numPlayers) {
    const total = 50 * numPlayers;
    let first = Math.floor(total * 0.7);
    let second = Math.floor(total * 0.2);
    let third = Math.floor(total * 0.1);
    const sum = first + second + third;
    if (sum < total) {
        third += (total - sum);
    }
    return {
        first: `R$ ${first}`,
        second: `R$ ${second}`,
        third: `R$ ${third}`
    };
}
