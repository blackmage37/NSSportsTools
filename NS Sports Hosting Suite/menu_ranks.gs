/* Takes a range of ranks and generates a list of normalised ranks, 
   scaling the values provided to fit within defined bounds.
   Expects ONE column, and will output to a list starting in a specified cell
*/
function runRankNormaliser() {
  
  const ui = SpreadsheetApp.getUi();

  // get the range of ranks
  var rankRange = rangePrompt('Please select the range containing the ranks to normalise. Just one column is expected (e.g. A2:A10):').getValues();

  // take inputs from user to determine the new range of rank values
  try {
    var maxResponse = ui.prompt('Enter the desired new maximum rank');
    var max = parseFloat(maxResponse.getResponseText());
  } catch (e) {
    ui.alert('Error: ' + e.message);
  }
  
  try {
    var minResponse = ui.prompt('Enter the desired new minimum rank');
    var min = parseFloat(minResponse.getResponseText());
  } catch (e) {
    ui.alert('Error: ' + e.message);
  }

  newRanks = rankNormaliser(rankRange, max, min);

  // where are we outputting the new ranks to?
  var outputRange = rangePrompt('Please select the cell to start the output of the new ranks to.\r\n\r\n' + 
                                'Each rank will appear on a new line so only one cell is required:');
  r = outputRange.getRow();
  c = outputRange.getColumn();
  targetRange = SpreadsheetApp.getActiveSheet().getRange(r, c, newRanks.length, 1);
  Logger.log(targetRange.getA1Notation());

  // re-map new ranks to a multidimensional array object that we can push to the sheet
  var output = newRanks.map(element => [element]);

  targetRange.setValues(output);

}

function runRankAnalysis() {
  SpreadsheetApp.getUi().alert('Unfinished code\r\n\r\n' + 
                              'This will take a range of ranks and generate some ' + 
                              'analytic values, like median, mean, standard dev, ' + 
                              'and the odds of certain results when comparing ranks ' + 
                              'at varying points in the full range of values. ' + 
                              '(e.g. Median vs Max, Zero vs Median, etc)')
}

function runRPBonusAnalysis() {
  SpreadsheetApp.getUi().alert('Unfinished code\r\n\r\n' + 
                              'This will take a range of RP bonuses and generate some ' + 
                              'analytic values, like median, mean etc')
}