/**
 * Displays a prompt window, takes an input, then returns a range object as defined by the user input to the prompt
 *
 * @param {string} promptText An optional string to appear in the prompt, explaining what to enter
 * @return The range defined by the input. Or -1 if it fails.
 * @customfunction
 */
function rangePrompt(promptText) {
  promptText = promptText === undefined ? 'Please enter the range you wish to use (e.g. A2:B10):' : promptText;
  var ui = SpreadsheetApp.getUi();
  var rngString = '';
  const failedProc = -1;

  var response = ui.prompt(
    'Enter Range',
    promptText,
    ui.ButtonSet.OK_CANCEL
  )

  // check they clicked OK
  if (response.getSelectedButton() == ui.Button.OK) {
    rngString = response.getResponseText();
    try {
      return SpreadsheetApp.getActiveSheet().getRange(rngString);
    }
    catch (e) {
      ui.alert('Error: The range entered is not valid\r\n\r\n' + e.message);
      return failedProc;
    }
  } else {
    return failedProc;
  }

}
/**
 * Returns a string representation of the currently selected range
 *
 * @return The address of the selected range
 * @customfunction
 */
function getSelectedRange(){
  var selected = SpreadsheetApp.getActiveSheet().getActiveRange(); // Gets the selected range
  var rangeString = selected.getA1Notation(); // converts it to the A1 type notation
  return rangeString;
}

// via pop up box
// limitation is that it doesn't wait for a response before running the next line of code
// will need to work out a way to use Promises or something for this probably
function selectRange()
{
  var output=HtmlService.createHtmlOutputFromFile('pickRange').setWidth(300).setHeight(200).setTitle('Select A Range');
  SpreadsheetApp.getUi().showModelessDialog(output, 'Range Selector');
}

function selectCurrentRange() 
{
  var sso=SpreadsheetApp.getActive();
  var sh0=sso.getActiveSheet();
  var rg0=sh0.getActiveRange();
  var rng0A1=rg0.getA1Notation();
  rg0.setBackground('#777700');
  return rng0A1;
}

function clearRange(range)
{
  var sso=SpreadsheetApp.getActive();
  var sh0=sso.getActiveSheet();
  var rg0=sh0.getRange(range);
  rg0.setBackground('#ffffff');
}