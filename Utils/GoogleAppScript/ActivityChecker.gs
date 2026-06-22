/**
 * Gets the last activity time of nation on NS
 *
 * @param {text} input The API URI to the nation.
 * @return The text value of the "Last Activity" attribute
 * @customfunction
 */

function getNSActivity(url) {
  var xml = UrlFetchApp.fetch(url).getContentText();
  var document = XmlService.parse(xml);
  var root = document.getRootElement();

  return root.getChildText('LASTACTIVITY');
}

/**
 * Gets the HTTP response code.
 *
 * @param {text} input The uri to check HTTP response from
 * @return The HTTP response code.
 * @customfunction
 */

function HTTPResponse(uri){
  var response_code;
  try {
    response_code = UrlFetchApp.fetch(uri).getResponseCode().toString() ;
  }
  catch(error) {
    response_code = error.toString().match( / returned code (\d\d\d)\./ )[1] ;
  }
  finally {
    return response_code;
  }
}

function test() {
  let nation = 'michael_vii';
  let xml = getNSActivity("https://nssportwiki.com/tip/cte.php?nation=" + nation);
  logger.log(xml);
}