// methods for each form of tiebreaker
// all have different calculation methods and prerequisites
function penaltyShootout(rank, oppRank, probabilitySet, showDetail) {
  
  // default setting is 75% chance of scoring on all penalties, flat rate
  
  // MLS/Qusma is 45% chance flat rate.
  
  // xkoranate probability is 65% chance of scoring on all penalties, flat rate
  
  // Cobre probability is 65% on all penalties except:
      // increases to 80% when a goal would win
      // drops to 50% when a miss would lose
  
  // SQIS probability requires team ranks to calculate scoring probability, apparently?

  let probabilities = [ 0.75, 0.75 ];
  let cobreProbability = false;
  probabilitySet = probabilitySet === undefined ? 'default' : probabilitySet;
  probabilitySet.toLowerCase();

  // default no details
  showDetail = showDetail === undefined ? false : showDetail;

  // check for the probability set
  switch (probabilitySet) {
    case 'xkoranate', 'xkora':
      probabilities = [ 0.65, 0.65 ];
      break;
    case 'mls', 'qusma':
      probabilities = [ 0.45, 0.45 ];
      break;
    case 'sqis':
      // temporary. need to adjust this later, probably with a separate function to calculate the correct values
      probabilities = [ 0.65, 0.65 ];   
      break;
    case 'cobre', 'cobrio', 'osarius':
      cobreProbability = true;
      break;
  }

  // initialise variables
  let finished = false;
  let pensLeft = 5;
  let team1 = 0;
  let team2 = 0;
  let detail1 = '';
  let detail2 = '';

  // run the shootout logic
  if (coinFlip() == 'Heads') {

    // team1 goes first
    while(!finished) {

      // check for conditional probability adjustment for win
      if (cobreProbability && team1 + 1 > team2 + pensLeft) { probabilities[0] = 0.8; }

      // simulate first team penalty
      if (Math.random() <= probabilities[0]) { 
        team1++; 
        detail1 += 'O'
      } else {
        detail1 += 'X'
      }

      // check for potential win or loss condition
      if (cobreProbability && team2 + 1 > team1 + pensLeft) { probabilities[1] = 0.8; }
      if (cobreProbability && team1 == team2 + pensLeft + 1) { probabilities[1] = 0.5; }
    
      // simulate second team penalty
      if (Math.random() <= probabilities[1]) { 
        team2++;
        detail2 += 'O'
      } else {
        detail2 += 'X'
      }
      
      // decrement counter
      pensLeft--;

      // check for a decision
      if (team1 > team2 + pensLeft) { finished = true; }
      if (team2 > team1 + pensLeft) { finished = true; }
      if (pensLeft < 1 && team1 !== team2 ) { finished = true; }

    }
  } else {
    // team2 goes first
    while(!finished) {

      // check for conditional probability adjustment for win
      if (cobreProbability && team2 + 1 > team1 + pensLeft) { probabilities[1] = 0.8; }

      // simulate first team penalty
      if (Math.random() <= probabilities[1]) { 
        team2++; 
        detail2 += 'O'
      } else {
        detail2 += 'X'
      }

      // check for potential loss condition
      if (cobreProbability && team1 + 1 > team2 + pensLeft) { probabilities[0] = 0.8; }
      if (cobreProbability && team2 == team1 + pensLeft + 1) { probabilities[0] = 0.5; }
    
      // simulate second team penalty
      if (Math.random() <= probabilities[0]) { 
        team1++;
        detail1 += 'O'
      } else {
        detail1 += 'X'
      }
      
      // decrement counter
      pensLeft--;

      // check for a decision
      if (team1 > team2 + pensLeft) { finished = true; }
      if (team2 > team1 + pensLeft) { finished = true; }
      if (pensLeft < 1 && team1 !== team2 ) { finished = true; }

    }

  }

  if (showDetail) {
    return [ [ team1, team2 ], [ detail1, detail2 ] ]
  } else {
    return [ [ team1, team2 ] ];
  }

}

function imperialShootout() {
  // NASL/MLS style shootout rules
  // base scoring threshold works out to roughly 45% (as per early MLS stats) 
  // adjust based on RP bonus (NOT rank, but pass the values as rank in the data object?)
}

function adgTiebreak() {
  // uses the ADG tiebreak method (http://theadgalternative.com/)
  // higher ranked teams have a better chance of winning
  // base the score probability on rank + style mod?
}

