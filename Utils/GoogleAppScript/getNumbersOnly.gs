function getNumbersOnly(theString) {
  var thenum = theString.replace(/^\D+|\D+$/g, "");
  return thenum;
}