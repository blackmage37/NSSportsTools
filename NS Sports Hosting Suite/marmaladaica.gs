function scorinateMarmaladaican() {
  // runs a scorination algorithm but also returns additional information
  // required for marmaladaican calculations

  // output object: { team1score, team2score, team1cards: { [ type, number ] }, team2cards { [ type, number ] } }
  /* e.g. { 
            team1: 3, 
            team2: 2, 
            team1cards: { 
                          playerYellow: 2, 
                          playerSecondYellow: 0, 
                          playerRed: 0,
                          playerGreen: 0, 
                          managerYellow: 0, 
                          managerSecondYellow: 0, 
                          managerRed: 0,
                          managerGreen: 0 
                        },
            team2cards: { 
                          playerYellow: 5, 
                          playerSecondYellow: 1, 
                          playerRed: 0,
                          playerGreen: 0, 
                          managerYellow: 1, 
                          managerSecondYellow: 0, 
                          managerRed: 0,
                          managerGreen: 0 
                        }
          }
    would show that team1 won 3-2
    2 players on team1 received yellow cards, 
    team2 players received 5 yellows, one team2 player sent off for a second yellow, and the team2 manager also got a yellow
    no team got any green cards
  */
}

function generateMarmaladaicanTable(rangeOfResults) {
  
  // range of results will need to include booking data
  // if no booking data in rangeOfResults, that will have to be randomly generated (use getCardRates)

  // when a result is a draw, one point each to the teams involved, and one point into the raffle pot
  // end of season, the contents of the raffle pot are drawn: 
  // four selections, awarded 50%, 25%, 12.5%, and 12.5% -- rounded down to nearest whole number)
  // one team can be drawn multiple times

  // teams are awarded raffle tickets based on discipline
  // start with 100 tickets, lose tickets for bookings, gain them for "green cards" (good sportsmanship)
  // tickets are lost at 2 x "disciplinary points" rate (see kage_no_ryouiki.gs); managers have a 1.5x multiplier
  // green cards award 15 tickets; 10 if manager.

  // tiebreaker order:
    // total points (including raffle points)
    // fewer disciplinary points (green cards subtract disciplinary points equal to a red card)
    // more draws
    // away goals scored
    // goal difference
}

/**
 * Simulates a complete raffle drawing and returns the winner(s).
 * 
 * @param {Object} entrantData An object detailing the entrants and their "score" (e.g. { Alfie: 25, Bert: 20, Charlie: 5 }). Score values are automatically converted to raffle tickets.
 * @param {number} winPenaltyFactor The degree to which a winner's tickets are reduced upon winning a prize. e.g. 0.2 would reduce to 20%, so 10 tickets would become 2.
 * @param {number} prizePot The total available in the prize pot. This is automatically distributed among four winners: 50%, 25%, 2 x 12.5%. Defaults to zero. To use a different split, pass prizeInfo
 * @param {boolean} allowFractions (Optional) Allow fractional winnings from the raffle. Defaults to false, and increases the prizePot to the next multiple of 8 if so.
 * @param {Object} prizeInfo (Optional) An object defining the various prizes, e.g. { 1: 100, 2: 25, 3: 5 } meaning 1st prize is 100, 2nd is 25, etc. If this is not passed, and prizePot is zero, function returns an error.
 * @return {Object} The winning entrant(s) (and their associated data)
 */
function conductRaffle(entrantData, winPenaltyFactor, prizePot=0, allowFractions=false, prizeInfo) {

  // prepare the metadata and entrant objects
  const manifest = prepareRaffle(entrantData);
  let entrants = manifest.entrants.map(e => ({...e}));
  
  // check for prizeInfo object
  let prizeData = {};
  if (prizeInfo === undefined) {
    
    // check for prizePot greater than zero
    if (prizePot > 0) {
      // no prizeInfo, so prepare the prize pot data
      if (!allowFractions) {
        while (prizePot % 8 !== 0) {
          prizePot += 1;
        }
      }

      // define the winnings amounts, based on prizePot
      prizeData = {
        1: prizePot / 2,
        2: prizePot / 4,
        3: prizePot / 8,
        4: prizePot / 8
      }
    } else {
      return { error: 'Cannot have a raffle with no prize' };
    }
  } else {
    // copy prizeInfo to prizeData
    prizeData = prizeInfo;
  }

  // sort prizeData to get best prize first
  const prizeRanks = Object.keys(prizeData).sort((a, b) => a - b);
  const results = [];

  // sequential drawing loop
  for (let rank of prizeRanks) {
    let currentPoolTotal = entrants.reduce((sum, e) => sum + e.tickets, 0);
    
    // safety check if we run out of weight
    if (currentPoolTotal <= 0) break;

    let draw = Math.random() * currentPoolTotal;
    let cursor = 0;

    for (let j = 0; j < entrants.length; j++) {
      cursor += entrants[j].tickets;
      
      if (cursor >= draw) {
        let winner = entrants[j];
        
        // record the result
        results.push({
          rank: rank,
          prizeValue: prizeData[rank],
          winner: winner.name,
          score: winner.score,
          oddsAtTimeOfDraw: ((winner.tickets / currentPoolTotal) * 100).toFixed(2) + "%"
        });

        // apply the penalty for this winner
        entrants[j].tickets *= winPenaltyFactor; 
        break; 
      }
    }
  }

  return {
    drawDate: new Date().toLocaleString(),
    totalEntrants: manifest.metadata.entrantCount,
    winners: results
  };
}

