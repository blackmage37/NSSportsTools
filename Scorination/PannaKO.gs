function pannaKO(p1rank = 100, p2rank = 100, p1style = 0, p2style = 0) {

  // debug with default variables
//  p1rank = p1rank || 100;
//  p2rank = p2rank || 100;
//  p1style = p1style || 0;
//  p2style = p2style || 0;

  var maxAttempts = 20; // panna attempts per player

  // base chances 
  var pBase = 0.1;      // panna success
  var gBase = 0.2;      // goal success

  // adjust base chances according to styles of participants
    // positive style = higher panna chance; lower goal chance
    // negative style = lower goal chance; higher panna chance

  // panna formula:
    // -0.0002x^4-5E-15x^3+0.0486x^2+1.2x+10.356 =~ 98% average fit
    // r-squared ~0.998
  var x = p1style + p2style;
  pBase = ((-0.0002*Math.pow(x,4))-(0.000000000000005*Math.pow(x,3))+(0.0486*Math.pow(x,2))+(1.2*x)+10.356)/100;
  //console.log('panna chance: ' + pBase);

  // base chance of goal is inversely proportional to panna chance, so set it as 0.35 minus the above
    // panna chance ranges from ~0.01 to ~0.25; so goal chance will be ~0.1 - ~0.34
  gBase = 0.35 - pBase;
  //console.log('goal chance: ' + gBase);

  // attempt count
  var a1 = 0;
  var a2 = 0;
  // goals count
  var g1 = 0;
  var g2 = 0;
  // panna count
  var pannaCount = 0;
  var pannaWin = 0;

  // coin flip for first attempt
  var start = Math.random > 0.5 ? 1 : 0;

  // initialise timer
  var timeCycle = 0;

  // calculate sPanna for each team based on ranks
  // no home advantage
  var p1 = calcThreshold(pBase,p1rank,p2rank);
  var p2 = calcThreshold(pBase,p2rank,p1rank);
  // and sGoal...
  var s1 = 0.1 + (calcThreshold(gBase,p1rank,p2rank));
  var s2 = 0.1 + (calcThreshold(gBase,p2rank,p1rank));

  console.log('p1 rank: ' + p1rank + '; panna: ' + p1 + '; goal: ' + s1);
  console.log('p2 rank: ' + p2rank + '; panna: ' + p2 + '; goal: ' + s2);
  
  // alternate between teams until someone gets a panna
  // every failed attempt gives a chance of a goal as well
  do {
    timeCycle++
    if(start) {
      if(timeCycle % 2 === 0) {
        // player 1 starts
        if (Math.random() < p1) {
          pannaCount++;
          pannaWin = 1;
        } else {
          if (Math.random() < s1) {
            g1++
          }
          a1++
        }
      } else {
        // player 2 starts
        if (Math.random() < p2) {
          pannaCount++;
          pannaWin = 2;
        } else {
          if (Math.random() < s2) {
            g2++
          }
          a2++
        }
      } 
    } else {
      if(timeCycle % 2 === 0) {
        // player 2 starts
        if (Math.random() < p2) {
          pannaCount++;
          pannaWin = 2;
        } else {
          if (Math.random() < s2) {
            g2++
          }
          a2++
        }
      } else {
        // player 1 starts
        if (Math.random() < p1) {
          pannaCount++;
          pannaWin = 1;
        } else {
          if (Math.random() < s1) {
            g1++
          }
          a1++
        }
      } 
    }
  }
  while (pannaCount < 1 && (a1 + a2 < (2 * maxAttempts)));

  // output number of "minutes" the panna took; assuming each "attempt" takes roughly 15 seconds
  var timeMin = Math.floor(timeCycle/4);
  var varSecs = Math.floor(Math.random() * (8 - 1 + 1) + 1);    // get a bit of variation in timings
  var timeSec = (timeCycle * 15) - (timeMin * 60) + varSecs;
  
  var strTime = padNum(timeMin, 2, '0') + ':' + padNum(timeSec, 2, '0');
  //console.log('time: ' + strTime);

  // break ties on goals; but only if pannaWin is zero
  // in these cases, the player who had first attempt loses
  // which is effectively a coin flip, since there is a 50/50 chance for each player
  if (pannaWin == 0 && g1 == g2) {
    if (start) {
      g2++
    } else {
      g1++
    }
  }

  var output = [ [pannaWin, g1], [strTime, g2] ];
  return output;

}

function calcThreshold(baseDiff,rank,opprank) {

  var high = rank >= opprank ? 1 : -1;
  var ratio = rank + opprank <= 0 ? 1 : Math.max(1, Math.min(rank,opprank))/Math.max(rank,opprank,1);
  // note the above ensures that min and max rank are always at least 1
  // this avoids DIV/0 errors and ensures that a ratio is still applied if a zero rank team faces a ranked team
  
  return (baseDiff+(0.07-0.07*ratio)*high);

}

function padNum(num, padlen, padchar) {

    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);

    return (pad + num).slice(-pad.length);

}