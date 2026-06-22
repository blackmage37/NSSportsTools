function uniqueRandsCapped(max, numsToGen) {
  var start = 1;
  var myArray = [];
  for (var i = 0; start <= max; myArray[i++] = start++);

  myArray = shuffle(myArray);
  
  return myArray.slice(0,numsToGen)

}