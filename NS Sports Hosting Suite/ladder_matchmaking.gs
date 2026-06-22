/* need to adjust this to allow the result to be passed in a different format
 * so we can feed it into a larger method that simulates the matchups themselves
 * 
 * this would allow for this algorithm to be applied to multiple rounds at once
 * useful for sports like boxing where ladder movement will impact the next 
 * title contenders etc etc
 */
/**
 * Calculates a series of matchups for a sports ladder.
 *
 * @param {Array<Array<string|number>>} entrants A range containing Ranks (numeric) and Names, in that order.
 * @param {number} challengeRankRange The number of ranks above that a team can be drawn against (e.g. if this is set to 4, the team ranked 10th can challenge up to 6th)
 * @param {boolean} lowerRankHomeAdv True if the lower-ranked team should always be drawn at home.
 * @return An array of matchups.
 * @customfunction
 */
function drawLadderMatchups(entrants, challengeRankRange, lowerRankHomeAdv) {
  
  // takes a range of entrants with the following columns
  // Rank, Name

  // how many ranks above can we challenge? defaults to 4 if not specified
  var challengeRange = challengeRankRange === undefined ? 4 : challengeRankRange;

  // is the lower ranked team always at home? (defaults to false)
  var lowerRankAtHome = lowerRankHomeAdv === undefined ? false : lowerRankHomeAdv;

  var matchedEntrants = [];
  var matchups = [];

  for (var i = entrants.length - 1; i >= 0; i--) {
    
    var challenger = entrants[i];
    var potentialOpps = [];

    // check if the team has already been matched
    if (matchedEntrants.indexOf(challenger[1]) == -1) {

      // loop through allowed range
      for (var j = i - 1; j >= Math.max(0, i - challengeRange); j--) {
        // if the entrant isnt already matched, add to potential opps
        if (matchedEntrants.indexOf(entrants[j][1]) == -1) {
          potentialOpps.push(entrants[j]);
        }
      }

      // if no available potential opponents in range
      // take the next lowest ranked available team
      if (potentialOpps.length == 0) {
        for (var j = i - 1; j >= 0; j--) {
          if (matchedEntrants.indexOf(entrants[j][1]) == -1) {
            potentialOpps.push(entrants[j]);
            break;
          }
        }
      }

      // if the number of entrants was odd, there will be one entrant 
      // for which a valid opponent cannot be found; they should get a BYE
      if (potentialOpps.length == 0) {
        // there are no opponents to select from, so no need for random
        //var bye = [ 0, 'BYE', 'BYE' ];
        matchups.push(challenger[1] + ' (' + challenger[0] + ')' + ' vs ' + 'BYE');
        matchedEntrants.push(challenger[1]);
      } else {
        // select a random opponent from potentialOpps
        var opponent = getRandomElement(potentialOpps);

        // do we have the lower ranked team home advantage setting on?
        if (!lowerRankAtHome) {
  
          // add to matchups; simulate coinflip to determine home/away
          if (coinFlip() == 'Heads') {
            //matchups.push([ challenger, opponent ]);
            matchups.push(challenger[1] + ' (' + challenger[0] + ')' + ' vs ' + opponent[1] + ' (' + opponent[0] + ')');
          } else {
            //matchups.push([ opponent, challenger ]);
            matchups.push(opponent[1] + ' (' + opponent[0] + ')' + ' vs ' + challenger[1] + ' (' + challenger[0] + ')');
          }
        } else {
          // otherwise always have the lower ranked team at home
          //matchups.push([ challenger, opponent ]);
          matchups.push(challenger[1] + ' (' + challenger[0] + ')' + ' vs ' + opponent[1] + ' (' + opponent[0] + ')');
        }
        
        // make sure both entrants are now in the matchedEntrants list
        matchedEntrants.push(challenger[1]);
        matchedEntrants.push(opponent[1]);
      }

    }

  }

  return matchups;

}