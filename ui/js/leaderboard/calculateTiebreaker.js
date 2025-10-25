// =========================
// calculateTiebreaker
// =========================
/**
 * Calculates the participant's tiebreaker value.
 * Example: sum of the IDs of the correctly predicted classified teams in the last stage.
 * @param {object} prediction - Participant's predictions
 * @param {object} results - Official Major results
 * @returns {number} Tiebreaker value
 */
export function calculateTiebreaker(prediction, results) {
    if (!prediction || !results) return 0;
    let tiebreaker = 0;
    if (Array.isArray(results.stage_03_classifieds) && Array.isArray(prediction.stage_03_classifieds)) {
        results.stage_03_classifieds.forEach(item => {
            if (prediction.stage_03_classifieds.includes(item)) tiebreaker += item;
        });
    }
    return tiebreaker;
}
