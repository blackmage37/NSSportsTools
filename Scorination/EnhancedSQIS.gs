// MASTER SCRIPT FOR HANDLING SQIS-BASED SCORINATION WITH MORE DETAIL

function testevents() {

x = generateMatchEvents(1,'Team A', 'Team B', 3, 2, 50, 40);

return x;

}

function generateAllMatchEvents(leagueResults) {

  // leagueResults should be an array of results
  // homeTeam, awayTeam, homeScore, awayScore, homeRank, awayRank, extraTime (bool), hET (optional), aET (optional)

  let allMatchEvents = [];

  // loop through the leagueResults array and run generateMatchEvents for each one
  // concat the output into allMatchEvents, vertically

}

function generateMatchEvents(matchId, homeTeam, awayTeam, homeScore, awayScore, homeRank, awayRank, extraTime, hET, aET) {

  // score values should be after 90 minutes
  // if the match went to extra time, we need extra score details
  // this routine does not handle penalties

  // generate a match identifier, just in case we need it later
  matchString = 'match ID ' & matchId & ': ' & homeTeam & '  ' & homeScore & '-' & awayScore & '  ' & awayTeam;

  // output object
  let matchEvents = [];

  // initialise global vars
  hRnk = 0; aRnk = 0;   // team ranks
  h90  = 0; a90  = 0;   // scores after 90 mins
  hSc  = 0; aSc  = 0;   // final scores (may be different due to ET)
  cET = false;          // was there extra time?

  // scores are necessary; if we don't have them, return an empty matchEvent array
  if(homeScore === undefined || awayScore === undefined) {
    return [ matchId, 0, '', 'no data for ' &  matchString ];
  }

  h90 = homeScore;
  a90 = awayScore;

  // if extraTime is not specified TRUE assume FALSE
  if(!extraTime === true) { 
      hSc = homeScore;
      aSc = awayScore;
      cET = true; 
  } else if (extraTime == true) {
    hSc = hET;
    aSc = aET;
  }

  // if ranks are missing, assume they're equal 
  if(homeScore === undefined) { hRnk = 1; } else { hRnk = homeRank; }
  if(awayScore === undefined) { aRnk = 1; } else { aRnk = awayRank; }

  // get the ratio between ranks
  var rankRatio = hRnk > aRnk ? hRnk / aRnk : 1 / (hRnk/aRnk);

  // generate starting lineups into arrays; start with GK at position 1, etc
    // lineupNumber, playerName, squadNumber
    // i.e. [ 1, SumGoy, 12 ] would mean the starting goalkeeper is squad #12

  // create array of "attacks" for each team
  // extra time needs to be done separately (see below)  
  let numAttacks = getSetting('baseAttacks');
  arr1 = [];
  arr2 = [];

  // randomly select which attacks the goals occurred on
  // sort ascending
  gls1 = uniqueRandsCapped(numAttacks,h90).sort((a,b) => a - b);
  gls2 = uniqueRandsCapped(numAttacks,a90).sort((a,b) => a - b);

  for (i = 0; i < numAttacks; i++) {
    // team 1
    if(i == gls1[0]) { 
      arr1.push('G');
      gls1.shift();
    } else {
      arr1.push('X');
    }
    // team 2
    if(i == gls2[0]) { 
      arr2.push('G');
      gls2.shift();
    } else {
      arr2.push('X');
    }
  }

  // initialise array for all match events
  // minute, eventType, player, team
  var team1start = Math.random() <= 0.5 ? 1 : 0;
  var team1poss = team1start;
  var currentSecs = 0;

  // no team has a numerical advantage
  // set to 1 if 2 gets a man sent off, etc
  var manAdv = 0;

  // "minute by minute" loop
  let t = 0;                // the total time elapsed in the match, in seconds
  for(i = 0; i < 2*numAttacks; i++) {

    // which attack cycle is this
    let j = Math.floor(i/2);

    // get the event outcome for the team in possession
    let outcome = team1poss ? arr1[j] : arr2[j];

    // team definers
    let team = team1start * team1poss ? homeTeam : awayTeam;
    let oppTeam = team1start * team1poss ? awayTeam : homeTeam;

    // add a random number of seconds between 5 and ((90/(2*base number of attacks)) * 60) 
    let maxTime = ((90/(2*numAttacks)) * 60);
    let sec = randBetween(5, maxTime);
    t = t + sec;

    // add a random number of completed passes between (sec/4) and (sec/8)
    // this should average out to 1 pass every 6 seconds, which is in line
    // with the average number of total passes in a premier league match
    let minPass = Math.floor(sec/8);
    let maxPass = Math.floor(sec/4);
    let passes = randBetween(minPass,maxPass);

    // increase the number of passes if the team has a man advantage
    if(team1poss) {
      passes = manAdv == 1 ? passes * 1.2 : passes;
    } else {
      passes = manAdv == 2 ? passes * 1.2 : passes;
    }
    
    // calculate seconds per pass based on the above
    let secPerPass = Math.floor(sec/passes);

    // loop and create a "pass completed" event for each pass, incrementing the timer as appropriate
    for(i = 0; i < passes; i++) {
      let player = 'Random player';
      currentSecs = currentSecs + secPerPass;
      let thisMin = Math.floor(currentSecs/60) + 1;
      let passEvent = [ matchId, thisMin, 'PC', player, team ];
      matchEvents.push(passEvent);
    }

    // if goal:
    if(outcome == 'G') {
      let scorer = 'Random player';
      let assister = 'Random player';

      let team = team1start * team1poss ? homeTeam : awayTeam;
      let thisMin = Math.floor(t/60) + 1; 

      // select goalscorer and assister from team array based on weightings
      let goalEvent = [ matchId, thisMin, 'GL', scorer, team ];
      let assistEvent = [ matchId, thisMin, 'AS', assister, team ];
      
      matchEvents.push(goalEvent);
      matchEvents.push(assistEvent);

    } else {
      // if injury (2% chance)
      if(Math.random() <= 0.02) {
        // make a sub (replace the value in the array)
        let player = 'Random player';
        let sub = 'Bench player';
        
        let thisMin = Math.floor(t/60) + 1;
        let subOffEvent = [ matchId, thisMin, 'OF', player, team ];
        let subOnEvent = [ matchId, thisMin, 'ON', sub, oppTeam ];

        matchEvents.push(subOffEvent);
        matchEvents.push(subOnEvent);

        // add a booking (10% of injuries result in a booking)
        if(Math.random() <= 0.1) {
          let player = 'Random player';
          let thisMin = Math.floor(t/60) + 1; 

          // if player booked is already in cards array, send them off
          // if player is sent off, set manAdv flag
          // this will increase passes completed by opposition from this point on
          if(cards.includes(player)) {
            // remove player from relevant team lineup array
            
              /* do code here */
            let y2Event = [ matchId, thisMin, 'Y2', player, oppTeam ];
            matchEvents.push(y2Event);
            // set manAdv flag
            manAdv = team1start * team1poss ? 2 : 1;
          } else {
            let ycEvent = [ matchId, thisMin, 'YC', player, oppTeam ];
            matchEvents.push(ycEvent);
          }
        } else {
          // also check for a straight red (2% chance)
          if(Math.random() > 0.98) {
            let player = 'Random player';
            let thisMin = Math.floor(t/60) + 1; 
            let rcEvent = [ matchId, thisMin, 'RC', player, oppTeam ];
            matchEvents.push(rcEvent);
          }
        }
      }

    // all other outcomes:
    let thisMin = Math.floor(t/60) + 1; 
    
    // add a failed pass for the team in possession
    let player = 'Random player';
    let pfEvent = [ matchId, thisMin, 'PF', player, team ];
    matchEvents.push(pfEvent);
    
    // add at least one tackle or INT for opposition
    let opp = 'Random player';
    let oeType = Math.random() > 0.7 ? 'IN' : 'TK';
    let oppEvent = [ matchId, thisMin, oeType, opp, oppTeam ];
    matchEvents.push(oppEvent);

    }

    // switch possession
    team1poss = !team1poss;
  }

  // extra time loop, if needed
  // same as above but the minutes start higher

  // return the array of matchEvents
  return matchEvents;

}