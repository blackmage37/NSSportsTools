function weightedRand(rngList, rngWeight) {

  var list = [];
  for (var i = 0; i < rngList.length; i++) {
    list.push(rngList[i][0]);
  }
  
  var weight = [];
  for (var i = 0; i < rngWeight.length; i++) {
    weight.push(rngWeight[i][0]);
  }
  
  var rand = function(min, max) {
    return Math.random() * (max - min) + min;
  };
  
  var total_weight = weight.reduce(function (prev, cur, i, arr) {
    return prev + cur;
  });
  
  var random_num = rand(0, total_weight);
  var weight_sum = 0;
  //console.log(random_num)
  
  for (var i = 0; i < list.length; i++) {
    weight_sum += Number(weight[i]);
    weight_sum = +weight_sum.toFixed(2);
    
    if (random_num <= weight_sum) {
      return list[i];
    }
  }
}

function weightedRand_exclude(rngList, rngWeight, excludeVals) {
  
  var excludes = excludeVals.split("|");
  var list = [];
  for (var i = 0; i < rngList.length; i++) {
    for (var j = 0; j < excludes.length; j++) {
      if(rngList[i][0] !== excludes[j]) {
        list.push(rngList[i][0]);
      }
    }
  }
  
  var weight = [];
  for (var i = 0; i < rngWeight.length; i++) {
    weight.push(rngWeight[i][0]);
  }
  
  var rand = function(min, max) {
    return Math.random() * (max - min) + min;
  };
  
  var total_weight = weight.reduce(function (prev, cur, i, arr) {
    return prev + cur;
  });
  
  var random_num = rand(0, total_weight);
  var weight_sum = 0;
  //console.log(random_num)
  
  for (var i = 0; i < list.length; i++) {
    weight_sum += weight[i];
    weight_sum = +weight_sum.toFixed(2);
    
    if (random_num <= weight_sum) {
      return list[i];
    }
  }
}