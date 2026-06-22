function getMaxUdRun() {
  // which column has the result in it
  var okColumn = 2;
  // row containing last result
  var lastResultRow = 1000;
  
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();
  var range = sheet.getRange(2,okColumn,lastResultRow);

  var numRows = range.getNumRows();
  var numCols = range.getNumColumns();  // note: this should be 1
  var startCol = range.getColumn();

  // initialise variables to hold results
  var udCount = 0;
  var maxUd = 0;

  // loop through the range
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
      
      // if the cell we're looking at is in the right column... (it always will be)
      if (startCol+j == okColumn) {

        var res = range.getCell(i+1,j+1).getValue();        // store the result value
        var comp = sheet.getRange(i+1, j+25).getValue();    // if you store the competition separately, which column is it? 
        var stage = sheet.getRange(i+1, j+27).getValue();   // if you store the stage separately, which column is it? 
        
        // to count only a specific competition and/or stage, modify the following line
        // for most, comp !== 'Friendly' might be the best option (ignore friendlies only)
        if(comp == 'World Cup' && stage == 'Qualifying') {
          // only increase the counter if the result was not a loss
          // change the "loss" text here if you store results differently
          if (res !== 'Loss') {
            udCount++;
          } else {
            // when a loss is encountered, take the larger of the current streak or longest so far
            maxUd = Math.max(maxUd, udCount);
            // reset the counter for the current streak
            udCount = 0;
          }
        }
      }
    }
  }
  // output the result to the console (and return it as function output)
  console.log(maxUd);
  return maxUd;

};