/**
 * Determines a bracket for a tennis tournament using the NS Sport Tennis seeding method
 *
 * @param {Array<Array<string>>} rangeOfEntrants A range of data with columns for Entrant, Trigram, RankPts, Skill (in that order).
 * @param {bool} isGrandSlam default is false. If false, tournament cannot be larger than 96 entrants.
 * @return {Array<Array<string>>} A tournament bracket, with placeholders for matchup winners
 * @customfunction
 */
function tennisSeeding(rangeOfEntrants, isGrandSlam) {

  // if not grand slam, max tournament size is 96. default is to assume NOT a grand slam
  const bracketSize = getDrawSize(rangeOfEntrants.length);
  const drawSize = isGrandSlam === undefined ? Math.max(96,bracketSize) : bracketSize;

  // get entriesByNation. we'll need this later
  let entriesByNation = new Map();
  rangeOfEntrants.forEach((entrant) => {
    const nation = entrant[1];    // trigram is second column
    // get current count (or 0 if it's the first time), then add 1
    entriesByNation.set(nation, (entriesByNation.get(nation) || 0) + 1);
  });

  // determine the number of excess entries, seeds, and qualifying spots
  const numExcess = rangeOfEntrants.length - drawSize;
  const numSeeds = getNumberOfSeeds(drawSize);
  const maxQualSpots = numSeeds / 2;

  // sort entrants by ranking points high to low
  rangeOfEntrants.sort((a, b) => b[2] - a[2]);

  // top two retain their seed
  let pot1 = rangeOfEntrants.slice(0, Math.min(2, rangeOfEntrants.length));

  // randomise 3-4
  let pot2 = rangeOfEntrants.slice(2, Math.min(4, rangeOfEntrants.length));
  shuffleArray(pot2);

  let seeds = [...pot1, ...pot2];

  // randomise 5-8 (if applicable)
  if (numSeeds >= 8) {
    let pot3 = rangeOfEntrants.slice(4, Math.min(8, rangeOfEntrants.length));
    shuffleArray(pot3);
    seeds.push(...pot3);
  }
  // randomise 9-12 (if applicable)
  if (numSeeds >= 12) {
    let pot4 = rangeOfEntrants.slice(8, Math.min(12, rangeOfEntrants.length));
    shuffleArray(pot4);
    seeds.push(...pot4);
  }
  // randomise 13-16 (if applicable)
  if (numSeeds >= 16) {
    let pot5 = rangeOfEntrants.slice(12, Math.min(16, rangeOfEntrants.length));
    shuffleArray(pot5);
    seeds.push(...pot5);
  }
  // randomise 17-24 (if applicable)
  if (numSeeds >= 24) {
    let pot6 = rangeOfEntrants.slice(16, Math.min(24, rangeOfEntrants.length));
    shuffleArray(pot6);
    seeds.push(...pot6);
  }
  // randomise 25-32 (if applicable)
  if (numSeeds == 32) {
    let pot7 = rangeOfEntrants.slice(24, Math.min(32, rangeOfEntrants.length));
    shuffleArray(pot7);
    seeds.push(...pot7);
  }

  // establish list variables for other entrants and qualifiers
  let qualifiers = [];
  let entrants = []; 
  let qualSpots = 0;
  
  // do we need a qualifying process?
  if (numExcess > 0) {
    // if so, calculate the number of entrants in qualifiers
    let quals = numExcess <= maxQualSpots ? numExcess * 2 : numExcess + maxQualSpots;
    qualSpots = Math.min(numExcess, maxQualSpots);

    // remove the bottom "quals" because they go into the qualifying draw
    qualifiers = rangeOfEntrants.slice(-quals);
    
    // everyone else goes into "entrants" pool
    entrants = rangeOfEntrants.slice(numSeeds, -quals);

    // add placeholders in the entrants pool equal to number of qualSpots
    const placeholders = Array.from({ length: qualSpots }, (_, i) => {
      const num = (i + 1).toString().padStart(2, '0');
      return [ `Qualifier ${num}`, 'XXX', 0, 0 ];
    });
    entrants.push(...placeholders);

  } else {
    // if no quals, everyone who isnt seeded goes into "entrants" pool
    entrants = rangeOfEntrants.slice(numSeeds);
  }

  // find the highest ranked qualifier
  highestQualRank = rangeOfEntrants.length - qualifiers.length + 1;

  // check for wildcard spots
  // if any nation has fewer than 25% of their entrants in the main draw (entrants + seeds)
  // their highest ranked entrant gets bumped up to the main draw
  // to facilitate this, someone in the main draw gets bumped out, and the highestQualRank increases by one
  mainDrawEntries = entrants;
  let updatedDraw = assignWildCards(entrants, qualifiers, entriesByNation);
  let mainDraw = updatedDraw.mainDraw;
  let qualDraw = updatedDraw.qualifyingDraw;

  // shuffle the two draw lists
  shuffleArray(qualDraw);
  shuffleArray(mainDraw);
  
  // format the entrants
  const formattedQual = qualDraw.map(entrant => formatEntrantsInDraw(entrant));
  const formattedMain = mainDraw.map(entrant => formatEntrantsInDraw(entrant));
  const formattedSeeds = seeds.map((entrant, index) => formatSeedsInDraw(entrant, index + 1));

  // draw the qualifying round
  let qualBracket = drawCupRoundSimple(formattedQual, false);      // unseeded regular draw

  // draw the main bracket - round one, no seeds
  let mainBracketR1 = drawCupRoundSimple(formattedMain, false);      // unseeded regular draw

  // build combined array of round one winners + seeds
  const roundOneWinners = Array.from({ length: formattedMain.length / 2 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `Winner of Round One Match ${num}`;
  });
  const roundTwo = formattedSeeds.concat(roundOneWinners);

  // then draw the second round, with the seeds facing the winners from round one
  let mainBracketR2 = drawCupRoundVariableSeeds(roundTwo, numSeeds, true, 3, 1, false)

  // combine the three draws into a single output
  const output = combineDraws(qualBracket, mainBracketR1, mainBracketR2);

  Logger.log(`Total entrants: ${rangeOfEntrants.length}` + 
             `\nDraw size: ${drawSize} (${mainDraw.length + seeds.length} entries seen)` + 
             `\nSeeded entrants: ${numSeeds}` + 
             `\nUnseeded in main draw: ${entrants.length} (${qualSpots} placeholders)` + 
             `\nIn Qualifying: ${qualifiers.length} (${qualDraw.length} entries seen)` + 
             `\nWild Cards Awarded: ${updatedDraw.wildCards.length}`);

  return output;

}

