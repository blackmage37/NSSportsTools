function makeGoalList(opponent=false) {
  
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName("Results");
  
  var rng = sh.getRange("A1:A"); 
  var games = rng.getValues(); 
  
  if (opponent) { var goals = sh.getRange("G1:G").getValues() } else { var goals = sh.getRange("F1:F").getValues() }
  
  var list = [];

  for (x = 0; x < rng.getNumRows(); x++) {
    for (var i = 0; i < goals[x]; i++) {
      list.push(games[x]);
    }
  }

  return list;

}