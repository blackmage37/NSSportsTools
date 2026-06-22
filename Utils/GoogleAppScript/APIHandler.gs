function getAPIValue(nationName, shard) {
  
  const validShards = [
    'income', 'richest', 'poorest', 'tax', 'gdp', 'population'
  ];

  const validScales = [ 
    'wealthgap', 'welfare', 'incomeequality', 
    'economicfreedom', 'taxation', 'freedomfromtaxation',
    'employment', 'hdi', 'averageincome', 'averageincomepoor',
    'averageincomerich', 'economicoutput'
  ];

  const censusScales = {
    'wealthgap'          : 4,
    'welfare'            : 28,
    'incomeequality'     : 33,
    'economicfreedom'    : 48,
    'taxation'           : 49, 
    'freedomfromtaxation': 50,
    'employment'         : 56, 
    'hdi'                : 68,
    'averageincome'      : 72, 
    'averageincomepoor'  : 73,
    'averageincomerich'  : 74, 
    'economicoutput'     : 76
  };

  const nation = nationName.toLowerCase();
  let censusValue = false;      // flag to let us know the structure will be different

  // check that we're handling this API value
  const apiValue = shard.toLowerCase();
  if(!validShards.includes(apiValue) && !validScales.includes(apiValue)) {
    return `${shard} is not a valid API value`;
  }

  // build the call value (the API query)
  let apiCallValue = '';
  if(validScales.includes(apiValue)) {
    apiCallValue = `census;scale=${censusScales[apiValue]}`;
    censusValue = true;       // flag for later
  } else {
    apiCallValue = apiValue;
  }

  const url = `https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=${apiCallValue}`;
  var xml = UrlFetchApp.fetch(url).getContentText();
  var document = XmlService.parse(xml);
  var root = document.getRootElement();

  if(censusValue) {
    const census = root.getChild('CENSUS');
    const scale = census.getChild('SCALE');
    return scale.getChildText('SCORE');
  } else {
    return root.getChildText(shard.toUpperCase());
  }

}