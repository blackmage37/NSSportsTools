/**
 * Splits an array of entrants into two pots, for simple cup draws. A bye is automatically added if the number of entrants is odd
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range containing Ranks (numeric), Names, and Nations, in that order.
 * @param {boolean} seededDraw True if the top half of the entrants (by rank) should be placed in the same pot
 * @return Two lists, containing all of the entrants originally passed, split evenly.
 * @customfunction
 */
function createPots(rangeOfEntrants, seededDraw) {
  
  // we receive a range of ranks, names and nations
  // if number of entrants passed is odd, we need to add an unseeded BYE to the array
  if (rangeOfEntrants.length % 2 == 1) {
    var bye = [ 0, 'BYE', 'BYE' ];
    rangeOfEntrants.push(bye);
  }

  // if seeded, split into two lists based on rank
  var pot1 = [];
  var pot2 = [];

  // find the midpoint
  var midPoint = Math.round(rangeOfEntrants.length / 2, 0);
  var medianRank = (rangeOfEntrants[midPoint-1][0] + rangeOfEntrants[midPoint][0]) / 2;
  
  if (seededDraw) {
    // Sort the data by rank (the first column)
    rangeOfEntrants.sort((a, b) => a[0] - b[0]);
    
    // split the array in half for seeding
    for (let i = 0; i < rangeOfEntrants.length; i++) {
      const team = rangeOfEntrants[i];
      if (team[0] <= medianRank) {
        pot1.push(team);
      } else {
        pot2.push(team);
      }
    }
  } else {
    // otherwise shuffle the array and split in half
    shuffleArray(rangeOfEntrants);
    pot1 = rangeOfEntrants.slice(0, midPoint);
    pot2 = rangeOfEntrants.slice(midPoint, rangeOfEntrants.length);
  }

  return [pot1, pot2];

}

/**
 * Splits an array of entrants into a specified number of pots, based on rank. Byes are automatically added if the number of entrants does not divide evenly among the number of pots.
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range containing Ranks (numeric), Names, and Nations, in that order.
 * @param {number} numberOfPots how many pots should the entrants be split into?
 * @return a number of lists, containing all of the entrants originally passed, split evenly.
 * @customfunction
 */
function createVariablePots(rangeOfEntrants, numberOfPots) {

  var pots = [];
  var totalEntrants = rangeOfEntrants.length;

  // if the number of teams is not divisible evenly by the number of pots
  // add byes until it is
  while (totalEntrants % numberOfPots > 0) {
    var bye = [ 0, 'BYE', 'BYE' ];
    rangeOfEntrants.push(bye);
    totalEntrants = rangeOfEntrants.length;
  }

  const entrantsPerPot = Math.floor(totalEntrants / numberOfPots);

  for (let i = 0; i < numberOfPots; i++) {
    const start = i * entrantsPerPot;
    let end = start + entrantsPerPot;

    // Handle any remainder teams for the last pot
    if (i === numberOfPots - 1) {
      end = totalEntrants;
    }

    pots.push(rangeOfEntrants.slice(start, end));
  }

  return pots;

}

/**
 * Draws entrants into a specified number of pots and outputs the result as a range
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range of values containing Rank, Name, and Nation (in that order)
 * @param {number} numberOfPots The number of pots to draw the entrants into
 * @return An array of arrays. Each of the inner arrays represents one pot, and contains the relevant entrants. You may wish to transpose the result for easier reading.
 * @customfunction
 */
function drawVariablePots(rangeOfEntrants, numberOfPots) {

  const allPots = createVariablePots(rangeOfEntrants, numberOfPots);

  var output = [];

  // convert the pots to readable output
  for (let i = 0; i < numberOfPots; i++) {
    
    var pot = [];

    for (let j = 0; j < allPots[0].length; j++) {

      var rank = '(' + Utilities.formatString('%02d', parseInt(allPots[i][j][0])) + ')';
      var entrant = allPots[i][j][1];
      var nation = '[' + allPots[i][j][2] + ']'
      var eString = rank + ' ' + entrant + ' ' + nation;

      pot.push(eString);

    }
    
    output.push(pot);

  }

  return output;
  
}