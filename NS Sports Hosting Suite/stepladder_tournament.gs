/**
 * Builds, and outputs a stepladder bracket as an object
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range of values containing Rank, Name, and Nation (in that order)
 * @param {number} bestOf (Optional) The maximum number of times entrants face each other per round. Defaults to 1. Takes only the integer component of the value passed, and forces the next odd integer if this value is even. (e.g. if 2.4 is passed, this is rounded to 2, and then increased to 3)
 * @param {boolean} homeAdvantage (Optional) Enable home advantage for the higher seed in odd numbered games within the tie. Defaults to false.
 * @return An array of results going through the bracket, following the stepladder tournament logic
 * @customfunction
 */
function stepladderBracket(rangeOfEntrants, bestOf, useHomeAdvantage) {

  // default is to assume no home advantage
  let homeAdvantage = useHomeAdvantage === undefined ? false : useHomeAdvantage;

  // default to a one off matchup for each tie, but this can be set to any value
  // take the integer component of bestOf only
  let numberTies = bestOf === undefined ? 1 : Math.floor(bestOf);  

  // if the value passed is not a number, the default applies
  numberTies = isNaN(numberTies) ? 1 : numberTies;

  // the the integer value is even, one is added to make it viable as a "bestof"
  numberTies = numberTies % 2 == 0 ? numberTies + 1 : numberTies;

  // sort entrants by rank, ascending
  let sortedEntrants = sortRanks(rangeOfEntrants, 0, true);    // use true if rank is ordinal, false if its an actual rank score

  // bottom two ranked entrants face off in the first round
  // winner faces next lowest rank, and so on until the highest ranked entrant has participated
  let matches = [];
  let matchNumber = 1;

  // take lowest two ranked entrants
  let challenger = sortedEntrants.pop();
  let step = sortedEntrants.pop();
  
  while (step) {

    let home = homeAdvantage ? step : challenger;
    let away = homeAdvantage ? challenger : step;

    // if not using home advantage, perform a random check for home/away swap
    if (!homeAdvantage) {
      if (coinFlip() == 'Heads') {
        let x = home;
        home = away;
        away =  x;
      }
    }

    // build the match object
    matches.push({
      match: matchNumber,
      home: home,
      away: away,
      bestOf: numberTies
    })

    // get participants for next matchup
    step = `Winner of Match ${matchNumber}`;
    challenger = sortedEntrants.pop();

    // increment the match number
    matchNumber++;

  }

  return matches;

}
