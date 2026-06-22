function foxsalScore(team1rank, team2rank, homeAdv) {
  
  // fatigue penalty
  var percentDecrease = 3;
  var fPen = 1 - (percentDecrease/100);

  // threshold floor
  var pFloor = 0.05;      // always at least 5% chance of a goal

  // debug with default variables
  team1rank = team1rank || 100;
  team2rank = team2rank || 80;
  homeAdv = homeAdv || 0;

  var timeMin = -1;
  var start = 0;

  // failures count
  var f1 = 0;
  var f2 = 0;
  // goals count
  var g1 = 0;
  var g2 = 0;

  // coin flip for first attack
  if (Math.random > 0.5) {
    start = 1;
  }

  // calculate pGoal for each team based on ranks
  var hAdv = homeAdv ? 4/3 : 1;
  var p1 = 0.1 + (calcThreshold(team1rank,team2rank)*hAdv);
  var p2 = 0.1 + (calcThreshold(team2rank,team1rank)*hAdv);

  // alternate between teams until someone scores
  do {
    timeMin++
    if(start) {
      if(timeMin % 2 === 0) {
        // team 1 starts
        if (Math.random() < p1) {
          g1++
        } else {
          f1++
          p1 = Math.max(pFloor, p1 * Math.pow(fPen,Math.max(f1,10)));
        }
      } else {
        // team 2 starts
        if (Math.random() < p2) {
          g2++
        } else {
          f2++
          p2 = Math.max(pFloor, p2 * Math.pow(fPen,Math.max(f2,10)));
        }
      } 
    } else {
      if(timeMin % 2 === 0) {
        // team 2 starts
        if (Math.random() < p2) {
          g2++
        } else {
          f2++
          p2 = Math.max(pFloor, p2 * Math.pow(fPen,Math.max(f2,10)));
        }
      } else {
        // team 1 starts
        if (Math.random() < p1) {
          g1++
        } else {
          f1++
          p1 = Math.max(pFloor, p1 * Math.pow(fPen,Math.max(f1,10)));
        }
      } 
    }
  }
  while (g1 + g2 < 1);

  // each loop is 1 minute, plus rand() seconds in the final loop to determine time of winning goal
  var timeSec = Math.floor(Math.random()*58)+1;
  var strTime = padNum(timeMin, 2, '0') + ':' + padNum(timeSec, 2, '0');
  
  // return array [ [team1, time of goal], [team2] ]
  var output = [ [g1, strTime], g2 ];
  return output;

}

function calcThreshold(rank,opprank) {

  var styleVar = 0.1 // base threshold; not used in this version of the function

  var high = rank >= opprank ? 1 : -1;
  var ratio = rank + opprank <= 0 ? 1 : Math.max(1, Math.min(rank,opprank))/Math.max(rank,opprank,1);
  // note the above ensures that min and max rank are always at least 1
  // this avoids DIV/0 errors and ensures that a ratio is still applied if a zero rank team faces a ranked team
  
  return (0.1+(0.07-0.07*ratio)*high);

}

function calcThresholdWithStyle(rank, opprank, style, oppstyle, styleRange) {

  var styleVar = 0.1
  var styleRange = styleRange || 3;
  var styleRangeNeg = styleRange * -1;

  var high = rank >= opprank ? 1 : -1;
  var ratio = rank + opprank <= 0 ? 1 : Math.max(1, Math.min(rank,opprank))/Math.max(rank,opprank,1);
  // note the above ensures that min and max rank are always at least 1
  // this avoids DIV/0 errors and ensures that a ratio is still applied if a zero rank team faces a ranked team
  
  if(style < styleRangeNeg) { style = styleRangeNeg }
  if(style > styleRange) { style = styleRange }
  if(oppstyle < styleRangeNeg) { oppstyle = styleRangeNeg }
  if(oppstyle > styleRange) { oppstyle = styleRange }

  var styleMod = style + oppstyle;
  styleVar = styleVar + (styleVar * (styleMod/(styleRange * 2)));

  return (styleVar+(0.07-0.07*ratio)*high);

}

function foxsalScoreWithStyle(team1rank, team2rank, team1style, team2style, homeAdv) {
  
  // fatigue penalty
  var percentDecrease = 3;
  var fPen = 1 - (percentDecrease/100);

  // threshold floor
  var pFloor = 0.05;      // always at least 5% chance of a goal

  // debug with default variables
  team1rank = team1rank || 100;
  team2rank = team2rank || 80;
  homeAdv = homeAdv || 0;

  var timeMin = -1;
  var start = 0;

  // failures count
  var f1 = 0;
  var f2 = 0;
  // goals count
  var g1 = 0;
  var g2 = 0;

  // coin flip for first attack
  if (Math.random > 0.5) {
    start = 1;
  }

  // calculate pGoal for each team based on ranks
  var hAdv = homeAdv ? 4/3 : 1;
  var p1 = 0.1 + (calcThresholdWithStyle(team1rank,team2rank,team1style,team2style)*hAdv);
  var p2 = 0.1 + (calcThresholdWithStyle(team2rank,team1rank,team2style,team1style)*hAdv);

  // alternate between teams until someone scores
  do {
    timeMin++
    if(start) {
      if(timeMin % 2 === 0) {
        // team 1 starts
        if (Math.random() < p1) {
          g1++
        } else {
          f1++
          p1 = Math.max(pFloor, p1 * Math.pow(fPen,Math.max(f1,10)));
        }
      } else {
        // team 2 starts
        if (Math.random() < p2) {
          g2++
        } else {
          f2++
          p2 = Math.max(pFloor, p2 * Math.pow(fPen,Math.max(f2,10)));
        }
      } 
    } else {
      if(timeMin % 2 === 0) {
        // team 2 starts
        if (Math.random() < p2) {
          g2++
        } else {
          f2++
          p2 = Math.max(pFloor, p2 * Math.pow(fPen,Math.max(f2,10)));
        }
      } else {
        // team 1 starts
        if (Math.random() < p1) {
          g1++
        } else {
          f1++
          p1 = Math.max(pFloor, p1 * Math.pow(fPen,Math.max(f1,10)));
        }
      } 
    }
  }
  while (g1 + g2 < 1);

  // each loop is 1 minute, plus rand() seconds in the final loop to determine time of winning goal
  var timeSec = Math.floor(Math.random()*58)+1;
  var strTime = padNum(timeMin, 2, '0') + ':' + padNum(timeSec, 2, '0');
  
  // return array [ [team1, time of goal], [team2] ]
  var output = [ [g1, strTime], g2 ];
  return output;

}

