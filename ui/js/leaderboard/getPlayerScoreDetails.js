// =========================
// getPlayerScoreDetails
// =========================
/**
 * Returns a breakdown of how the player earned their points.
 * @param {object} prediction - Player's predictions
 * @param {object} results - Official results
 * @param {Array} teams - List of all teams
 * @param {object} games - Games by stage
 * @returns {Array} Array of strings describing each point earned
 */
export function getPlayerScoreDetails(prediction, results, teams, games) {
    if (!prediction || !results) return [];
    const getTeamName = (id) => {
        const t = teams.find(tm => tm.id === id);
        return t ? t.name : `Team ${id}`;
    };
    const details = [];

    // Stage 01
    const stage01 = [];
    for (let i = 1; i <= 8; i++) {
        const key = `stage_01_game_0${i}`;
        if (results[key] !== undefined && prediction[key] === results[key]) {
            const winnerId = results[key];
            stage01.push(`(+1) ${getTeamName(winnerId)} venceu.`);
        }
    }
    if (Array.isArray(results.stage_01_classifieds) && Array.isArray(prediction.stage_01_classifieds)) {
        results.stage_01_classifieds.forEach(item => {
            if (prediction.stage_01_classifieds.includes(item)) stage01.push(`(+1) ${getTeamName(item)} classificado.`);
        });
    }
    if (Array.isArray(results.stage_01_30) && Array.isArray(prediction.stage_01_30)) {
        results.stage_01_30.forEach(item => {
            if (prediction.stage_01_30.includes(item)) stage01.push(`(+2) Acertou 3-0: ${getTeamName(item)}`);
        });
    }
    if (Array.isArray(results.stage_01_03) && Array.isArray(prediction.stage_01_03)) {
        results.stage_01_03.forEach(item => {
            if (prediction.stage_01_03.includes(item)) stage01.push(`(+2) Acertou 0-3: ${getTeamName(item)}`);
        });
    }
    if (stage01.length) details.push({ title: 'Stage 01', items: stage01 });

    // Stage 02
    const stage02 = [];
    for (let i = 1; i <= 8; i++) {
        const key = `stage_02_game_0${i}`;
        if (results[key] !== undefined && prediction[key] === results[key]) {
            const winnerId = results[key];
            stage02.push(`(+1) ${getTeamName(winnerId)} venceu.`);
        }
    }
    if (Array.isArray(results.stage_02_classifieds) && Array.isArray(prediction.stage_02_classifieds)) {
        results.stage_02_classifieds.forEach(item => {
            if (prediction.stage_02_classifieds.includes(item)) stage02.push(`(+1) ${getTeamName(item)} classificado.`);
        });
    }
    if (Array.isArray(results.stage_02_30) && Array.isArray(prediction.stage_02_30)) {
        results.stage_02_30.forEach(item => {
            if (prediction.stage_02_30.includes(item)) stage02.push(`(+2) Acertou 3-0: ${getTeamName(item)}`);
        });
    }
    if (Array.isArray(results.stage_02_03) && Array.isArray(prediction.stage_02_03)) {
        results.stage_02_03.forEach(item => {
            if (prediction.stage_02_03.includes(item)) stage02.push(`(+2) Acertou 0-3: ${getTeamName(item)}`);
        });
    }
    if (stage02.length) details.push({ title: 'Stage 02', items: stage02 });

    // Stage 03
    const stage03 = [];
    for (let i = 1; i <= 8; i++) {
        const key = `stage_03_game_0${i}`;
        if (results[key] !== undefined && prediction[key] === results[key]) {
            const winnerId = results[key];
            stage03.push(`(+1) ${getTeamName(winnerId)} venceu.`);
        }
    }
    if (Array.isArray(results.stage_03_classifieds) && Array.isArray(prediction.stage_03_classifieds)) {
        results.stage_03_classifieds.forEach(item => {
            if (prediction.stage_03_classifieds.includes(item)) stage03.push(`(+1) ${getTeamName(item)} classificado.`);
        });
    }
    if (Array.isArray(results.stage_03_30) && Array.isArray(prediction.stage_03_30)) {
        results.stage_03_30.forEach(item => {
            if (prediction.stage_03_30.includes(item)) stage03.push(`(+2) Acertou 3-0: ${getTeamName(item)}`);
        });
    }
    if (Array.isArray(results.stage_03_03) && Array.isArray(prediction.stage_03_03)) {
        results.stage_03_03.forEach(item => {
            if (prediction.stage_03_03.includes(item)) stage03.push(`(+2) Acertou 0-3: ${getTeamName(item)}`);
        });
    }
    if (stage03.length) details.push({ title: 'Stage 03', items: stage03 });

    // Playoffs
    const playoffs = [];
    for (let i = 1; i <= 4; i++) {
        const key = `playoff_game_0${i}`;
        if (Array.isArray(results[key]) && Array.isArray(prediction[key])) {
            if (results[key][0] === prediction[key][0]) {
                const winnerId = results[key][0];
                playoffs.push(`(+1) ${getTeamName(winnerId)} venceu.`);
                if (results[key][1] === prediction[key][1]) {
                    playoffs.push(`(+2) Acertou o placar do playoff ${i}`);
                }
            }
        }
    }
    if (playoffs.length) details.push({ title: 'Playoffs', items: playoffs });

    // Campeão
    const champion = [];
    if (results.major_champion !== undefined && prediction.major_champion === results.major_champion) {
        champion.push(`(+5) Acertou o campeão: ${getTeamName(results.major_champion)}`);
    }
    if (champion.length) details.push({ title: 'Campeão', items: champion });

    return details;
}
