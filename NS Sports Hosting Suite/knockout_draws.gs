/**
 * Draws a range of entrants into matchups. 
 * Assumes entrants are already sorted by rank and will produce a cup knockout round (two pots). The pots can be seeded or unseeded.
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range of values containing Ranks, Names and Nations of entrants (in that order).
 * @param {boolean} seededDraw True if the draw should be seeded by rank
 * @return An array of matchups in the format XXX vs YYY
 * @customfunction
 */
function drawCupRound(rangeOfEntrants, seededDraw) {

  // split into two pots
  const [pot1, pot2] = createPots(rangeOfEntrants, seededDraw);

  const finalDraw = [];
  const pot2Remaining = [...pot2]; // Create a mutable copy of pot2

  // Iterate through each entrant in pot1
  for (let i = 0; i < pot1.length; i++) {
    const entrant1 = pot1[i];
    let randomIndex;

    // draw a random opponent
    randomIndex = Math.floor(Math.random() * pot2Remaining.length);
    const entrant2 = pot2Remaining[randomIndex];  
    finalDraw.push([entrant1[1], 'vs', entrant2[1]]); // Store entrant names
    pot2Remaining.splice(randomIndex, 1);
  }

  // You now have the final draw, ready to be written back to a sheet
  return finalDraw;

}

/**
 * Draws a range of entrants (no additional information) into matchups. 
 * Randomly shuffles entrants, and pairs them.
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range of values containing Names of entrants
 * @return An array of matchups in the format XXX vs YYY
 * @customfunction
 */
function drawCupRoundSimple(rangeOfEntrants) {

  const finalDraw = [];

  // Iterate through each entrant in pot1
  for (let i = 0; i < rangeOfEntrants.length; i += 2) {
    const entrant1 = rangeOfEntrants[i];
    const entrant2 = rangeOfEntrants[i+1];
    
    finalDraw.push([ entrant1, 'vs', entrant2 ]); // store entrant names
  }

  // You now have the final draw, ready to be written back to a sheet
  return finalDraw;

}

/**
 * Draws a range of entrants into matchups, with a number of seeds specified who are kept apart
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range of values containing Rank and Name at a minimum
 * @param {number} numSeeds the number of seeds to assign
 * @param {boolean} inSeedOrder are the entrants already sorted by seed/rank? Defaults to false.
 * @param {number} rankCol the index of the column containing the rank (1 for 1st, 2 for 2nd, etc). Defaults to 1.
 * @param {number} nameCol the index of the column containing the name (1 for 1st, 2 for 2nd, etc). Defaults to 2.
 * @param {boolean} includeMatchNumber whether to include the matchup number. Defaults to false.
 * @return An array of matchups in the format XXX vs YYY
 * @customfunction
 */
