/**
 * Normalises a list of ranks against a reference min and max value. Useful for keeping ranks within a set range (e.g. 40-100 for domestic league scorination)
 *
 * @param {Array<Array<string|number>>} rangeOfEntrants An array of arrays containing ranks and other data
 * @param {number} rankColumn the index of the column containing the rank to be sorted (zero-indexed) 
 * @param {boolean} sortAscending if true, start with the lowest numerical rank
 * @return A list of equal length to the original, containing the elements sorted by rank, in the direction specified
 * @customfunction
 */
function sortRanks(rangeOfEntrants, rankColumn, sortAscending) {
  return rangeOfEntrants.sort((rowA, rowB) => {
    const valA = rowA[rankColumn];
    const valB = rowB[rankColumn];

    // If ascending, we want (A - B). If descending, we want (B - A).
    // This logic handles numeric ranks perfectly.
    if (valA < valB) return sortAscending ? -1 : 1;
    if (valA > valB) return sortAscending ? 1 : -1;
    return 0;
  });
}

/**
 * Normalises a list of ranks against a reference min and max value. Useful for keeping ranks within a set range (e.g. 40-100 for domestic league scorination)
 *
 * @param {Array<number>} rangeOfRanks A list of Ranks (numeric). ONE column only.
 * @param {number} newMaxRank The new upper limit for the ranks
 * @param {number} newMinRank The new lower limit for the ranks  
 * @return A list of equal length to the original, containing the normalised rank values
 * @customfunction
 */
function rankNormaliser(rangeOfRanks, newMaxRank, newMinRank) {

  // default to 0-1 range (like xkoranate) if no min/max passed
  a = newMinRank === undefined ? 0 : newMinRank;
  b = newMaxRank === undefined ? 1 : newMaxRank;

  // check to make sure max > min
  if (a >= b) {
    return [ ['Invalid Input'], ['Min new rank value'], ['must be smaller than'], [ 'max new rank value'] ];
  }

  // check the length of the range of ranks
  // if not at least two teams, there is no comparison point
  // and the ranks cannot be normalised
  if (rangeOfRanks.length < 2) {
    return [ ['Invalid Input'], ['Needs at least'], ['two ranks to be'], [ 'normalised'] ];
  }

  var normalisedRanks = [];

  var min = Math.min(...rangeOfRanks);
  var max = Math.max(...rangeOfRanks);

  for (var i = 0; i < rangeOfRanks.length; i++) {
    var rank = rangeOfRanks[i];
    var newRank = (((b-a)*(rank-min))/(max-min))+a;
    normalisedRanks.push(newRank);
  }

  return normalisedRanks;
  
}

/**
 * Performs a number of analytical functions (median, mean, standard deviation, geometric mean etc) on a range of ranks, and returns the results
 *
 * @param {Array<number>} ranks A range of ranks
 * @return {Array<Array<string>>} The results of the analysis
 * @customfunction
 */
function analyseRanks(ranks) {
  // provide the median, mean, and standard deviation
  // also geometric mean and maybe some other analytical functions
  // highlight how many ranks are outside 2 StDev
  // because this might skew outcomes?
}

/**
 * Estimates the probability of each result in a number of scorination algorithms for two ranks
 *
 * @param {number} rank1 the rank of the first team
 * @param {number} rank2 the rank of the second team
 * @return {Array<Array<string>>} a matrix of probabilities
 * @customfunction
 */
function estimateProbabilities(rank1, rank2) {
  // simulate percentage of chances of win/draw/loss in each of the football algorithms?
}