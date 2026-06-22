function scoreMatch(team1rank, team2rank, homeAdv) {

  // get win threshold, goal points and snitch points as defined in settings
  var winPts = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('winPts').getValue() || 100;
  var goalPts = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('goalPts').getValue() || 10;
  var snitchPts = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('snitchPts').getValue() || 30;

  var loopTime = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('loopTime').getValue() || 3;
  var maxAttacks = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('snitchPts').getValue() || 30;

  // are ties allowed?
  var allowTie = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('allowTies').getValue();

  // threshold floor
  var pFloor = 0.05;      // always at least 5% chance of a goal

  // debug with default variables
  team1rank = team1rank || 1;
  team2rank = team2rank || 1;
  homeAdv = homeAdv || 0;
  let firstCatch = 0;

  // start at -1 so loop one is indexed as zero
  // this means if settings allow for the game to end in loop one
  // the finish time will be shorter than "mins per loop"
  // otherwise this would be impossible
  var timeMin = -1;
  var start = 0;
  
  var g1 = 4; var g2 = 0;       // goals count
  var c1 = 0; var c2 = 0;       // catch count

  // points counters
  var pts1 = 0; var pts2 = 0; var maxPts = 0;

  // coin flip for first attempt
  if (Math.random > 0.5) {
    start = 1;
  }

  // 33% home advantage
  var hAdv = homeAdv ? 4/3 : 1;

  // calculate pCatch for each team based on ranks
  var pc1 = pCatch(team1rank,team2rank)*hAdv;
  var pc2 = pCatch(team2rank,team1rank)*hAdv;

  // calculate pGoal for each team based on ranks
  var pg1 = 0.1 + (pScore(team1rank,team2rank)*hAdv);
  var pg2 = 0.1 + (pScore(team2rank,team1rank)*hAdv);

  // alternate snitch capture attempts between teams until someone reaches winPts
  // or max attacks is reached
  // but both teams get an opportunity to score a goal on each cycle
  do {

    // do goal checks first
    if (Math.random() < pg1) { 
      if (g1 < 30) {
        g1++  
      }
    }

    if (Math.random() < pg2) { 
      if (g2 < 30) {
        g2++ 
      }
    }
    
    // now check for snitch capture
    if(start) {
      if(timeMin % 2 === 0) {
        // team 1 starts
        if (Math.random() < pc1) {
          if (c1 == 0 && firstCatch == 0) { firstCatch = 1; }
          c1++
        }
      } else {
        // team 2 starts
        if (Math.random() < pc2) {
          if (c2 == 0 && firstCatch == 0) { firstCatch = 2; }
          c2++
        }
      }
    } else {
      if(timeMin % 2 === 0) {
        // team 2 starts
        if (Math.random() < pc2) {
          if (c2 == 0 && firstCatch == 0) { firstCatch = 2; }
          c2++
        }
      } else {
        // team 1 starts
        if (Math.random() < pc1) {
          if (c1 == 0 && firstCatch == 0) { firstCatch = 1; }
          c1++
        }
      } 
    }
    pts1 = (goalPts * g1) + (snitchPts * c1);
    pts2 = (goalPts * g2) + (snitchPts * c2);
    maxPts = Math.max(pts1, pts2);

    timeMin++
  }
  while (maxPts < winPts && timeMin < maxAttacks);

  // if ties aren't allowed, we need to check for a tie and break it
  // first lets give both teams extra goalPts per snitch capture
  if (!allowTie && pts1 == pts2) {
    pts1 = pts1 + (c1 * goalPts);
    pts2 = pts2 + (c2 * goalPts);
  }

  // if still tied, subtract goalPts from the team that didn't catch the snitch first
  if (!allowTie && pts1 == pts2) {
    if (firstCatch == 1) {
      pts2 -= goalPts;
    } else if (firstCatch == 2) {
      pts1 -= goalPts;
    } else {
      if (Math.random() < 0.5) {
        pts1 -= goalPts;               // if neither side caught the snitch, flip a coin
      }
    }
  }

  // if both scores are now equal to or higher than winPts, we need to reduce one to (winPts - goalPts)
  if (pts1 >= winPts && pts2 >= winPts) {
    if (pts1 == pts2) {
      if (c1 == c2) {
        if (Math.random() >= 0.5) { 
          pts1 = winPts - goalPts;
        } else {
          pts2 = winPts - goalPts;
        }
      } else if (c1 > c2) {
        pts2 = winPts - goalPts;
      } else {
        pts1 = winPts - goalPts;
      }
    }
    if (pts1 > pts2) {
      pts2 = winPts - goalPts;
    } else {
      pts1 = winPts - goalPts;
    }
  }

  // if the larger score is greater than (winPts + snitchPoints - goalPts)
  // that needs to be reduced, as this shouldn't be a possible score
  maxPts = Math.max(pts1, pts2);
  if (maxPts > (winPts+snitchPts-goalPts)) {
    if (pts1 > pts2) {
      pts1 = winPts+snitchPts-goalPts;
    } else {
      pts2 = winPts+snitchPts-goalPts;
    }
  }

  // game length cannot exceed maxAttacks, but should always be a viable length
  // so calculate the smallest number of loops to reach the maxPts value
  // which is basically how many times do you need to catch the snitch to reach maxPts, rounded up
  var minLoops = Math.ceil(maxPts/snitchPts);
  timeMin = Math.max(minLoops,Math.min(timeMin, maxAttacks))
  
  // output number of "minutes" the capture took; assuming each loop is 3 minutes
  // and add a random number of seconds to the timer, unless timeMin = maxAttacks
  let secs = timeMin == maxAttacks ? 0 : Math.floor(Math.random() * (59 - 1) + 1);
  var strTime = padNum(timeMin*loopTime, 2, '0') + ':' + padNum(secs, 2, '0');

  // output results array
  var output = [ [c1, pts1, strTime ], [ c2, pts2 ] ]
  return output;

}

