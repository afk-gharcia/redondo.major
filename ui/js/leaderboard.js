// Calculates tiebreaker: total number of correct 3-0 and 0-3 picks across all stages
function calculateTiebreaker(prediction, result) {
	let corrects = 0;
	// Stage 1
	if (Array.isArray(result.stage_01_30) && Array.isArray(prediction.stage_01_30)) {
		result.stage_01_30.forEach(item => {
			if (prediction.stage_01_30.includes(item)) corrects++;
		});
	}
	if (Array.isArray(result.stage_01_03) && Array.isArray(prediction.stage_01_03)) {
		result.stage_01_03.forEach(item => {
			if (prediction.stage_01_03.includes(item)) corrects++;
		});
	}
	// Stage 2
	if (Array.isArray(result.stage_02_30) && Array.isArray(prediction.stage_02_30)) {
		result.stage_02_30.forEach(item => {
			if (prediction.stage_02_30.includes(item)) corrects++;
		});
	}
	if (Array.isArray(result.stage_02_03) && Array.isArray(prediction.stage_02_03)) {
		result.stage_02_03.forEach(item => {
			if (prediction.stage_02_03.includes(item)) corrects++;
		});
	}
	// Stage 3
	if (Array.isArray(result.stage_03_30) && Array.isArray(prediction.stage_03_30)) {
		result.stage_03_30.forEach(item => {
			if (prediction.stage_03_30.includes(item)) corrects++;
		});
	}
	if (Array.isArray(result.stage_03_03) && Array.isArray(prediction.stage_03_03)) {
		result.stage_03_03.forEach(item => {
			if (prediction.stage_03_03.includes(item)) corrects++;
		});
	}
	return corrects;
}
// Calculates the participant's score by comparing prediction and results
function calculatePoints(prediction, results) {
	let points = 0;
	// Stage 1
	for (let i = 1; i <= 8; i++) {
		const key = `stage_01_game_0${i}`;
		if (results[key] !== undefined && prediction[key] === results[key]) points += 1;
	}
	if (Array.isArray(results.stage_01_classifieds) && Array.isArray(prediction.stage_01_classifieds)) {
		results.stage_01_classifieds.forEach(item => {
			if (prediction.stage_01_classifieds.includes(item)) points += 1;
		});
	}
	if (Array.isArray(results.stage_01_30) && Array.isArray(prediction.stage_01_30)) {
		results.stage_01_30.forEach(item => {
			if (prediction.stage_01_30.includes(item)) points += 2;
		});
	}
	if (Array.isArray(results.stage_01_03) && Array.isArray(prediction.stage_01_03)) {
		results.stage_01_03.forEach(item => {
			if (prediction.stage_01_03.includes(item)) points += 2;
		});
	}
	// Stage 2
	for (let i = 1; i <= 8; i++) {
		const key = `stage_02_game_0${i}`;
		if (results[key] !== undefined && prediction[key] === results[key]) points += 1;
	}
	if (Array.isArray(results.stage_02_classifieds) && Array.isArray(prediction.stage_02_classifieds)) {
		results.stage_02_classifieds.forEach(item => {
			if (prediction.stage_02_classifieds.includes(item)) points += 1;
		});
	}
	if (Array.isArray(results.stage_02_30) && Array.isArray(prediction.stage_02_30)) {
		results.stage_02_30.forEach(item => {
			if (prediction.stage_02_30.includes(item)) points += 2;
		});
	}
	if (Array.isArray(results.stage_02_03) && Array.isArray(prediction.stage_02_03)) {
		results.stage_02_03.forEach(item => {
			if (prediction.stage_02_03.includes(item)) points += 2;
		});
	}
	// Stage 3
	for (let i = 1; i <= 8; i++) {
		const key = `stage_03_game_0${i}`;
		if (results[key] !== undefined && prediction[key] === results[key]) points += 1;
	}
	if (Array.isArray(results.stage_03_classifieds) && Array.isArray(prediction.stage_03_classifieds)) {
		results.stage_03_classifieds.forEach(item => {
			if (prediction.stage_03_classifieds.includes(item)) points += 1;
		});
	}
	if (Array.isArray(results.stage_03_30) && Array.isArray(prediction.stage_03_30)) {
		results.stage_03_30.forEach(item => {
			if (prediction.stage_03_30.includes(item)) points += 2;
		});
	}
	if (Array.isArray(results.stage_03_03) && Array.isArray(prediction.stage_03_03)) {
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
	if (results.major_champion !== undefined && prediction.major_champion === results.major_champion) points += 5;
	return points;
}

// Calculates prizes for the top 3
function calculatePrizes(numPlayers) {
	const total = 50 * numPlayers;
	let first = Math.floor(total * 0.7);
	let second = Math.floor(total * 0.2);
	let third = Math.floor(total * 0.1);
	// Ajusta diferença para o terceiro
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

// Loads a local JSON file using fetch
async function loadJSON(path) {
	const response = await fetch(path);
	if (!response.ok) throw new Error(`Erro ao carregar ${path}`);
	return await response.json();
}

// Returns a breakdown of how the player earned each point
function getPlayerScoreBreakdown(prediction, result, teams, games) {
	const getTeamName = id => {
		const team = teams.find(t => t.id === id);
		return team ? team.name : `Team ${id}`;
	};
	const findGame = (stage, gameId) => {
		const arr = games[stage];
		if (!arr) return null;
		return arr.find(g => g.id === gameId) || null;
	};
	// Groups by stage
	const stages = {
		'01': [],
		'02': [],
		'03': [],
		'playoff': []
	};
	for (const key in result) {
		if (!Object.prototype.hasOwnProperty.call(prediction, key)) continue;
	// Stage 1
		if (/^stage_01_/.test(key)) {
			if (/^stage_01_game_\d{2}$/.test(key) && result[key] === prediction[key]) {
				const game = findGame('stage_01', key);
				if (game) {
					const home = getTeamName(game.home);
					const away = getTeamName(game.away);
					const winner = getTeamName(result[key]);
					let matchup = `${home} vs ${away}`;
					matchup = matchup.replace(winner, `<b style='color:#2ecc40;'>${winner}</b>`);
					stages['01'].push(`<b style='color:#ffb347;'>(+1)</b> ${matchup}`);
				} else {
					stages['01'].push(`<b style='color:#ffb347;'>(+1)</b> <b style='color:#2ecc40;'>${getTeamName(result[key])}</b>`);
				}
			}
			if (/^stage_01_classifieds$/.test(key) && Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				const acertados = result[key].filter(item => prediction[key].includes(item));
				if (acertados.length) {
					const nomes = acertados.map(t => `<b style='color:#2ecc40;'>${getTeamName(t)}</b>`).join(', ');
					stages['01'].push(`<b style='color:#ffb347;'>(+${acertados.length})</b> Next Stage Spots: ${nomes}`);
				}
			}
			// Grouping of 3-0 and 0-3 predictions
			let pontos_30 = 0, pontos_03 = 0;
			let times_30 = [], times_03 = [];
			if (/^stage_01_30$/.test(key) && Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				result[key].forEach(item => {
					if (prediction[key].includes(item)) {
						pontos_30 += 2;
						times_30.push(`<b style='color:#2ecc40;'>${getTeamName(item)}</b>`);
					}
				});
			}
			if (/^stage_01_03$/.test(key) && Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				result[key].forEach(item => {
					if (prediction[key].includes(item)) {
						pontos_03 += 2;
						times_03.push(`<b style='color:#2ecc40;'>${getTeamName(item)}</b>`);
					}
				});
			}
			if (times_30.length) {
				let nomes_30 = times_30.length === 1 ? times_30[0] : times_30.slice(0, -1).join(' ') + ' e ' + times_30.slice(-1);
				stages['01'].push(`<b style='color:#ffb347;'>(+${pontos_30})</b> 3-0: ${nomes_30}`);
			}
			if (times_03.length) {
				let nomes_03 = times_03.length === 1 ? times_03[0] : times_03.slice(0, -1).join(' ') + ' e ' + times_03.slice(-1);
				stages['01'].push(`<b style='color:#ffb347;'>(+${pontos_03})</b> 0-3: ${nomes_03}`);
			}
			continue;
		}
	// Stage 2
		if (/^stage_02_/.test(key)) {
			if (/^stage_02_game_\d{2}$/.test(key) && result[key] === prediction[key]) {
				const game = findGame('stage_02', key);
				if (game) {
					const home = getTeamName(game.home);
					const away = getTeamName(game.away);
					const winner = getTeamName(result[key]);
					let matchup = `${home} vs ${away}`;
					matchup = matchup.replace(winner, `<b style='color:#2ecc40;'>${winner}</b>`);
					stages['02'].push(`<b style='color:#ffb347;'>(+1)</b> ${matchup}`);
				} else {
					stages['02'].push(`<b style='color:#ffb347;'>(+1)</b> <b style='color:#2ecc40;'>${getTeamName(result[key])}</b>`);
				}
			}
			if (/^stage_02_classifieds$/.test(key) && Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				const acertados = result[key].filter(item => prediction[key].includes(item));
				if (acertados.length) {
					const nomes = acertados.map(t => `<b style='color:#2ecc40;'>${getTeamName(t)}</b>`).join(', ');
					stages['02'].push(`<b style='color:#ffb347;'>(+${acertados.length})</b> Next Stage Spots: ${nomes}`);
				}
			}
			let pontos_30_2 = 0, pontos_03_2 = 0;
			let times_30_2 = [], times_03_2 = [];
			if (/^stage_02_30$/.test(key) && Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				result[key].forEach(item => {
					if (prediction[key].includes(item)) {
						pontos_30_2 += 2;
						times_30_2.push(`<b style='color:#2ecc40;'>${getTeamName(item)}</b>`);
					}
				});
			}
			if (/^stage_02_03$/.test(key) && Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				result[key].forEach(item => {
					if (prediction[key].includes(item)) {
						pontos_03_2 += 2;
						times_03_2.push(`<b style='color:#2ecc40;'>${getTeamName(item)}</b>`);
					}
				});
			}
			if (times_30_2.length) {
				let nomes_30_2 = times_30_2.length === 1 ? times_30_2[0] : times_30_2.slice(0, -1).join(' ') + ' e ' + times_30_2.slice(-1);
				stages['02'].push(`<b style='color:#ffb347;'>(+${pontos_30_2})</b> 3-0: ${nomes_30_2}`);
			}
			if (times_03_2.length) {
				let nomes_03_2 = times_03_2.length === 1 ? times_03_2[0] : times_03_2.slice(0, -1).join(' ') + ' e ' + times_03_2.slice(-1);
				stages['02'].push(`<b style='color:#ffb347;'>(+${pontos_03_2})</b> 0-3: ${nomes_03_2}`);
			}
			continue;
		}
	// Stage 3
		if (/^stage_03_/.test(key)) {
			if (/^stage_03_game_\d{2}$/.test(key) && result[key] === prediction[key]) {
				const game = findGame('stage_03', key);
				if (game) {
					const home = getTeamName(game.home);
					const away = getTeamName(game.away);
					const winner = getTeamName(result[key]);
					let matchup = `${home} vs ${away}`;
					matchup = matchup.replace(winner, `<b style='color:#2ecc40;'>${winner}</b>`);
					stages['03'].push(`<b style='color:#ffb347;'>(+1)</b> ${matchup}`);
				} else {
					stages['03'].push(`<b style='color:#ffb347;'>(+1)</b> <b style='color:#2ecc40;'>${getTeamName(result[key])}</b>`);
				}
			}
			if (/^stage_03_classifieds$/.test(key) && Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				const acertados = result[key].filter(item => prediction[key].includes(item));
				if (acertados.length) {
					const nomes = acertados.map(t => `<b style='color:#2ecc40;'>${getTeamName(t)}</b>`).join(', ');
					stages['03'].push(`<b style='color:#ffb347;'>(+${acertados.length})</b> Next Stage Spots: ${nomes}`);
				}
			}
			let pontos_30_3 = 0, pontos_03_3 = 0;
			let times_30_3 = [], times_03_3 = [];
			if (/^stage_03_30$/.test(key) && Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				result[key].forEach(item => {
					if (prediction[key].includes(item)) {
						pontos_30_3 += 2;
						times_30_3.push(`<b style='color:#2ecc40;'>${getTeamName(item)}</b>`);
					}
				});
			}
			if (/^stage_03_03$/.test(key) && Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				result[key].forEach(item => {
					if (prediction[key].includes(item)) {
						pontos_03_3 += 2;
						times_03_3.push(`<b style='color:#2ecc40;'>${getTeamName(item)}</b>`);
					}
				});
			}
			if (times_30_3.length) {
				let nomes_30_3 = times_30_3.length === 1 ? times_30_3[0] : times_30_3.slice(0, -1).join(' ') + ' e ' + times_30_3.slice(-1);
				stages['03'].push(`<b style='color:#ffb347;'>(+${pontos_30_3})</b> 3-0: ${nomes_30_3}`);
			}
			if (times_03_3.length) {
				let nomes_03_3 = times_03_3.length === 1 ? times_03_3[0] : times_03_3.slice(0, -1).join(' ') + ' e ' + times_03_3.slice(-1);
				stages['03'].push(`<b style='color:#ffb347;'>(+${pontos_03_3})</b> 0-3: ${nomes_03_3}`);
			}
			continue;
		}
	// Playoffs
		if (/^playoff_game_\d{2}$/.test(key)) {
			if (Array.isArray(result[key]) && Array.isArray(prediction[key])) {
				const game = findGame('playoff', key);
				const home = game ? getTeamName(game.home) : '';
				const away = game ? getTeamName(game.away) : '';
				const winner = getTeamName(result[key][0]);
				let scoreHome = '', scoreAway = '';
				if (typeof result[key][1] === 'string') {
					[scoreHome, scoreAway] = result[key][1].split('-');
				}
				let acertouVencedor = result[key][0] === prediction[key][0];
				let acertouPlacar = acertouVencedor && result[key][1] === prediction[key][1];
				let pontos = (acertouVencedor ? 1 : 0) + (acertouPlacar ? 2 : 0);
				let linha;
				if (acertouVencedor && acertouPlacar) {
					// Apenas o texto em verde, mostra somatória
					linha = `<b style='color:#ffb347;'>(+${pontos})</b> <span style='color:#2ecc40;font-weight:bold;'>${home} ${scoreHome}-${scoreAway} ${away}</span>`;
				} else if (acertouVencedor) {
					// Só o vencedor em verde
					let homeText = home === winner ? `<b style='color:#2ecc40;'>${home}</b>` : home;
					let awayText = away === winner ? `<b style='color:#2ecc40;'>${away}</b>` : away;
					linha = `<b style='color:#ffb347;'>(+${pontos})</b> ${homeText} ${scoreHome}-${scoreAway} ${awayText}`;
				}
				if (pontos > 0) stages['playoff'].push(linha);
			}
			continue;
		}
	// Champion
		if (key === 'major_champion') {
			if (result[key] === prediction[key]) stages['playoff'].push(`<b style='color:#ffb347;'>(+5)</b> <span style='color:#2ecc40;font-weight:bold;'>Major Champion: ${getTeamName(result[key])}</span>`);
			continue;
		}
	}
	// Builds the breakdown grouped by stage
	const breakdown = [];
	if (stages['01'].length)
		breakdown.push(
			`<hr style='border:none;border-top:1.5px solid #444;margin:12px 0 6px 0;'>` +
			`<div style='font-weight:bold;margin-bottom:4px;'>🟦 Stage 1</div>` +
			`<hr style='border:none;border-top:1.5px solid #444;margin:6px 0 12px 0;'>`,
			...stages['01']
		);
	if (stages['02'].length)
		breakdown.push(
			`<hr style='border:none;border-top:1.5px solid #444;margin:12px 0 6px 0;'>` +
			`<div style='font-weight:bold;margin-bottom:4px;'>🟩 Stage 2</div>` +
			`<hr style='border:none;border-top:1.5px solid #444;margin:6px 0 12px 0;'>`,
			...stages['02']
		);
	if (stages['03'].length)
		breakdown.push(
			`<hr style='border:none;border-top:1.5px solid #444;margin:12px 0 6px 0;'>` +
			`<div style='font-weight:bold;margin-bottom:4px;'>🟪 Stage 3</div>` +
			`<hr style='border:none;border-top:1.5px solid #444;margin:6px 0 12px 0;'>`,
			...stages['03']
		);
	if (stages['playoff'].length)
		breakdown.push(
			`<hr style='border:none;border-top:1.5px solid #444;margin:12px 0 6px 0;'>` +
			`<div style='font-weight:bold;margin-bottom:4px;'>🏆 Playoffs</div>` +
			`<hr style='border:none;border-top:1.5px solid #444;margin:6px 0 12px 0;'>`,
			...stages['playoff']
		);
	return breakdown;
}