function test() {
  var targetCell = 'C5';
  Logger.log(cellA1ToIndex(targetCell, 1));
  updateOneCell(SpreadsheetApp.getActiveSpreadsheet(),'Transfer Lookup','D1', 'CMT')
}

function addToTransferList() {
  // copy values from Transfer List in this file
  // and paste to bottom of Transfer List in destination file
  CopyDataToNewFile('Transfer List');
}

function acceptBids() {
  /* parse a specified range, passing the values to the acceptBid function */

  // get number of accepted/completed bids
  var acc = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('numAccepted').getValue();
  var cmp = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('numCompleted').getValue();

  // if no updated bids, alert user and exit function
  var ui = SpreadsheetApp.getUi();
  if(acc === 0 && cmp === 0) { 
    ui.alert(
    'No bids to update',
    'You haven\'t accepted any bids. Check and try again.',
    ui.ButtonSet.OK);
    return; 
    }

  // get confirmation
  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to accept ' + acc + ' bids?',
      ui.ButtonSet.YES_NO);

  // if no, exit the function
  if (!result == ui.Button.YES) {
    return;
  }

  // otherwise process the range
  // passing the values to acceptBids() for update

}

function acceptBid(bidId, blnClub, blnPlayer) {
  // find the correct row based on bid id
  // if blnClub, set column L to Y
  // if blnPlayer, set column M to Y
}