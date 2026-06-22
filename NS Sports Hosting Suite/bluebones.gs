/**
 * Implements the "bluebones" fixture algorithm (https://bluebones.net/2005/05/generating-fixture-lists/) on a list of entrants. Note that the script has naturally occurring "complementary teams". i.e. Teams 1 and (n/2) + 1, 2 and (n/2) + 2, ... etc in the list will never both be designated as home teams on the same matchday.
 *
 * @param {Array<string>} rangeOfEntrants A range containing entrant names ONLY
 * @param {number} numberOfRoundsRobin The number of times entrants face each other
 * @param {boolean} includeMatchday If true, the matchday number will appear in the first column
 * @return An array of fixtures
 * @customfunction
 */
function bluebonesFixtures(rangeOfEntrants, numberOfRoundsRobin, includeMatchday) {

  // default to double round robin, and leave matchday out
  const defaultLoops = 2;
  showMatchday = includeMatchday === undefined ? false : includeMatchday;
  
  // get the number of entrants and how many times they play each other
  numberEntrants = rangeOfEntrants.length;
  numberLoops = numberOfRoundsRobin === undefined ? defaultLoops : numberOfRoundsRobin;
  
  // if odd number of players add a "ghost"
  let ghost = false
  if (numberEntrants % 2 == 1) {
    let ghostEntrant = [ 'BYE' ];         // may need to change this label
    rangeOfEntrants.push(ghostEntrant);
    numberEntrants += 1;
    ghost = true;
  }

  // generate the fixtures using the cyclic algorithm
  let totalRounds = numberEntrants - 1;
  let matchesPerRound = numberEntrants / 2;
  let rounds = {};
  let mdCount = 1;

  for (let round = 0; round < totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      let home = (round + match) % (numberEntrants - 1);
      let away = (numberEntrants - 1 - match + round) % (numberEntrants - 1);
      // last entrant stays in the same place while the others rotate around it.
      if (match == 0) {
        away = numberEntrants - 1;
      }
      if (!rounds[round]) rounds[round] = {}
      rounds[round][match] = rangeOfEntrants[home] + " v " + rangeOfEntrants[away];
    }
    mdCount++;
  }

  // interleave so that home and away matchups are fairly evenly dispersed.
  let interleaved = {};

  let evn = 0;
  let odd = (numberEntrants / 2);
  for (let i = 0; i < totalRounds; i++) {
    if (i % 2 == 0) {
      interleaved[i] = rounds[evn++];
    } else {
      interleaved[i] = rounds[odd++];
    }
  }

  rounds = interleaved;

  // last entrant can't be away for every game so flip them to home on odd rounds.
  for (let round = 0; round < totalRounds; round++) {
    if (round % 2 == 1) {
      rounds[round][0] = flip(rounds[round][0]);
    }
  }

  // split the generated fixtures by " v " into two "columns" and return that array
  var rounds2 = [];
  for(i = 0; i < totalRounds; i++) {
    for(j = 0; j < matchesPerRound; j++) {
        let fixture = rounds[i][j];
        rounds2.push(fixture.split(" v "))
    }
  }

  let baseLoopOdd = rounds2;
  // invert the order of participants for the even loop
  let baseLoopEven = [];
  for(i = 0; i < rounds2.length; i++) {
    baseLoopEven.push( [ rounds2[i][1], rounds2[i][0] ] );
  }

  // invert fixtures for subsequent loops and push to rounds2
  for(i = 2; i <= numberLoops; i++) {
    if(i % 2 == 0) {
      rounds2 = rounds2.concat(baseLoopEven);
    }
    if(i % 2 == 1) {
      rounds2 = rounds2.concat(baseLoopOdd);
    }
  }

  // add matchdays if needed
  let output = [];
  if (showMatchday) {
    let mdNum = 1;
    let mdGameCount = 0;
    for (let i = 0; i < rounds2.length; i++) {
      output.push( [ mdNum, rounds2[i][0], rounds2[i][1] ] );
      mdGameCount++;
      if (mdGameCount == matchesPerRound) { 
        mdNum++; 
        mdGameCount = 0;
      }
    }
    return output;
  } else {
    return rounds2;
  }
  
}