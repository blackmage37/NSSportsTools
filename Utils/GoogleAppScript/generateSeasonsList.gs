function generateSeasonsList() {

  // listOrder determines whether to add missing seasons 
  // starting from the latest or the earliest possible year
  var listOrder = 'E'
  //var listOrder = 'L'

  // get sheet references
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sht = ss.getSheetByName('UniqueSeasons');

  // get current year - we need this for later
  var cYear = ss.getRangeByName('currentSeason').getValue();
  console.log(cYear);

  // check length of array of ids with missing seasons
  SpreadsheetApp.flush();
  var vals = sht.getRange("G1:G").getValues();
  var numRows = vals.filter(String).length;

  // initialise row counter
  var x = 2;

  // loop through array of missing
  for(var i=2;i<numRows;i++) {

    // how many does this id need?
    var k = sht.getRange(i, 8).getValue();

      // loop through until we generate this id's missing seasons
      for(var j=1; j<=k; j++) {

        var eYr = (cYear - k + j - 1);
        var lYr = (cYear - (j-1));

        // copy the id to column 12; years go in column 11
        sht.getRange(x, 12).setValue(sht.getRange(i,7).getValue());

        // add the years, starting with earliest/latest possible
        // depending on the setting of listOrder above
        if(listOrder == 'L') {
          sht.getRange(x,11).setValue(lYr);
        } else {
          sht.getRange(x,11).setValue(eYr);
        }

        // increment the row counter
        x++;

      }

  }

}