function drawCupRoundVariableSeeds(rangeOfEntrants, numSeeds, inSeedOrder = false, rankCol = 1, nameCol = 2, includeMatchNumber = false) {
  
  // ensure we don't exceed the array length
  if (numSeeds > rangeOfEntrants.length) {
    numSeeds = rangeOfEntrants.length;
  }

  // if fewer than two columns but not in seed order, error out
  // we need both Rank and Name if so
  if (!inSeedOrder && Array.isArray(rangeOfEntrants[0]) && rangeOfEntrants[0].length < 2) {
    return 'Minimum two columns required if entrants are not already sorted by rank or seed.';
  }

  // sort by rank first if not already
  let sortedEntrants = [];
  if (!inSeedOrder) {
    sortedEntrants = [...rangeOfEntrants].sort((a, b) => {
      return a[rankCol-1] - b[rankCol-1]; // minus one from index provided because arrays are zero-indexed
    });
  } else {
    sortedEntrants = [...rangeOfEntrants];
  }

  // determine seed separation
  const totalEntrants = rangeOfEntrants.length;
  const step = Math.floor(totalEntrants / numSeeds);

  // separate the seeds from the rest of the pack
  // keep seeds in order but shuffle everyone else
  const seeds = sortedEntrants.slice(0, numSeeds);
  const unseededPool = sortedEntrants.slice(numSeeds);
  let poolRemaining = [...unseededPool];
  shuffleArray(poolRemaining);

  // get the standard seed order, based on the number of entrants
  // if not a power of two, we bump it up to one and then clear out the values above our number of seeds
  const seedOrder = getStandardSeedOrder(Math.pow(2, Math.ceil(Math.log2(numSeeds)))).filter(n => n <= numSeeds);

  // create the empty bracket
  const bracket = new Array(totalEntrants).fill(null);

  // place the seeds in their correct positions based on seedOrder
  seedOrder.forEach((seedRank, index) => {

    const entrant = seeds[seedRank - 1];
    
    // calculate target slot using a percentage of the total number of slots in the draw
    // converted to a ratio, and mapped to an actual array index
    const targetSlot = Math.round(index * (totalEntrants - 1) / (numSeeds - 1));
    
    // in case the slot is already taken, take the next closest empty one
    let actualSlot = targetSlot;
    while (bracket[actualSlot] !== null && actualSlot < totalEntrants) {
      actualSlot++;
    }
  
    bracket[actualSlot] = entrant;
  })

  // fill the rest of the bracket randomly
  for (let i = 0; i < bracket.length; i++) {
    if (bracket[i] === null) {
      bracket[i] = poolRemaining.shift();
    }
  }

  // construct the draw array
  const finalDraw = [];
  for (let i = 0; i < bracket.length; i += 2) {
    const e1 = bracket[i];
    const e2 = bracket[i+1];
    const matchNum = Math.floor(i / 2) + 1;

    // if each entrant is just a value, we dont need to grab a sub-array element
    let entrant1 = e1;
    let entrant2 = e2;
    if(Array.isArray(rangeOfEntrants[0])) {
      entrant1 = e1[nameCol-1];
      entrant2 = e2[nameCol-1];
    }

    if(includeMatchNumber) {
      finalDraw.push([ matchNum, entrant1, 'vs', entrant2 ]);
    } else {
      finalDraw.push([ entrant1, 'vs', entrant2 ]);
    }
  }

  return finalDraw;
}

/**
 * Draws a range of entrants into matchups where entrants cannot be drawn against another entrant from the same nation. 
 * Assumes entrants are already sorted by rank and draws a cup knockout round (two pots). The pots can be seeded or unseeded.
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range of values containing Name, and Nation (in that order)
 * @param {boolean} seededDraw True if the draw should be seeded by rank
 * @return An array of matchups in the format XXX vs YYY
 * @customfunction
 */
function drawAvoidSameNation(rangeOfEntrants, seededDraw) {
  
  // split into two pots
  const [pot1, pot2] = createPots(rangeOfEntrants, seededDraw);
  
  const finalDraw = [];
  const pot2Remaining = [...pot2]; // Create a mutable copy of pot2

  // Iterate through each entrant in pot1
  for (let i = 0; i < pot1.length; i++) {
    const entrant1 = pot1[i];
    const entrant1Nation = entrant1[2]; // Assuming nation is the third element

    let validOpponentFound = false;
    let randomIndex;

    // Keep trying to find a valid opponent from pot2
    while (!validOpponentFound && pot2Remaining.length > 0) {
      randomIndex = Math.floor(Math.random() * pot2Remaining.length);
      const entrant2 = pot2Remaining[randomIndex];
      const entrant2Nation = entrant2[2];

      // Check for nation conflict
      if (entrant1Nation !== entrant2Nation) {
        // valid opponent found, add to the draw and remove from pot2
        finalDraw.push([entrant1[1], 'vs', entrant2[1]]); // store entrant names
        pot2Remaining.splice(randomIndex, 1);
        validOpponentFound = true;
      }
    }
  }

  // return the final draw
  return finalDraw;
}

/**
 * Generates the seed order based on standard logic
 */
function getStandardSeedOrder(n) {
  let seeds = [1];
  while (seeds.length < n) {
    let next = [];
    for (let s of seeds) {
      next.push(s);
      next.push(2 * seeds.length + 1 - s);
    }
    seeds = next;
  }
  return seeds;
}