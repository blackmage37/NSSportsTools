/**
 * Determines a schedule incorporating inter-conference/inter-division fixtures.
 *
 * @param {Array<Array<string>>} entrants A range of data with columns for Conference/Division, and Entrant.
 * @param {number} sameDivisionRounds (Optional) Rounds robin against own division. Default 2.
 * @param {number} otherDivisionRounds (Optional) Rounds robin against other divisions. Default 1.
 * @return {Array<Array<string>>} An array of fixtures, interleaved and formatted for the sheet.
 * @customfunction
 */
function interDivisionSchedule(entrants, sameDivisionRounds, otherDivisionRounds) {
  const rrOwn = sameDivisionRounds === undefined ? 2 : sameDivisionRounds;
  const rrOther = otherDivisionRounds === undefined ? 1 : otherDivisionRounds;

  // throw error if entrants data is invalid/empty  
  if (!entrants || !Array.isArray(entrants) || entrants.length === 0) {
    return [["Error: Invalid or empty entrant data."]];
  }

  // check for divisions and split teams into separate arrays
  const entrantsByDivision = splitEntrants(entrants); 
  const divNames = Object.keys(entrantsByDivision);
  
  if (divNames.length === 0) return [["Error: No divisions found."]];
  
  // get division size from split; if uneven, take max size
  const divisionSize = Math.max(...divNames.map(d => entrantsByDivision[d].length));

  // generate raw fixtures (all fixtures we need for this season)
  const allFixtures = generateRawSchedule(entrantsByDivision, divNames, rrOwn, rrOther);

  // organise fixtures into buckets based on matchday type - this will allow shuffling later
  const fixtureBuckets = createFixtureBuckets(allFixtures);

  // create a season roadmap (i.e. MD1 is IntraDivision, MD2 is Div A vs Div B, Div C vs Div D, etc)
  const seasonRoadmap = generateSeasonRoadmap(divNames, divisionSize, rrOwn, rrOther);

  // create output array using the roadmap
  const outputRows = [];
  outputRows.push(['Round', 'Home', 'Away', 'HomeDiv', 'AwayDiv']); // Header

  seasonRoadmap.forEach((dayCard, dayIndex) => {
    dayCard.pairings.forEach(pair => {
      const key = getMatchKey(pair[0], pair[1]);
      const specificMatches = fixtureBuckets[key] ? fixtureBuckets[key][dayCard.roundIndex] : null;

      if (specificMatches && specificMatches.length > 0) {
        specificMatches.forEach(fixture => {
          outputRows.push([
            dayIndex + 1, // matchday
            fixture[1],   // home team
            fixture[2],   // away team
            fixture[3],   // home team div
            fixture[4]    // away team div
          ]);
        });
      }
    });
  });

  return outputRows;
}

/**
 * Determines a schedule incorporating inter-conference/inter-division fixtures.
 *
 * @param {Array<Array<string>>} entrantsByDivision An array of arrays containing entrant information, split by division
 * @param {Array<string>} divNames The names of the divisions
 * @param {number} rrOwn Rounds robin against own division
 * @param {number} rrOther Rounds robin against other divisions
 * @return {Array<Array<string>>} An array of fixtures
 * @customfunction
 */
function generateRawSchedule(entrantsByDivision, divNames, rrOwn, rrOther) {
  let allFixtures = [];

  // INTRA-DIVISION
  divNames.forEach(div => {
    const teams = entrantsByDivision[div];
    const intraBatch = generateIntraFixtures(teams, div, rrOwn);
    allFixtures = allFixtures.concat(intraBatch);
  });

  // INTER-DIVISION
  const divisionPairs = getUniqueDivisionPairs(divNames);
  divisionPairs.forEach(pair => {
    const divA = pair[0];
    const divB = pair[1];
    const teamsA = entrantsByDivision[divA];
    const teamsB = entrantsByDivision[divB];
    const interBatch = generateInterFixtures(teamsA, teamsB, divA, divB, rrOther);
    allFixtures = allFixtures.concat(interBatch);
  });

  return allFixtures;
}

/**
 * Generates Round Robin fixtures using standard balanced circle method.
 * Guarantees minimal Home/Away discrepancy per cycle (e.g. 2H/1A).
 */
