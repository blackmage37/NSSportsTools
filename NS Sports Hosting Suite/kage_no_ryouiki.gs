function simulateKNRSeason(rangeOfTeams, numberOfMatchdays) {
  
  // scorinate a full Kage no Ryouiki style season
  // if no specified number of matchdays is given, a function will simulate the Bleeding of the Light to determine it
  var seasonLength = 0;
  seasonLength = numberOfMatchdays === undefined ? simulateBleedingOfTheLight() : numberOfMatchdays;

  
}

function knrScorinate() {
  
  // scorinates results, generating the additional values required for Performance Score and Matchday Bonus Points
  // team, result, win margin, fouls conceded, possession%, bookings, earliest goal minute, latest goal minute

}

function awardMatchdayPoints(rangeOfResults) {

  // expects an array of team, result, win margin, fouls conceded, possession%, bookings, earliest goal minute, latest goal minute

  // calculate performance score for every team

  // rank by performance score, award matchday points
    // in order: 20, 15, 12, 10, 7, 4, 2

  // identify bonus point awards

  // return team, matchday points

}

function performanceScore(resultWeight, scoreModifier, aggressionValue) {
  // a composite score to determine the impressiveness of a result

  let resultMultiplier = 4;
  let scoreMultiplier = 2;
  let aggressionMultiplier = 1;

  return (resultMultiplier * resultWeight) + (scoreMultiplier * scoreModifier) + (aggressionMultiplier * aggressionValue);
}

function xWin(rank, oppRank) {
  // calculates xWin (based on Elo formula)
  return 1/(1+10^(oppRank-rank)/400);
}

function resultWeight(xWin) {
  // just 1/xWin
  // additional check to make sure we don't have a divide by zero error
  // Math.abs should handle any incidents where we have a negative value, though that should be impossible anyway
  let r = xWin === 0 ? 0 : 1/Math.abs(xWin);
  return r;
}

function scoreModifier(goalsScored, goalsConceded) {
  // (Goals Scored - Goals Conceded) / ( (Goals Scored x 0.5 ) / (Goals Conceded + 1) )
  // Designed to better reward winning with fewer goals conceded when win margin is equal
  // or when scoring more goals in a loss
  return (goalsScored - goalsConceded) + ((goalsScored * 0.5)/(goalsConceded +1));
}

function fMoop(foulsConceded, possessionPercent) {
  // f/moop: Fouls per minute out of possession
  // a measure of a team's aggression which doesn't penalise high possession sides
  return foulsConceded / (90 * (1 - possessionPercent));
}

function disciplinaryPoints(yellows, secondYellows, straightReds, greens) {
  // straight red counts separate from second yellows
  // 1pt for a yellow, 2pts for a second yellow, 5pts for a straight red
  let yellowPts = 1;
  let secondYellowPts = 2;
  let straightRedPts = 5;
  let greenPts = -5;

  // default all card values to zero if no number passed
  yellows = yellows === undefined ? 0 : yellows;
  secondYellows = secondYellows === undefined ? 0 : secondYellows;
  straightReds = straightReds === undefined ? 0 : straightReds;
  greens = greens === undefined ? 0 : greens;

  return (yellows * yellowPts) + (secondYellows * secondYellowPts) + (straightReds * straightRedPts) + (greens * greenPts);
} 

function aggressionValue(fMoop, disciplinaryPoints) {
  // designed to reward aggressive play that doesn't draw bookings 
  // f/moop / (Disciplinary Points + 1)
  return fMoop / (disciplinaryPoints + 1);
}

function simulateBleedingOfTheLight() {
  // selects a random number between 50-60 weeks
  // this is the time to the next occurrence of The Longest Night
  // subtract 14 to get number of matchdays in the current season
  // Playoff Day takes place 2 weeks after The Longest Night, and there is a 12 week gap from playoff day to next season start
  let min = 50; 
  let max = 60;
  return randBetween(min, max);
}