function colourCell(rng) {

    // get sheet and cell affected
    var sh = SpreadsheetApp.getActiveSheet();
    rng = rng || SpreadsheetApp.getActiveRange();
    
    // check its in one of the team colour columns
    var col = rng.getColumn();
    var inCols = false;

    // set correct column number checks here
    // for example > 2 && < 6 = C,D,E (3,4,5)
    if(col > 32 && col < 44 && col % 2 == 1) {
      inCols = true;
    }

    // if its on the right sheet and in one of the right columns...
    if (sh.getName() == 'TeamList' && inCols) {
      
      // get the hex value in the cell
      // use a light grey if no value
      var cHex = rng.getValue() !== '' ? rng.getValue() : 'cdcdcd';
      
      // make sure its 6 characters
      if(cHex.length !== 6) return;

      // add a hash and set this as the background colour of the cell
      var hex = "#" + cHex;
      rng.setBackground(hex);

      // set font colour to either black or white based on background colour
      // note: you can adjust the threshold based on personal preference
      // a higher threshold means more colours are considered "dark"
      var threshold = 149;
      let fontHex = "#000000"
      let decR = parseInt(cHex.substring(0,2), 16) * 0.299;
      let decG = parseInt(cHex.substring(2,4), 16) * 0.587;
      let decB = parseInt(cHex.substring(cHex.length - 2), 16) * 0.114;
      let intensity = decR + decB + decG;
      if (intensity <= threshold) { fontHex = "#ffffff"}
      rng.setFontColor(fontHex);

    }
    
}

function onEdit(e) {
    const sht = SpreadsheetApp.getActiveSheet();
    if (sht.getName() == 'TeamList') {
      colourCell(e.range);
    }
}