function foxsalScoreWithStyle2(team1rank, team2rank, team1style, team2style, homeAdv) {
  
  // fatigue penalty
  var percentDecrease = 3;
  var fPen = 1 - (percentDecrease/100);

  // threshold floor
  var pFloor = 0.05;      // always at least 5% chance of a goal

  // debug with default variables
  team1rank = team1rank || 100;
  team2rank = team2rank || 80;
  homeAdv = homeAdv || 0;

  var timeMin = -1;
  var start = 0;

  // failures count
  var f1 = 0;
  var f2 = 0;
  // goals count
  var g1 = 0;
  var g2 = 0;

  // coin flip for first attack
  if (Math.random > 0.5) {
    start = 1;
  }

  // calculate pGoal for each team based on ranks
  var hAdv = homeAdv ? 4/3 : 1;
  var p1 = 0.1 + (calcThreshold(team1rank,team2rank)*hAdv);
  var p2 = 0.1 + (calcThreshold(team2rank,team1rank)*hAdv);

  // alternate between teams until someone scores
  do {
    timeMin++
    if(start) {
      if(timeMin % 2 === 0) {
        // team 1 starts
        if (Math.random() < p1) {
          g1++
        } else {
          f1++
          p1 = Math.max(pFloor, p1 * Math.pow(fPen,Math.max(f1,10)));
        }
      } else {
        // team 2 starts
        if (Math.random() < p2) {
          g2++
        } else {
          f2++
          p2 = Math.max(pFloor, p2 * Math.pow(fPen,Math.max(f2,10)));
        }
      } 
    } else {
      if(timeMin % 2 === 0) {
        // team 2 starts
        if (Math.random() < p2) {
          g2++
        } else {
          f2++
          p2 = Math.max(pFloor, p2 * Math.pow(fPen,Math.max(f2,10)));
        }
      } else {
        // team 1 starts
        if (Math.random() < p1) {
          g1++
        } else {
          f1++
          p1 = Math.max(pFloor, p1 * Math.pow(fPen,Math.max(f1,10)));
        }
      } 
    }
  }
  while (g1 + g2 < 1);
  
  // apply style modifier adjustment to time of game
  var styleVar = timeMin/3;
  var styleRange = styleRange || 3;
  var styleRangeNeg = styleRange * -1;

  if(team1style < styleRangeNeg) { team1style = styleRangeNeg }
  if(team1style > styleRange) { team1style = styleRange }
  if(team2style < styleRangeNeg) { team2style = styleRangeNeg }
  if(team2style > styleRange) { team2style = styleRange }

  var styleMod = team1style + team2style;
  
  // negative mods don't seem to take much effect sometimes due to the randomness of the scoring algorithm
  // so if the time of game was under 10 minutes add a random number of minutes
  // from 10-timeMin to (-10 * combined style mod)
  
  if (timeMin < 10 && styleMod < 0) {
  
    var minEffect = Math.min(10-timeMin, 0);
    var maxEffect = styleMod * -10;
    var alteration = Math.floor(Math.random()*(maxEffect-minEffect)+minEffect);
  
  } else if (timeMin >= 20 && styleMod > 0) {
  
  // similarly, sometimes high style mods have weirdly long games
  // shorten these when they're longer than 20 minutes
    var minEffect = 0;
    var maxEffect = Math.max(timeMin-1, styleMod * 5);   // don't let it reduce the time to below one minute
    var alteration = Math.floor(Math.random()*(maxEffect-minEffect)+minEffect);
  
  } else {
  
    var minEffect = 0;
    var maxEffect = 0;
    var alteration = Math.floor(Math.random()*(maxEffect-minEffect)+minEffect);
  
  }

  // apply the alteration 
  timeMin = timeMin + alteration;

  // now calculate and apply the style variation; multiply by -1 so negative mods increase the variation
  styleVar = Math.floor(styleVar + (-1 * (styleVar * (styleMod/(styleRange * 2)))));
  timeMin = timeMin + styleVar;

  // each loop is 1 minute, plus rand() seconds in the final loop to determine time of winning goal
  var timeSec = Math.floor(Math.random()*58)+1;
  var strTime = padNum(timeMin, 2, '0') + ':' + padNum(timeSec, 2, '0');

  // return array [ [team1, time of goal], [team2] ]
  var output = [ [g1, strTime], g2 ];
  return output;

}

function padNum(num, padlen, padchar) {

    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);

    return (pad + num).slice(-pad.length);

}