const yearDiff = 1278;   // hardcoded difference in calendar

function dateTest() {
  
  console.log(getDateParts("2305-04-23"));
  d = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Results').getRange('C2').getValue();
  console.log(yearDay(d));
  console.log(31 + 29 + 31 + 23);
  console.log(CONVERT_DATE(d, true));

  console.log(CONVERT_DATE('2305-04-23', true));
  console.log(CONVERT_DATE('2305-07-31', true));


}

function getDateParts(dateString, delimiter = '-') {
  return dateString.split(delimiter);
}

function CONVERT_DAY(dateToConvert, toLimey) {
  
  var yDay = parseInt(yearDay(dateToConvert));

  var mm = 0;
  var dd = 0;
  if (toLimey) {
    // calculate the date based on year day
    switch(true) {
      case (yDay <= 18):                 // ninth month
        dd = yDay + 12;
        mm = 9;
        break;
      case (yDay <= 48):                 // tenth month
        dd = yDay - 18;
        mm = 10;
        break;
      case (yDay <= 79):                 // eleventh month
        // treat feb 29 as feb 28 always
        if (yDay => 60) { yDay = yDay - 1 }     
        dd = yDay - 48;
        mm = 11;
        break;
      case (yDay <= 109):                 // twelfth month
        dd = yDay - 79;
        mm = 12;  
        break;
      case (yDay <= 114):                 // "zeroth" month
        dd = yDay - 110;
        mm = 0;
        break;
      case (yDay <= 144):                 // first month
        dd = yDay - 114;
        mm = 1;
        break;
      case (yDay <= 174):                 // second month
        dd = yDay - 144;
        mm = 2;
        break;
      case (yDay <= 204):                 // third month
        dd = yDay - 174;
        mm = 3;
        break;
      case (yDay <= 234):                 // fourth month
        dd = yDay - 204;
        mm = 4;
        break;
      case (yDay <= 264):                 // fifth month
        dd = yDay - 234;
        mm = 5;
        break;
      case (yDay <= 294):                 // sixth month
        dd = yDay - 264;
        mm = 6;
        break;
      case (yDay <= 324):                 // seventh month
        dd = yDay - 294;
        mm = 7;
        break;
      case (yDay <= 354):                 // eighth month
        dd = yDay - 324;
        mm = 8;
        break;
      case (yDay <= 366):                 // ninth month
        dd = yDay - 354;
        mm = 9;
        break;    
    }
  }

  return pad(mm, 2) + '-' + pad(dd, 2);

}

function CONVERT_YEAR(dateObject, toLimey) {
  
  var yDay = parseInt(yearDay(dateObject));
  var dParts = getDateParts(dateObject.toString());
  var dY = parseInt(dParts[0]);

  if (toLimey) {
    var yy = dY - yearDiff;
    yy = yDay < 110 ? yy - 1 : yy;
    return yy;
  } else {

  }

}

function IS_BG(dateObject) {

  var dParts = getDateParts(dateObject.toString());
  var dY = parseInt(dParts[0]);

  if (dY - yearDiff < 1) {      // might be before the Georgian era
    if (dY - yearDiff < 0) {
      // definitely BG because it's before the first year
      return true;
    } else if (yDay < 112) {  // before new year so it's BG
      return true;
    }
  }
  
  return false;

}

function CONVERT_DATE(dateObject, toLimey) {

  // Limey calendar is 365 days, April 19th is the equivalent of
  // new year's day, or 00-00 in the Limey calendar, followed by
  // Inguzfáur, which is 00-01 to 00-04
  // so 04-20 in OSR/CBR would be 00-01 in LMG minus however many years
  // so 04-19 in OSR/CBR would be 00-00 in LMG 
  // and 04-18 in OSR/CBR would be 12-30 in LMG

  // constants for the number of milliseconds in useful date periods
  const msDay = 24 * 60 * 60 * 1000;
  const msYear = msDay * 365;
  var msDiff = (yearDiff * msYear)

  var dateToConvert = dateObject;
  var typeCheck = typeof dateToConvert;
  if (typeCheck != "string") {  
    var trueDate = new Date(dateToConvert - (dateToConvert.getTimezoneOffset() * 60 * 1000));
    dateToConvert = trueDate.toISOString().substring(0,10);
  }

  var output = '';

  // if converting to LMG calendar
  if (toLimey) {
    
    if (IS_BG(dateToConvert)) { output = 'BG '; }
    output = output + CONVERT_YEAR(dateToConvert, true) + '-' + CONVERT_DAY(dateToConvert, true);
    return output;

  } else {

    // if converting to OSR/CBR calendar
    var convertedDate = new Date(new Date(dateToConvert).getTime() + msDiff);
    output = pad(convertedDate.getYear(), 4) + '-' + pad(convertedDate.getMonth(), 2) + '-' + pad(convertedDate.getDate(), 2);
    return output;

  }  

}

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

// use this for OSR calendar dates
function getAge(birthDate, compareDate) {
  if (arguments.length == 1) { //then use current date for compareDate
    compareDate = new Date();
  }
  
  yrDiff = compareDate.getYear() - birthDate.getYear();
  
  if (birthDate.getMonth() + (birthDate.getDate()/100) > compareDate.getMonth() + (compareDate.getDate()/100)) {
    yrDiff = yrDiff - 1;
  }
  
  return yrDiff;
}

function yearDay(dateToCheck) {

  d = dateToCheck;
  if (typeof dateToCheck == 'string') { d = new Date(dateToCheck); }
  var start = new Date(d.getFullYear(), 0, 0);
  var diff = d - start + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);

  if (!isLeapYear(d.getYear())) { day += 1; }

  return day;

}

function isLeapYear(year) {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}