function generateIntraFixtures(teams, divName, rounds) {
  const fixtures = [];
  const workingTeams = (teams.length % 2 === 0) ? [...teams] : [...teams, null];
  const n = workingTeams.length;
  const roundsPerCycle = n - 1;
  const gamesPerRound = n / 2;

  for (let cycle = 0; cycle < rounds; cycle++) {
    let cycleTeams = [...workingTeams]; 
    
    for (let r = 0; r < roundsPerCycle; r++) {
      const roundNum = (cycle * roundsPerCycle) + (r + 1);

      for (let i = 0; i < gamesPerRound; i++) {
        const t1Raw = cycleTeams[i];
        const t2Raw = cycleTeams[n - 1 - i];
        const t1 = Array.isArray(t1Raw) ? t1Raw[1] : t1Raw;
        const t2 = Array.isArray(t2Raw) ? t2Raw[1] : t2Raw;

        if (t1 && t2) {
          let home, away;
          if (i === 0) {
            if ((r + cycle) % 2 === 0) {
              home = t1; away = t2;
            } else {
              home = t2; away = t1;
            }
          } else {
            if (cycle % 2 === 0) {
              home = t1; away = t2; 
            } else {
              home = t2; away = t1;
            }
          }
          fixtures.push([roundNum, home, away, divName, divName]);
        }
      }
      // rotate teams and continue
      cycleTeams.splice(1, 0, cycleTeams.pop());
    }
  }
  return fixtures;
}

/**
 * Generates Inter-division fixtures alternating Home/Away strictly by Round.
 * Guarantees exact 50/50 split (e.g. 2 Home, 2 Away).
 */
function generateInterFixtures(div1Teams, div2Teams, div1Name, div2Name, rounds) {
  const fixtures = [];
  const n = Math.max(div1Teams.length, div2Teams.length);

  for (let cycle = 0; cycle < rounds; cycle++) {
    for (let r = 0; r < n; r++) {
      const roundNum = (cycle * n) + (r + 1);

      for (let i = 0; i < n; i++) {
        const t1Raw = div1Teams[i % div1Teams.length];
        const t2Raw = div2Teams[(i + r) % div2Teams.length]; // cyclic opponent

        const t1 = Array.isArray(t1Raw) ? t1Raw[1] : t1Raw;
        const t2 = Array.isArray(t2Raw) ? t2Raw[1] : t2Raw;

        if (t1 && t2) {
          let home, away, hDiv, aDiv;
          
          // alternate division home status based on round number
          // 'cycle' flips the start point for fairness in multi-round setups
          if ((r + cycle) % 2 === 0) {
            home = t1; hDiv = div1Name;
            away = t2; aDiv = div2Name;
          } else {
            home = t2; hDiv = div2Name;
            away = t1; aDiv = div1Name;
          }
          fixtures.push([roundNum, home, away, hDiv, aDiv]);
        }
      }
    }
  }
  return fixtures;
}

/**
 * Split fixtures into "buckets" based on type. Allows them to be shuffled later.
 */
function createFixtureBuckets(allFixtures) {
  const queues = {};
  allFixtures.forEach(f => {
    const key = getMatchKey(f[3], f[4]);
    if (!queues[key]) queues[key] = [];
    const idx = f[0] - 1;
    if (!queues[key][idx]) queues[key][idx] = [];
    queues[key][idx].push(f);
  });
  return queues;
}

/**
 * Generates a "deck" of cards representing the different matchday types
 * This can then be shuffled to allow for an interleaved fixture list
 */
function generateSeasonRoadmap(divisions, teamsPerDiv, intraFreq, interFreq) {
  const seasonDeck = [];
  const intraLen = (teamsPerDiv % 2 === 0) ? (teamsPerDiv - 1) : teamsPerDiv;
  const intraConfig = divisions.map(d => [d, d]);

  for (let cycle = 0; cycle < intraFreq; cycle++) {
    for (let r = 0; r < intraLen; r++) {
      seasonDeck.push({
        type: 'INTRA',
        roundIndex: (cycle * intraLen) + r, 
        pairings: intraConfig
      });
    }
  }

  const interConfigs = generateAllPairingCombinations(divisions);
  const interLen = teamsPerDiv;

  interConfigs.forEach(config => {
    for (let cycle = 0; cycle < interFreq; cycle++) {
      for (let r = 0; r < interLen; r++) {
        seasonDeck.push({
          type: 'INTER',
          roundIndex: (cycle * interLen) + r,
          pairings: config
        });
      }
    }
  });

  shuffleArray(seasonDeck);
  return seasonDeck;
}

/**
 * Generate the unique different pairings of divisions
 */
function generateAllPairingCombinations(divisions) {
  const results = [];
  const pool = [...divisions];
  if (pool.length % 2 !== 0) pool.push("Bye");

  function backtrack(currentPool, currentGrouping) {
    if (currentPool.length === 0) {
      results.push(currentGrouping);
      return;
    }
    const first = currentPool[0];
    for (let i = 1; i < currentPool.length; i++) {
      const partner = currentPool[i];
      const pair = [first, partner].sort();
      const remaining = [...currentPool.slice(1, i), ...currentPool.slice(i + 1)];
      backtrack(remaining, [...currentGrouping, pair]);
    }
  }
  backtrack(pool, []);
  return results;
}