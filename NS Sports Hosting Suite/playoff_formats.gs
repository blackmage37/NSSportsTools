/**
 * Draws a range of entrants into a single elimination bracket. 
 * If the number of teams is not a power of two, BYEs are added as appropriate.
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range of values containing Rank, Name, and Nation (in that order)
 * @param {boolean} seededDraw True if the draw should be seeded by rank
 * @return An array of matchups in the format XXX vs YYY
 * @customfunction
 */
function generateSingleEliminationBracket(rangeOfEntrants, seededDraw) {

  // straight knockout bracket
  // needs to handle logic for numbers of entrants that are not powers of two (e.g. 12 teams, 6 teams, etc)
  // automatically structures the bracket with byes if needed
  // outputs an object representing each matchup in the bracket

}

/**
 * Draws a range of entrants into a "page playoff" bracket, where higher seeds have more chances to progress. 
 * If the number of teams is even, a BYE will be added.
 *
 * @param {Array<Array<string>>} rangeOfEntrants A range of values representing the entrants. The list should already be in seed order, lowest seed first.
 * @return An array of matchups in the format XXX vs YYY
 * @customfunction
 */
function generatePagePlayoffBracket(rangeOfEntrants) {

  // for four teams, this would be: 
  //    A: 3v4, 1v2 
  //    B: winner 3v4 faces loser 1v2 
  //    C: winner B faces winner 1v2 in grand final
  // logic can be expanded out by splitting draw into two tiers, each tier is a power of two
  // if initial list is odd number, add a bye at the lowest position of the top tier

  const n = rangeOfEntrants.length;
  let output = [["Round", "Match", "Home", "Away", "Logic"]];

  // determine the largest possible size for the "upper tier"
  // the largest power of two not greater than half the total bracket size
  let topSize = 1;
  while ((topSize * 2) <= (n / 2) + 1) { // buffer for odd numbers of entrants
    topSize *= 2;
  }
  
  // if number of teams is odd, insert a 'BYE' at the end of the upper tier
  // this gives the top seed a BYE, but pushes a team down into the bottom tier
  // we'll have to handle that later
  if (n % 2 !== 0) {
    rangeOfEntrants.splice(topSize - 1, 0, [ "BYE" ]);
  }

  // split the entrant list into two tiers
  const upperTier = rangeOfEntrants.slice(0, topSize); 
  const lowerTier = rangeOfEntrants.slice(topSize, rangeOfEntrants.length); 

  let roundNum = 1;

  // UPPER TIER 
  let upperWinners = []; 
  let upperLosers = []; // losing teams
  let byeSlots = 0;     // track the number of missing losers, so we can adjust teams surviving the bottom tier later
  
  for (let i = 0; i < topSize / 2; i++) {
    let m = `Q${i+1}`;
    // "fold" logic: top plays bottom, repeat until all teams are matched
    let home = upperTier[i][0];
    let away = upperTier[topSize - 1 - i][0];
    
    // BYE will always be the lower ranked team, so will be "away" in the draw order
    if (away === "BYE") {
      output.push([`Week ${roundNum}`, m, home, "BYE", "Top Seed Advances; No Loser drops"]);
      upperWinners.push(`${home}`);
      byeSlots++; // record that a loser is missing here because there was a BYE
    } else {
      output.push([`Week ${roundNum}`, m, home, away, "Winner Safe; Loser Drops"]);
      upperWinners.push(`Winner ${m}`);
      upperLosers.push(`Loser ${m}`);
    }
  }

  // LOWER TIER
  // lower tier must play until they match the TOTAL slots available in the crossover phase 
  // crossover slots available = upper tier losers + BYE slots
  let targetSurvivors = upperLosers.length + byeSlots;
  
  let lowerSurvivors = [...lowerTier];
  let eMatchCount = 1;

  while (lowerSurvivors.length > targetSurvivors) {
    let nextRoundSurvivors = [];
    let matchCount = lowerSurvivors.length / 2;
    
    // if there is an odd number in elimination, the highest seed gets a pass
    if (lowerSurvivors.length % 2 !== 0) {
      nextRoundSurvivors.push(lowerSurvivors.shift());
      matchCount = Math.floor(lowerSurvivors.length / 2);
    }

    for (let i = 0; i < matchCount; i++) {
      let m = `E${eMatchCount++}`;
      let home = lowerSurvivors[i][0];
      let away = lowerSurvivors[lowerSurvivors.length - 1 - i][0];
      
      output.push([`Week ${roundNum}`, m, home, away, "Elimination Match"]);
      nextRoundSurvivors.push(`Winner ${m}`);
    }
    lowerSurvivors = [...nextRoundSurvivors, ...lowerSurvivors.slice(matchCount*2)]; // Re-merge any byes
    
    if (lowerSurvivors.length > targetSurvivors) roundNum++;
  }

  output.push(["---", "---", "---", "---", "---"]);
  roundNum++;

  // CROSSOVER PHASE
  let crossoverWinners = [];
  
  // upper tier losers face lower tier survivors
  // pair highest loser vs lowest survivor to maintain seed advantage
  for (let i = 0; i < upperLosers.length; i++) {
    let m = `S${i+1}`;
    let home = upperLosers[i];       // counts from the top
    let away = lowerSurvivors.pop(); // lowest seed remaining
    
    output.push([`Week ${roundNum}`, m, home, away, "Sudden Death"]);
    crossoverWinners.push(`Winner ${m}`);
  }
  
  // fill BYE slots with best remaining bottom survivors 
  for (let i = 0; i < byeSlots; i++) {
    let luckyTeam = lowerSurvivors.pop(); // the best remaining bottom team
    output.push([`Week ${roundNum}`, "Promotion", luckyTeam, "Empty Slot", "Advances due to Top Tier Bye"]);
    crossoverWinners.push(luckyTeam);
  }

  output.push(["---", "---", "---", "---", "---"]);
  roundNum++;

  // FINAL PHASE
  let finalBracket = [...upperWinners, ...crossoverWinners];
  
  // standard convergence
  let fMatchCount = 1;
  while (finalBracket.length > 1) {
    let nextRound = [];
    for (let i = 0; i < finalBracket.length / 2; i++) {
      let m = `F${fMatchCount++}`;
      let home = finalBracket[i];
      let away = finalBracket[finalBracket.length - 1 - i];
      output.push([`Week ${roundNum}`, m, home, away, "Finals"]);
      nextRound.push(`Winner ${m}`);
    }
    finalBracket = nextRound;
    roundNum++;
  }
  
  return output;

}