/**
 * Automatically assigns wild cards for nations with under 25% representation in the main draw
 *
 * @param {number} currentDrawEntrants the current list of entrants in the main draw
 * @param {number} qualifyingPool the current list of entrants in the qualifying pool
 * @param {number} entriesByNation a map object containing trigrams and total number of entrants in the tournament
 * @return {number} The draw size
 * @customfunction
 */
function assignWildCards(currentDrawEntrants, qualifyingPool, entriesByNation) {
  
  let draw = [...currentDrawEntrants];
  let pool = [...qualifyingPool];
  let wildCards = [];

  // helper function to get count for a nation within the current draw
  const getDrawCount = (nation) => draw.filter(p => p.nation === nation).length;

  entriesByNation.forEach((total, nation) => {
    const goal = Math.ceil(total * 0.25);

    while (getDrawCount(nation) < goal) {
      // find best candidate from the qualifiers (pool)
      const candidateIn = pool
        .filter(e => e.nation === nation)
        .sort((a, b) => a.rank - b.rank)[0];

      // find weakest player in main draw from a "surplus" nation
      const candidateOut = draw
        .filter(e => {
          const nTotal = entriesByNation.get(e.nation);
          return getDrawCount(e.nation) > Math.ceil(nTotal * 0.25);
        })
        .sort((a, b) => a.rank - b.rank)[0];

      if (candidateIn && candidateOut) {
        // move candidateIn to draw, move candidateOut to qualifiers
        draw = draw.filter(p => p.id !== candidateOut.id);
        pool = pool.filter(p => p.id !== candidateIn.id);
        
        draw.push(candidateIn);
        pool.push(candidateOut);
        wildCards.push(candidateIn);

      } else {
        break; 
      }
    }
  });

  return { mainDraw: draw, qualifyingDraw: pool, wildCards: wildCards };

}

// converts entrants in a draw list into "Entrant [XYZ]"" format
function formatEntrantsInDraw(entrant, nameCol = 1, nationCol = 2) {
  const getFormattedEntrant = (e) => {
    if (!e || e === "BYE") return "BYE";
    return `${e[nameCol-1]} [${e[nationCol-1]}]`;
  }
  return getFormattedEntrant(entrant);
}

// as above, except adds seed number as a prefix "(#0) Entrant [XYZ]"
function formatSeedsInDraw(entrant, seed, nameCol = 1, nationCol = 2) {
  const getFormattedEntrant = (e) => {
    if (!e || e === "BYE") return "BYE";
    return `(#${seed}) ${e[nameCol-1]} [${e[nationCol-1]}]`;
  }
  return getFormattedEntrant(entrant);
}

// combines the qualifying and main draw rounds into one handy output with numbered matchups to correspond to placeholders in subsequent rounds
function combineDraws(qualifying, mainRoundOne, mainRoundTwo) {
  const combined = [];
  const rowCount = Math.max(qualifying.length, mainRoundOne.length, mainRoundTwo.length);

  for (let i = 0; i < rowCount; i++) {
    
    const spacer = [""];
    
    const qualRow = qualifying[i] ? [(i + 1), ...qualifying[i]] : ["", "", "", ""];
    
    const roundOne = mainRoundOne[i] ? [(i + 1), ...mainRoundOne[i]] : ["", "", "", ""];
    
    const roundTwo = mainRoundTwo[i] || ["", "", ""];

    combined.push([...qualRow, ...spacer, ...roundOne, ...spacer, ...roundTwo]);
  }
  return combined;
}

/**
 * Determines the draw size for a tennis tournament by selecting the largest viable tournament entrant number that is smaller than or equal to the number of entrants
 *
 * @param {number} numberOfEntrants the number of entrants for the tournament
 * @return {number} The draw size
 * @customfunction
 */
function getDrawSize(numberOfEntrants) {

  let possibleSizes = [ 16, 24, 28, 32, 48, 56, 64, 96, 112, 128 ];
  let size = 0;

  for (let i = 0; i < possibleSizes.length; i++) {
    if (numberOfEntrants >= possibleSizes[i]) {
      size = possibleSizes[i];
    }
  }

  return size;

}

/**
 * Determines the appropriate number of seeds in a tennis tournament, based on the tournament draw size
 *
 * @param {number} drawSize the size of the tournament draw
 * @return {number} The number of seeds
 * @customfunction
 */
function getNumberOfSeeds(drawSize) {
  switch (drawSize) {
    case 16:
      return 4;
    case 24:
    case 28:
    case 32:
      return 8;
    case 48:
    case 56:
    case 64:
      return 16;
    case 96:
    case 112:
    case 128:
      return 32;
    default:
      return -1;
  }
}