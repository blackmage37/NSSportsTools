// Takes two ranges or lists: first one is values to be selected "randomly", the second is the weighting of each item.
// For example: {A, B, C}, {8, 1, 1} will give A an 80% chance of selection (8/(8+1+1)), while the other two options have a 10% chance each.
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
    weight_sum += weight[i];
    weight_sum = +weight_sum.toFixed(2);
    
    if (random_num <= weight_sum) {
      return list[i];
    }
  }
}
