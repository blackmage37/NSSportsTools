function DAYSBETWEEN_LMG(start, end, returnLong) {
  
  // pass default values in case we get no input
  dStart = start || "0001-00-04";
  dEnd = end || "0062-07-14";
  returnLong = returnLong || false;

  // first convert the strings into numbers we can use
  start_date = dStart.split("-");
  end_date = dEnd.split("-");

  // convert month and day into values we can easily compare
  addYear = false;
  nStart = (parseInt(start_date[1]) * 30) + parseInt(start_date[2]);
  nEnd = (parseInt(end_date[1]) * 30) + parseInt(end_date[2]);

  // add the Inguzfáur days if appropriate
  if (start_date[1] > 0) { nStart += 4 }
  if (end_date[1] > 0) { nEnd += 4 }

  // then check if we need to add a year
  if (nEnd >= nStart && end_date[0] > start_date[0]) { addYear = true } 

  // get the difference in years
  yearDiff = parseInt(end_date[0]) - parseInt(start_date[0]) - 1 + addYear
  
  // now we need the difference in days
  if (nEnd >= nStart) {
    dayDiff = nEnd - nStart
  } else {
    dayDiff = (364 - nStart) + nEnd
  }

  if (returnLong) {
    return yearDiff + 'y ' + dayDiff + 'd'
  } else {
    return yearDiff + (dayDiff/1000) 
  }

}
