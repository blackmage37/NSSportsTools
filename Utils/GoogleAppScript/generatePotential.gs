function generatePotential(chance) {
 
  // =MIN(3,MIN(5,IF(Age<=19,ROUND(CurrentRating+1+RAND(),0),IF(Age<=25,ROUND(CurrentRating+RAND(),0),CurrentRating))))
  
  //var chance = 20;
  var rNum = 1 + Math.floor(Math.random()*6000);
  var pot = 0;
  
  console.log('Checking potential... ');
  console.log((rNum + 1) % chance);
  
  if((rNum + 1) % chance==0) {
    
    console.log('5-star potential identified');
    return 5;
    
  }
  
  console.log('Threshold is ' + 6000/chance);
  
  if (rNum <= (6000/chance)) {
    
    console.log('4-star potential identified');
    return 4;
    
  } else {
    
    console.log(Math.random()*3);
    
    pot = Math.floor(Math.random()*3) + 1;
    return pot;
    
  }
  
}