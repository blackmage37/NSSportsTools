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