function evilPenaltyShootout() {
  // opposition picks your penalty taker order

  // first penalty is 35% chance
  // increases by 5% up to a maximum of 75% with each subsequent penalty
  // if a goal would win the shootout, boost chances by 20% (up to 80% max)
  // if a miss would lose the shootout, reduce chances by 20% (down to 20% min)

  // coinflip to decide who goes first
  // we need to know the order because decisive attempts change probability
  let firstTeam = coinFlip() == 'Heads' ? 1 : 2;

  var roundCounter = 1;
  var winnerDetermined = false;

  var team1score = 0;
  var team2score = 0;
  
  while (!winnerDetermined) {

    let margin = 0;

    let scoreThreshold = 0.35 + ((roundCounter - 1) * 0.05);
    scoreThreshold = Math.min(0.7, scoreThreshold);

    // simulate attempts
    let r1 = Math.random();
    let r2 = Math.random();

    if(firstTeam == 1) {
    
      // check for decisive penalty first
      let t1 = scoreThreshold;
      if (roundCounter >= 3) {       // can't be decisive before third penalty
        margin = team1score - team2score;
        if (margin == 2 && roundCounter <= 5) { t1 = Math.min(0.8, scoreThreshold + 0.2); }        // if the margin is 2 in round 5 or earlier, the next penalty will win
        if (margin == 1 && roundCounter >= 6) { t1 = Math.min(0.8, scoreThreshold + 0.2); }        // if the margin is 1 in round 6 or later, the next penalty will win
        if (margin == -2 && roundCounter <= 5) { t1 = Math.max(0.2, scoreThreshold - 0.2); }       // if the margin is -2 in round 5 or earlier, the next penalty will lose
        if (margin == -1 && roundCounter >= 6) { t1 = Math.max(0.2, scoreThreshold - 0.2); }       // if the margin is -1 in round 6 or later, the next penalty will lose
      }
    
      // simulate the attempt
      team1score = r1 < t1 ? team1score++ : team1score;
    
    } else {
    
      // check for decisive penalty first
      let t2 = scoreThreshold;
      if (roundCounter >= 3) {       // can't be decisive before third penalty
        margin = team2score - team1score;
        if (margin == 2 && roundCounter <= 5) { t2 = Math.min(0.8, scoreThreshold + 0.2); }        // if the margin is 2 in round 5 or earlier, the next penalty will win
        if (margin == 1 && roundCounter >= 6) { t2 = Math.min(0.8, scoreThreshold + 0.2); }        // if the margin is 1 in round 6 or later, the next penalty will win
        if (margin == -2 && roundCounter <= 5) { t2 = Math.max(0.2, scoreThreshold - 0.2); }       // if the margin is -2 in round 5 or earlier, the next penalty will lose
        if (margin == -1 && roundCounter >= 6) { t2 = Math.max(0.2, scoreThreshold - 0.2); }       // if the margin is -1 in round 6 or later, the next penalty will lose
      }
    
      // simulate the attempt
      team2score = r2 < t2 ? team2score++ : team2score;
    
    }

    // increment the count
    roundCounter++

  }

  return [ [ team1score, team2score ] ]

}

function chaoticPenaltyShootout(playersPerTeam) {
  // penalty taker order is randomised for both teams

  // both teams have the same array of success chances, distributed randomly
  const successArray = [ 75, 70, 65, 65, 60, 55, 50, 45, 40, 35, 30 ];

  // if playersPerTeam < 11, a random value is selected and removed from BOTH teams
  // so the arrays are still identical before being shuffled
  // after everyone has taken a penalty, the array of success chances is shuffled again
  
  var shootoutLength = playersPerTeam === undefined ? 11 : playersPerTeam;
  var roundCounter = 1;
  var winnerDetermined = false;

  var team1success = [...successArray];
  var team2success = [...successArray];

  if (shootoutLength < 11) {
    // select a random value from the success array and remove it
    shuffleArray(team1success);
    let valueToRemove = team1success.pop();
    team2success.splice(team2success.indexOf(valueToRemove), 1);
  }

  // shuffle both success arrays
  shuffleArray(team1success);
  shuffleArray(team2success);

  // initialise scores
  var t1score = 0;
  var t2score = 0;

  // until we determine a winner...
  while (!winnerDetermined) {
    
    let pos = roundCounter % shootoutLength;
    
    // if everyone has taken a penalty, reshuffle the array
    if (pos == 0) {
      shuffleArray(team1success);
      shuffleArray(team2success);
    }

    // simulate the penalties
    let r = Math.random();
    let p1 = team1success[pos]/100;
    t1score = r < p1 ? t1score++ : t1score;

    r = Math.random();
    let p2 = team2success[pos]/100;
    t2score = r < p2 ? t2score++ : t2score;

    // check for winning conditions
    // within the first five penalties, does one team have an unassailable lead?
    if(roundCounter < 5) {
      if(Math.abs(t1score-t2score) > 5 - roundCounter) {
        winnerDetermined = true;
      }
    } else {
    // otherwise are the scores not level?
      if(t1score !== t2score) {
        winnerDetermined = true;
      }
    }
  }

  let output = [ t1score, t2score ]
  return output;

}