/** Prepares raffle data, providing some metadata for transparency and logging
 *
 * @param {object} entryData An object detailing the entrants and how many tickets they have (e.g. { Alfie: 25, Bert: 20, Charlie: 5 })
 * @return An object containing all the required metadata for the raffle (entrantCount, averageScore, standardDeviation, totalTickets) along with each entrant's data (name, score, zScore, tickets, winProbability)
 * @customfunction
 */
function prepareRaffle(entryData) {

  const entrants = Object.entries(entryData).map(([name, score]) => ({ name, score }));
  const scores = entrants.map(e => e.score);
  const numEntrants = entries.length;

  if (numEntrants == 0) return { error: 'No entrants found' };

  // calculate stats. assign standard deviation as 1 if all scores are the same
  const mean = scores.reduce((a, b) => a + b, 0) / numEntrants;
  const stdDev = Math.sqrt(
    scores.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a+ b, 0) / numEntrants
    ) || 1;
  
  // map entrants with metadata
  let totalTickets = 0;
  const raffleEntrants = entrants.map(e => {
    const z = (e.score - mean) / stdDev;      // z-score. used to calculate number of tickets
    const tickets = Math.exp(z);
    totalTickets += tickets;
    return {
      name: e.name,
      score: e.score,
      zScore: z.toFixed(3),        // limit to 3 decimal places
      tickets: tickets,
      winProbability: 0            // will calculate this in a bit
    };
  });

  // calculate probabilities
  raffleEntrants.forEach(e => {
    e.winProbability = ((e.tickets / totalTickets) * 100).toFixed(2) + '%';
  })

  // sort by number of tickets (we can return the top n more easily this way)
  raffleEntrants.sort((a, b) => b.tickets - a.tickets);

  // put it all together
  return {
    metadata: {
      entrantCount: numEntrants,
      averageScore: mean.toFixed(2),
      standardDeviation: stdDev.toFixed(2),
      totalTickets: totalTickets.toFixed(2)
    },
    entrants: entrants
  };
  
}


function assignCards() {

}

/**
 * Calculates the probability of a player or manager getting a yellow, red, or green card based on expected numbers of cards per game and manager proportions
 *
 * @param {number} yellowRate The number of yellow cards expected per game (a second yellow is assumed to be 1/8 of this value)
 * @param {number} redRate The number of red cards expected per game
 * @param {number} greenRate The number of green cards (for good sportsmanship) expected per game. Set this to zero if you do not want to implement green cards.
 * @param {number} managerProb The probability of a manager getting a yellow/red card
 * @param {number} managerGreenProb The probability of a manager getting a green card
 * @return An object with properties for each probability value
 * @customfunction
 */
function getCardRates(yellowRate, redRate, greenRate, managerProb, managerGreenProb) {

  // set default card rates here

    // expected number of yellow cards per game (second yellows will automatically be assumed to be 1/8 this many)
    let baseYellow = yellowRate === undefined ? 3 : yellowRate;           
    // expected number of red cards per game
    let baseRed = redRate === undefined ? 0.1 : redRate;            
    // expected number of green cards per game
    let baseGreen = greenRate === undefined ? 0.5 : greenRate;          

    // what percentage of yellow/red cards are shown to the managers?
    let managerBooking = managerProb === undefined ? 0.075 : managerProb;   
    // what percentage of green cards are shown to the managers?
    let managerGreen = managerGreenProb === undefined ? 0.03 : managerGreenProb;

  // then use these to calculate probabilities of each card type for each player, and the managers
  pYellow = (baseYellow * (1-managerBooking)) / 22;
  pRed = (baseRed * (1-managerBooking)) / 22;
  pGreen = (baseGreen * (1-managerGreen)) / 22;

  pYellowMgr = (baseYellow * managerBooking) / 2;
  pRedMgr = (baseRed * managerBooking) / 2;
  pGreenMgr = (baseGreen * managerGreen) / 2;

  return {
    playerYellow: pYellow,
    playerSecondYellow : pYellow / 8,
    playerRed: pRed,
    playerGreen: pGreen,
    managerYellow: pYellowMgr,
    managerSecondYellow: pYellowMgr / 8,
    managerRed: pRedMgr,
    managerGreen: pGreenMgr,
  };
}