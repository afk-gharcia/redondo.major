// =========================
// calculatePoints
// =========================
/**
 * Calculates the participant's total score based on their predictions and the official Major results.
 * @param {object} prediction - Participant's predictions
 * @param {object} results - Official Major results
 * @returns {number} Total score
 */
export function calculatePoints(prediction, results) {
    let points = 0;
    // Stage 01
    for (let i = 1; i <= 8; i++) {
        const key = `stage_01_game_0${i}`;
        if (results && results[key] !== undefined && prediction && prediction[key] === results[key]) points += 1;
    }
    if (Array.isArray(results?.stage_01_classifieds) && Array.isArray(prediction?.stage_01_classifieds)) {
        results.stage_01_classifieds.forEach(item => {
            if (prediction.stage_01_classifieds.includes(item)) points += 1;
        });
    }
    if (Array.isArray(results?.stage_01_30) && Array.isArray(prediction?.stage_01_30)) {
        results.stage_01_30.forEach(item => {
            if (prediction.stage_01_30.includes(item)) points += 2;
        });
    }
    if (Array.isArray(results?.stage_01_03) && Array.isArray(prediction?.stage_01_03)) {
        results.stage_01_03.forEach(item => {
            if (prediction.stage_01_03.includes(item)) points += 2;
        });
    }
    // Stage 02
    for (let i = 1; i <= 8; i++) {
        const key = `stage_02_game_0${i}`;
        if (results && results[key] !== undefined && prediction && prediction[key] === results[key]) points += 1;
    }
    if (Array.isArray(results?.stage_02_classifieds) && Array.isArray(prediction?.stage_02_classifieds)) {
        results.stage_02_classifieds.forEach(item => {
            if (prediction.stage_02_classifieds.includes(item)) points += 1;
        });
    }
    if (Array.isArray(results?.stage_02_30) && Array.isArray(prediction?.stage_02_30)) {
        results.stage_02_30.forEach(item => {
            if (prediction.stage_02_30.includes(item)) points += 2;
        });
    }
    if (Array.isArray(results?.stage_02_03) && Array.isArray(prediction?.stage_02_03)) {
        results.stage_02_03.forEach(item => {
            if (prediction.stage_02_03.includes(item)) points += 2;
        });
    }
    // Stage 03
    for (let i = 1; i <= 8; i++) {
        const key = `stage_03_game_0${i}`;
        if (results && results[key] !== undefined && prediction && prediction[key] === results[key]) points += 1;
    }
    if (Array.isArray(results?.stage_03_classifieds) && Array.isArray(prediction?.stage_03_classifieds)) {
        results.stage_03_classifieds.forEach(item => {
            if (prediction.stage_03_classifieds.includes(item)) points += 1;
        });
    }
    if (Array.isArray(results?.stage_03_30) && Array.isArray(prediction?.stage_03_30)) {
        results.stage_03_30.forEach(item => {
            if (prediction.stage_03_30.includes(item)) points += 2;
        });
    }
    if (Array.isArray(results?.stage_03_03) && Array.isArray(prediction?.stage_03_03)) {
        results.stage_03_03.forEach(item => {
            if (prediction.stage_03_03.includes(item)) points += 2;
        });
    }
    // Playoffs
    for (let i = 1; i <= 4; i++) {
        const key = `playoff_game_0${i}`;
        if (Array.isArray(results[key]) && Array.isArray(prediction[key])) {
            if (results[key][0] === prediction[key][0]) {
                points += 1;
                if (results[key][1] === prediction[key][1]) points += 2;
            }
        }
    }
    if (results && results.major_champion !== undefined && prediction && prediction.major_champion === results.major_champion) points += 5;
    return points;
}
