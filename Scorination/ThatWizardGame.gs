function snitchCapture(team1rank, team2rank, homeAdv) {
  
  // maximum modifier for snitch capture time
  var bonusMax = 20;

  // fatigue penalty
  var percentDecrease = 1;
  var fPen = 1 - (percentDecrease/100);

  // threshold floor
  var pFloor = 0.05;      // always at least 5% chance of a goal

  // debug with default variables
  team1rank = team1rank || 1;
  team2rank = team2rank || 1;
  homeAdv = homeAdv || 0;

  var timeMin = -1;
  var start = 0;

  // failures count; increase this to start with a lower chance of catching the snitch
  var f1 = 5;
  var f2 = 5;
  // goals count
  var g1 = 0;
  var g2 = 0;

  // coin flip for first attempt
  if (Math.random > 0.5) {
    start = 1;
  }

  // calculate pCatch for each team based on ranks
  // 33% home advantage
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

  // output number of "minutes" the capture took; assuming each loop is 3 minutes
  var strTime = padNum(timeMin*3, 2, '0') + ':' + '00';

  // this will also affect the number of attacks per team
  // cap this at 20, however; and floor it at 5
  timeMin = Math.max(5,Math.min(timeMin, bonusMax))

  // return array [ [team1, time_in_mins, [team2] ]
  var output = [ [g1, timeMin, strTime], [g2, timeMin] ];
  return output;

}

function calcThreshold(rank,opprank) {

  // get base threshold from the settings sheet
  var styleVar = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('baseCatchThreshold').getValue();
  var ratioVar = styleVar * 1.093;

  var high = rank >= opprank ? 1 : -1;
  var ratio = rank + opprank <= 0 ? 1 : Math.max(1, Math.min(rank,opprank))/Math.max(rank,opprank,1);
  // note the above ensures that min and max rank are always at least 1
  // this avoids DIV/0 errors and ensures that a ratio is still applied if a zero rank team faces a ranked team
  
  return (styleVar+(ratioVar-ratioVar*ratio)*high);

}

function padNum(num, padlen, padchar) {

    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);

    return (pad + num).slice(-pad.length);

}