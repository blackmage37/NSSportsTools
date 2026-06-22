/**
 * Takes an input range of entrant data and transforms it into an array of objects to be used in swiss/casaran functions
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range of values containing Name, Nation, and Rank/Skill Points (in that order)
 * @param {number} numberOfRounds The number of casaran rounds to scorinate before the tournament is over
 * @return An array of matchups and results in the format { matchday, team1, team1score, team2score, team2 }. This range can be passed to the tabulation algorithm afterwards.
 * @customfunction
 */
function casaranTournament(rangeOfEntrants, numberOfRounds) {

}

function fideSwiss_Tournament(rangeOfEntrants, numberOfRounds) {
  
}

// not-quite-swiss; but close enough. typical approach used in NS Sports
function drawNextRound_Casaran(teams) {
  
}

// strictly follows FIDE swiss rules
function drawNextRound_FIDESwiss(rangeOfEntrants) {
  // team object must include win-loss record so far
}

/**
 * Takes an input range of entrant data and transforms it into an array of objects to be used in swiss/casaran functions
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants A range of values containing Name, Nation, and Rank/Skill Points (in that order)
 * @return An array of objects in the format {name, nation, rank, points, wins, draws, losses, hasBye[bool] opponents[array]}
 * @customfunction
 */
function createTeamObjectsFromRange(rangeOfEntrants) {

  let teamObjects = rangeOfEntrants.map((row, index) => {
    return {
      id: index + 1,          // autoincrement id based on row position
      name: row[0],           // first column
      nation: row[1],         // second column
      rankPts: row[2],        // third column
      
      // initialize tournament state
      points: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      opponents: [],
      hasBye: false
    };
  });

  return teamObjects;

}