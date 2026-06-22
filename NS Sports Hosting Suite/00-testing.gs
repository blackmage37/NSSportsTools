function tennisTest() {

  let rng = getTennisTestRange(126);
  let bracket = tennisSeeding(rng, true);
  Logger.log(bracket);

}

function testCupRound() {
  let rng = getTestRange(48, true);
  x = drawCupRound(rng, true);
  Logger.log(x);
}

function testVariableSeeds() {
  let rng = getTestRange(48, true);
  x = drawCupRoundVariableSeeds(rng,12,true,0,1,false);
  Logger.log(x);
}

function qusmaTest() {
  let rng = getQusmaTestRange(16);
  let bracket = buildQusmaBracket(rng);
  Logger.log(bracket);

  let rng2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Qusma Seeded Draw').getRange('A21:D36').getValues();
  let bracket2 = buildQusmaBracket(rng2);
  Logger.log(bracket2);
}

function testPagePlayoff() {
  let rng = getTestRange(11, true);
  x = generatePagePlayoffBracket(rng);
  Logger.log(x);
}

function testGroupDraw() {

  let rng = getTestRange(32);
  // seeded group draw
  x = drawGroupStage(rng, 8);
  Logger.log(x);

  // unseeded group draw
  y = drawGroupStage(rng, 8, false);
  Logger.log(y);

}

function testGroupDrawFixedHosts() {

  // two hosts, seeded (32 teams; 8x4)
  let rng = getTestRange(32);
  rng.shift();
  rng.shift();

  let hostRng = getTestRange(2);
  x = drawGroupsFixedHosts(rng, hostRng, 8);
  Logger.log(x);

  // two hosts, unseeded (32 teams; 8x4)
  x2 = drawGroupsFixedHosts(rng, hostRng, 8, false);
  Logger.log(x2);

  // three hosts, seeded (48 teams; 12x4)
  let rng2 = getTestRange(48);
  rng2.shift();
  rng2.shift();
  rng2.shift();
  
  let hostRng2 = getTestRange(3);  
  y = drawGroupsFixedHosts(rng2, hostRng2, 12);
  Logger.log(y);

  // three hosts, unseeded (48 teams; 12x4)
  y2 = drawGroupsFixedHosts(rng2, hostRng2, 12, false);
  Logger.log(y2);


}

function testTiebreakers() {
/*
  let chaotic = chaoticPenaltyShootout();
  Logger.log(chaotic);
*/
  let dataObject = { Osarius: { rank: 10.93, styleMod: 2.00, numberOfPlayers: 10 }, Cobrio: { rank: 19.12, styleMod: 2.50, numberOfPlayers: 11 } };
  x = implementTiebreaker('none', dataObject);
  Logger.log(x);
  
  y = implementTiebreaker('Standard Penalty Shootout', dataObject);
  Logger.log(y);
}

function testRaffle() {
  // build entries object for testing
  let entries = { 
    'Alfie': 25, 
    'Bert': 20, 
    'Charlie': 5 
    }

  // no fractions
  let result = pointRaffle(entries, 24);
  Logger.log(result);

  // no fractions; pot is not a multiple of 8
  let result2 = pointRaffle(entries, 19);
  Logger.log(result2);

  // allow fractions
  let result3 = pointRaffle(entries, 37, true);
  Logger.log(result3);

}

function testStylePoints() {

  // build result object for testing
  let result = {
    team1score: 5,
    team2score: 4,
    goals: {
      11: 1,
      19: 2,
      21: 2,
      24: 1,
      37: 1,
      64: 2,
      77: 2,
      84: 1,
      89: 1
    }
  }
  Logger.log(result);

  result = generateStylePoints(result);
  Logger.log(result);

}

function testDPs() {

  let yellow = 0;
  let secondYellow = 0;
  let straightRed = 0;
  let green = 0;

  // 1 yellow, 1 red: should return 6
  yellow = 1;
  straightRed = 1;
  Logger.log(disciplinaryPoints(yellow, secondYellow, straightRed, green));

  // try again but don't pass any value after yellow. should return 1
  Logger.log(disciplinaryPoints(yellow));

  // one red, one green. should cancel out and return zero
  yellow = 0;
  green = 1;
  Logger.log(disciplinaryPoints(yellow, secondYellow, straightRed, green));

  // atletico levels. should return 13 
  yellow = 6;
  secondYellow = 1;
  green = 0;
  Logger.log(disciplinaryPoints(yellow, secondYellow, straightRed, green));

}

function interDivTest() {
  let rng = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Inter-Conference').getRange('J3:K18').getValues();
  let fixtures = interDivisionSchedule(rng);
  Logger.log(fixtures);
}

function testing_ladder() {

  let rng = getTestRange(10);
  let x = drawLadderMatchups(rng);
  Logger.log(x);

  // test with odd number of teams as well
  let rng2 = getTestRange(13);
  let x2 = drawRoundMatchups(rng2);
  Logger.log(x2);

}

function testPots() {

  let rng = getTestRange(48);

  // test creating a variable number of pots
  const [pot1, pot2, pot3, pot4] = createVariablePots(rng, 4);
  Logger.log(pot1);
  Logger.log(pot2);
  Logger.log(pot3);
  Logger.log(pot4);

  const [potA, potB, potC, potD, potE, potF, potG, potH] = createVariablePots(rng, 8);
  Logger.log(potA);
  Logger.log(potC);
  Logger.log(potE);
  Logger.log(potH);

}
function testPotsOdd() {

  // test variable pots with an odd number of teams
  let rng = getTestRange(45);
  const [pot5, pot6, pot7, pot8] = createVariablePots(rng, 4);
  Logger.log(pot5);
  Logger.log(pot6);
  Logger.log(pot7);
  Logger.log(pot8);

}

function testbb() {

  let rng = getTestRange(10, true);
  let x = bluebonesFixtures(rng, 4, true);
  Logger.log(x);

}

/****************** HELPER FUNCTIONS BELOW THIS LINE ******************/

function getTestRange(numTeams, teamsOnly) {

  var sht = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Entrants');
  var rngAddress = '';

  if (teamsOnly) {
    rngAddress = 'B2:B' + (numTeams + 1);
  } else {
    rngAddress = 'A2:C' + (numTeams + 1);
  }
  var rng = sht.getRange(rngAddress).getValues();
  
  return rng;

}

function getTennisTestRange(numEntrants) {
  
  var sht = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tennis Seeding');
  var rngAddress = 'A3:D' + (numEntrants + 2);
  var rng = sht.getRange(rngAddress).getValues();

  return rng;

}

function getQusmaTestRange(numTeams) {

  var sht = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Qusma Seeded Draw');
  var rngAddress = 'A3:D' + (numTeams + 2);
  var rng = sht.getRange(rngAddress).getValues();

  return rng;

}

function getTestRanks(numTeams) {
  var sht = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Entrants')
  var rngAddress = 'D2:D' + (numTeams + 1);
  var rng = sht.getRange(rngAddress).getValues();

  return rng;
}