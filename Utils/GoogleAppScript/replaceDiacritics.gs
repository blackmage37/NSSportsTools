var ACCENTED = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽžęłćńčŻążŁ';
var REGULAR = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZzelcncZazL';
var REGEXP = new RegExp('[' + ACCENTED + ']', 'g');

function replaceDiacritics(rng) {
  function replace(match) {
    var p = ACCENTED.indexOf(match);
    return REGULAR[p];
  }
  
  if (typeof rng === 'object' && rng.length !== undefined) { // if rng is an array
    return rng.map(function(cell) { return replaceDiacritics(cell); });
  }
  else {
    return rng.replace(REGEXP, replace);
  }
}