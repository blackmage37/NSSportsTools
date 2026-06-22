function CopyDataToNewFile(strSheet) {
  // NOTE: target sheet name must be the same as source sheet

  // get source details
  // should be this spreadsheet, but we can specify another if we want to; just use the second sourceFile declaration instead
  var sourceFile = SpreadsheetApp.getActiveSpreadsheet();
  //var sourceFile = SpreadsheetApp.openById('INSERT SPREADSHEET ID HERE');
  
  // source sheet is provided as a param
  var sourceSheet = sourceFile.getSheetByName(strSheet);

  // how big is the data range?
  // find the last used row and column in the given sheet
  var sRows = sourceSheet.getLastRow() - 1;
  if (sRows < 1) {
    Logger.log('No data to copy');
    return 0;
  }

  var sCols = sourceSheet.getLastColumn();

  // get the actual data in array form
  //Logger.log('Retrieving data...');
  var SRange = sourceSheet.getRange(2,1,sRows,sCols);
  var SData = SRange.getValues();

  // get target sheet details
  var targetId = getDestinationId();
  var targetFile = SpreadsheetApp.openById(targetId);

  // target sheet name (same as source)
  var targetSheet = targetFile.getSheetByName(strSheet);
  
  // specify paste range (start from last row, make sure range is same size as source)
  var pasteLoc = targetSheet.getRange(targetSheet.getLastRow() + 1, 1, sRows, sCols);

  // set the target range to the values of the source data (effectively paste values only)
  targetSheet.getRange(pasteLoc.getA1Notation()).setValues(SData);

}  

function updateOneCell(targetFile, targetSheet, targetCell, newValue) {
  
  // convert destination cell address to index vals
  var locCoOrds = cellA1ToIndex(targetCell, 1);
  
  // get destination range (NOTE: size = 1x1 because only one cell)
  var updateLoc = targetFile.getSheetByName(targetSheet).getRange(locCoOrds['row'], locCoOrds['col'], 1, 1);

  // set the value of the destination range
  updateLoc.setValue(newValue);

}

function getDestinationId() {
  // get the destinationId from the Settings sheet in this file
  return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('destinationId').getValue();
}