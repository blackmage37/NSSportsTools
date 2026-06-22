function runCoinFlip() {
  SpreadsheetApp.getUi().alert(coinFlip());
}

function runVariablePots() {
  SpreadsheetApp.getUi().alert('Unfinished code\r\n\r\n' + 
                              'This will take a range of teams and split them into a ' + 
                              'specified number of pots, based on rank order. If there ' + 
                              'is an odd number of teams for the number of pots specified, ' + 
                              'BYEs will be assigned to fill the spaces.')
}

function runLadderMatchmaking() {
  SpreadsheetApp.getUi().alert('Unfinished code\r\n\r\n' + 
                              'This will take a range of teams and generate a list ' + 
                              'of fixtures using a "ladder matchmaking" ruleset, which ' + 
                              'allows a team to challenge another team ranked upto a ' + 
                              'set number of places above them.')
}
