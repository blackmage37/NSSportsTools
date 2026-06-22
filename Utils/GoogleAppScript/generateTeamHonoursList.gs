function generateTeamHonoursList() {
  
  //
  // creates list of people on each team in each row on TeamHonours
  //

  var sht = SpreadsheetApp.getActiveSheet();

  // get range of populated TeamHonours rows
  var valRange = sht.getRange("B2:B").getValues();
  var lastRow = valRange.filter(String).length + 1;

  // get lastRow in PeopleSeasons
  var pSht = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PeopleSeasons');
  var pRng = pSht.getRange("B2:B").getValues();
  var pLast = pRng.filter(String).length + 1;

  var tRow = 2;

  // loop through range of TeamHonours rows
  for (var i = 2; i <= lastRow; i++) {
    // loop through PeopleSeasons
    for (var j = 2; j <= pLast; j++) {
      
      var tSeason = sht.getRange(i,2).getValue();
      var tTeam = sht.getRange(i,3).getValue();
      var pSeason = pSht.getRange(j,1).getValue();
      var pTeam = pSht.getRange(j,5).getValue();

      // if season and team match, get personID
      if (tSeason == pSeason && tTeam == pTeam) {
        // put data in correct columns
          // H - season
          sht.getRange(tRow,8).setValue(pSeason);
          // I - personID
          sht.getRange(tRow,8).setValue(pSht.getRange(j,2).getValue());
          // J - Name
          sht.getRange(tRow,8).setValue(pSht.getRange(j,3).getValue());
          // K - Team     (from TeamHonours)
          sht.getRange(tRow,8).setValue(tTeam);
          // L - Role
          sht.getRange(tRow,8).setValue(pSht.getRange(j,9).getValue());
          // M - Honour   (from TeamHonours)
          sht.getRange(tRow,8).setValue(sht.getRange(i,5).getValue());
          // N - Prestige (from TeamHonours)
          sht.getRange(tRow,8).setValue(sht.getRange(i,6).getValue());
      }
    }
  }
}

