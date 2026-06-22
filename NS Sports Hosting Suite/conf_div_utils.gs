/**
 * Splits a list of entrants by conference or division, into multiple smaller lists
 *
 * @param {Array<Array<string>>} data A range of data with columns for Conference/Division, and Entrant.
 * @return {Array<Array<string>>} An array of arrays, containing entrants split by conference or division
 * @customfunction
 */
function splitEntrants(data) {
  const split = {};
  const seen = new Set();
  
  data.forEach(row => {
    if (!row || row.length < 2) return;
    const div = String(row[0]).trim(); 
    const team = row[1];
    
    // Prevent duplicates and empties
    if (!team || seen.has(div+team)) return;
    
    seen.add(div+team);
    if (!split[div]) split[div] = [];
    split[div].push(team);
  });
  return split;
}

/**
 * Creates a list of unique pairs from a list of division names
 *
 * @param {Array<string>} divNames a list of division names
 * @return {Array<Array<string>>} An array of unique pairs
 * @customfunction
 */
function getUniqueDivisionPairs(divNames) {
  const pairs = [];
  for (let i = 0; i < divNames.length; i++) {
    for (let j = i + 1; j < divNames.length; j++) {
      pairs.push([divNames[i], divNames[j]]);
    }
  }
  return pairs;
}

/**
 * Determines the number of unique Conferences and how many Divisions in each
 *
 * @param {Array<Array<string>>} entrants A range of data with columns for Conference, Division, and Entrant (in that order)
 * @return {Array<Array<string|number>>} An array of counts, in the format [ Conference, Number of Divisions ]
 * @customfunction
 */
function determineLeagueStructure(entrants) {

  const failedProc = -1;

  if (!entrants || entrants.length === 0) {
    return failedProc;
  }

  var confBreakdown = {};

  for (let i = 0; i < entrants.length; i++) {
    var row = entrants[i];
    var cnf = row[0];
    var div = row[1];

    if (cnf) {
      if(!confBreakdown[cnf]) {
        confBreakdown[cnf] = new Set();
      }
      confBreakdown[cnf].add(div);
    }

  }

  var result = [ [ 'Conference', 'NumDivisions' ] ];
  for (const conf in confBreakdown) {
    if (confBreakdown.hasOwnProperty(conf)) {
      let numDivs = confBreakdown[conf].size;
      result.push([ conf, numDivs ]);
    }
  }
  return result;

}

/**
 * Calculates the total number of divisions from the breakdown.
 *
 * @param {Array<Array<string>>} breakdown An array returned by function determineLeagueStructure.
 * @return {number} The total number of divisions.
 * @customfunction
 */
function getTotalDivisions(breakdown) {
  let totalDivisions = 0;

  // The first row is the header, so we can skip it.
  const dataRows = breakdown.slice(1);

  // Loop through each row and add the number of divisions.
  for (let i = 0; i < dataRows.length; i++) {
    var numDivisions = parseInt(dataRows[i][1]);
    var n = parseInt(dataRows[Math.max(0,i-1)][1]);

    if (!isNaN(numDivisions)) {
      totalDivisions += numDivisions;
    }

    if (n !== numDivisions) {
      return -1;    // unequal number of divisions in conferences
    }

  }

  return totalDivisions;
}