function pCatch(rank,opprank) {

  // get base threshold from the settings sheet
  var styleVar = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('baseCatchThreshold').getValue();
  //var ratioVar = styleVar / 5;
  var ratioVar = styleVar * 1.093;

  var high = rank >= opprank ? 1 : -1;
    var ratio = rank + opprank <= 0 ? 1 : Math.max(1, Math.min(rank,opprank))/Math.max(rank,opprank,1);
  // note the above ensures that min and max rank are always at least 1
  // this avoids DIV/0 errors and ensures that a ratio is still applied if a zero rank team faces a ranked team
  
  // cap chance of snitch capture at 50%, but floor it at 5%
  var catchRatio = Math.max(Math.min((styleVar+(ratioVar-ratioVar*ratio)*high), 0.5), 0.05);

  return catchRatio;

}

function pScore(rank,opprank) {

  // get base threshold from the settings sheet
  var styleVar = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('baseThreshold').getValue();
  var ratioVar = styleVar / 5;

  var high = rank >= opprank ? 1 : -1;
  var ratio = rank + opprank <= 0 ? 1 : Math.max(1, Math.min(rank,opprank))/Math.max(rank,opprank,1);
  // note the above ensures that min and max rank are always at least 1
  // this avoids DIV/0 errors and ensures that a ratio is still applied if a zero rank team faces a ranked team
  
  return (styleVar+(ratioVar-ratioVar*ratio)*high);

}

function checkScore(rank,opprank,baseThreshold) {

  var ratioVar = baseThreshold / 5;

  var high = rank >= opprank ? 1 : -1;
  var ratio = rank + opprank <= 0 ? 1 : Math.max(0.01, Math.min(rank,opprank))/Math.max(rank,opprank,0.01);
  // note the above ensures that min and max rank are always at least 1
  // this avoids DIV/0 errors and ensures that a ratio is still applied if a zero rank team faces a ranked team
  
  return (baseThreshold+(ratioVar-ratioVar*ratio)*high);

}

function checkCatch(rank,opprank,baseThreshold) {

  var ratioVar = baseThreshold * 1.093;

  var high = rank >= opprank ? 1 : -1;
  var ratio = rank + opprank <= 0 ? 1 : Math.max(0.01, Math.min(rank,opprank))/Math.max(rank,opprank,0.01);
  // note the above ensures that min and max rank are always at least 0.01
  // this avoids DIV/0 errors and ensures that a ratio is still applied if a zero rank team faces a ranked team
  
  // cap chance of snitch capture at 50%, but floor it at 5%
  var catchRatio = Math.max(Math.min((baseThreshold+(ratioVar-ratioVar*ratio)*high), 0.5), 0.05);

  return catchRatio;

}