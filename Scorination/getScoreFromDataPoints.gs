function getScoreFromDataPoints(dataPointsTable, skillValue, eventCode) {
  
  // check the datapoints table range is valid
  if (!dataPointsTable.map) return -1; 
  
  // set skillValue to a random value if not populated
  if (skillValue === undefined) {
    skillValue = Math.random();
  }

  // initialise variables for later
  var base = 0; var baseScore = 0;
  var best = 0; var bestScore = 0;
  var ratio = 0;          // how far between base and best is skillValue
  var diff = 0;           // difference between base and best scores
  var mod = 0;            // the change to apply to the base score

  // find the two closest datapoints to skillValue
  // lookup is always first column
  // the score is determined by the eventCode
  let eventCol = 0;
  for (i = 1; i < dataPointsTable[0].length; i++) {
    if (dataPointsTable[0][i] == eventCode) {
      eventCol = i;
    }
  }
  // set eventCol to 1 if it hasn't been set
  // we're assuming the second column is the score
  eventCol = eventCol == 0 ? 1 : eventCol;

  // start loop at 1 because we want to ignore the headers
  for (i = 1; i < dataPointsTable.length; i++) {
    if (dataPointsTable[i][eventCol] !== "") {
      if (dataPointsTable[i][0] <= skillValue) {
        base = dataPointsTable[i][0];
        baseScore = dataPointsTable[i][eventCol];
      }
    }
  }

  for (i = dataPointsTable.length - 1; i >= 1; i--) {
    if (dataPointsTable[i][eventCol] !== "") {
      if (dataPointsTable[i][0] > skillValue) {
        best = dataPointsTable[i][0];
        bestScore = dataPointsTable[i][eventCol];
      }
    }
  }

  // calculate ratio and diff
  ratio = (skillValue - base) / (best - base);
  diff = Math.abs(bestScore - baseScore);

  // calculate modifier
  mod = ratio * diff;

  // apply the modifier, depending on which value is larger
  // this lets us determine whether or not a bigger result = better
  let result = base > best ? baseScore + mod : baseScore - mod;

  return result;

}