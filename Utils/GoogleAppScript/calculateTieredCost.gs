function calcCost(statValue) {
  
  var t0 = 0;
  
  var t1 = 50;        //  0-50  :  1pt
  var p1 = 1;
  
  var t2 = 70;        // 51-70  :  2pts
  var p2 = 2;
  
  var t3 = 80;        // 71-80  :  4pts
  var p3 = 4;
  
  var t4 = 90;        // 81-90  :  8pts
  var p4 = 8;
  
  var p5 = 12;        // 91-100 : 12pts
  
  if (statValue <= t1)
    t = ((statValue - t0) * p1);
  else if (statValue <= t2)                         
    t = ((statValue - t1) * p2) + (t1 * p1);
  else if (statValue <= t3)                         
    t = ((statValue - t2) * p3) + (t1 * p1) + ((t2 - t1) * p2);
  else if (statValue <= t4)
    t = ((statValue - t3) * p4) + (t1 * p1) + ((t2 - t1) * p2) + ((t3 - t2) * p3);
  else                                             
    t = ((statValue - t4) * p5) + (t1 * p1) + ((t2 - t1) * p2) + ((t3 - t2) * p3) + ((t4 - t3) * p4);

  return t;
  
}

function calcTPE(x) {
  if ( Array.isArray(x)) {
    var result = [];
    for( var i=0; i < x.length; i++) {
      var temp = [];
      for ( var j=0; j < x[i].length; j++) {
        temp.push(calcCost(x[i][j]));
      }
      result.push(temp)
     }
     return result;
    }
  else
    return calcCost(x);
}