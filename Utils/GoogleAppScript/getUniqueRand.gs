function getUniqueRand(maxRand, ignoreRand1, ignoreRand2) {
  
  do {
    
    var chkExit = 0;
    
    var num = Math.floor(Math.random()*maxRand);
    
    if (num==ignoreRand1) {
      chkExit = 1;
    }
    
    if (num==ignoreRand2) {
      chkExit = chkExit + 1;
    }
    
    if (num==0) {
      chkExit = chkExit + 1;
    }
    
  }
  while (chkExit>0);
   
  return num;
         
}