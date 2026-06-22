function scorinateCallistean() {
  // runs a scorination algorithm but also returns additional information
  // like goal minutes, and "style points"

  // output object: { team1Score, team2Score, goals: { minute, team } }

}

function generateStylePoints(result) {
  // takes a result and generates applicable "style points" for both teams

  // add fields for style points to the result object
  result.team1stylePts = 0;
  result.team2stylePts = 0;

  // the following things increase the chances of a style point:
    // scoring more goals: sigmoid function
    let singleGoalStyleChance = 0.15;
    let tenGoalsStyleChance = 0.9;
    // winning with a clean sheet: flat rate increase
    let cleanSheetStyleChance = 0.125;
    // losing by 1 goal: flat rate increase
    let narrowLossStyleChance = 0.075;

  // use above values to get chance based on number of goals per team. zero goals = zero chance.
  let t1goalStyle = result.team1score === 0 ? 0 : goalStylePointChance(singleGoalStyleChance, tenGoalsStyleChance, result.team1score);
  let t2goalStyle = result.team2score === 0 ? 0 : goalStylePointChance(singleGoalStyleChance, tenGoalsStyleChance, result.team2score);

  // apply flat rate adjustments if applicable
  if (result.team2score === 0) { t1goalStyle += cleanSheetStyleChance; }
  if (result.team1score === 0) { t2goalStyle += cleanSheetStyleChance; }
  
  if (result.team2score - result.team1score === 1) { t1goalStyle += narrowLossStyleChance; }
  if (result.team1score - result.team2score === 1) { t2goalStyle += narrowLossStyleChance; }

  // check rand against the probabilities
  let r1 = Math.random();
  let r2 = Math.random();

  if (r1 <= t1goalStyle) { result.team1stylePts = 1; }
  if (r2 <= t2goalStyle) { result.team2stylePts = 1; }

  // return modified result object
  return result;

}

function generateCallisteanTable(resultsData) {
  
  // expects scorelines and "style points"
  // style points will be ignored if not present

  // unorthodox point allocation
  let winPts = 3;
  let drawPts = 1;
  let goallessDrawPts = -1;

  // parse results out, and assign points accordingly

}

/**
 * Calculates the probability of a goal triggering a style point award
 * using a sigmoid function and pre-calculated parameters.
 *
 * @param {number} floorChance The probability of a single goal triggering a style point
 * @param {number} ceilingChance The probability that one of ten goals will trigger a style point
 * @param {number} goalsScored The total number of goals scored
 * @param {number} modifier (Optional) a number representing RP bonus, which provides a scaled boost to probability. Defaults to zero.
 * @return {number} The probability of a style point (from 0 to 1).
 * @customfunction
 */
function goalStylePointChance(floorChance, ceilingChance, numberOfGoals, modifier = 0) {

  // apply logarithmic scale to modifier value
  // add 1 so a modifier of 0 results in zero boost
  // then apply the modifier to the number of goals before calculating
  const effectiveGoals = numberOfGoals + Math.log(modifier + 1);

  // a sigmoid function to model the chances that a goal will yield a style point
  const sigmoidParams = calculateSigmoidParameters(1, floorChance, 10, ceilingChance);

  return 1 / (1 + Math.exp(-sigmoidParams.k * (effectiveGoals - sigmoidParams.midpoint)));
}