function crossbarChallenge(startDistance) {
  
  // no probability advantage for either side
  // teams take turns trying to hit the crossbar from a given distance
  // three attempts each. if nobody hits in three attempts, move 5 yards closer and try again
  // can keep moving closer until 25 yards

  // if one team hits the crossbar, the other team must have had the same number of attempts before the contest can end

  // if no start distance provided, default to 50 yards
  var distance = startDistance === undefined ? 50 : startDistance;

}

function horseTiebreak() {
  // no probability advantage for either side
  // generate two random arrays of five values ( 0.15, 0.3, 0.45, 0.6, 0.75 )
  // shuffle both and interleave them in ABBA order, so array1[0], array2[0], array2[1], array1[1], etc etc
  // these values are now the success threshold for each attempt (both teams)
  // first team to fail five times loses
  // if neither team fails five times in the ten attempts, repeat the array from the beginning until someone does
}

function lagCurling() {
  // no probability advantage for either side
  // generate two random values between 0-50 (non-integers allowed), one for each team
  // closest to 18 gets the point
  // if the number is below 18, it doesn't count; this applies for both
  // do this five times each, then implement sudden death rules if level on score
}

function selectRandomTiebreaker() {
  // selects a random tiebreak method from those listed here
  let tiebreakers = [
          'Standard Penalty Shootout',
          'Imperial Shootout',
          'Evil Penalty Shootout',
          'Chaotic Penalty Shootout',
          'Attacker-Defender-Goalkeeper',
          'Crossbar Challenge',
          'HORSE',
          'Lag Curling'
          ]

  return getRandomElement(tiebreakers);

}

function implementTiebreaker(tiebreakerName, requiredData) {

  // requiredData should be an object
  // For each team: Name, Rank, StyleMod, NumberOfPlayers (e.g. 9 if two players were sent off)
  // for example: { team1: { name: 'Osarius', rank: 10.93, styleMod: 2.00, numberOfPlayers: 10 }, team2: { name: 'Cobrio', rank: 19.12, styleMod: 2.50, numberOfPlayers: 11 } }

  // if no requiredData passed, immediately exit
  if (requiredData === undefined) {
    return 'Required Data Missing';
  }

  // we expect precisely EIGHT fields in the requiredData object
  // Team1 (name), plus 3 sub-fields (rank, style, numPlayers), and the same again for Team2
  if (countAllFields(requiredData) !== 8) {
    return 'Required Data Incorrect Format';
  }

  let tiebreakers = [
          'Standard Penalty Shootout',
          'Standard Penalty Shootout (cobre)',
          'Standard Penalty Shootout (sqis)',
          'Imperial Shootout',
          'Evil Penalty Shootout',
          'Chaotic Penalty Shootout',
          'Attacker-Defender-Goalkeeper',
          'Crossbar Challenge',
          'HORSE',
          'Lag Curling'
          ]

  let result = {};

  // remap the dataobject to allow easier referencing later
  let teamData = Object.keys(requiredData).map(name => {
    return { 
      name: name, 
      ...requiredData[name] // Spread operator copies rank, styleMod, etc.
    };
  });

  // make sure the tiebreaker exists
  if (tiebreakers.indexOf(tiebreakerName) > -1) {
    switch (tiebreakerName) {
      case 'Standard Penalty Shootout':
        result = penaltyShootout(teamData[0].rank, teamData[1].rank, 'default', true);
        break;
      case 'Imperial Shootout':
        break;
      case 'Evil Penalty Shootout':
        break;
      case 'Chaotic Penalty Shootout':
        break;
      case 'Attacker-Defender-Goalkeeper':
        break;
      case 'Crossbar Challenge':
        break;
      case 'HORSE':
        break;
      case 'Lag Curling':
        break;
    }
  } else {
    return 'Invalid tiebreaker name';
  }

  return result;

}