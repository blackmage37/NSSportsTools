/**
 * Determines a schedule incorporating inter-conference/inter-division fixtures.
 *
 * @param {Array<Array<string>>} entrants A range of data with columns for Rank (Skill Pts), Entrant, Division, and Conference. In that order.
 * @param {number} scheduleLength How many total games per team?
 * @return {Array<Array<string>>} An array of fixtures, interleaved and formatted for the sheet.
 * @customfunction
 */
function nflStyleSchedule(entrants, scheduleLength) {

  // input will need to take Conference, Division, Entrant, Rank
  // loops will act as a multiplier for that section of the schedule (repeat the last loop and reverse home/away each time)

  // determine the number of conferences and divisions. this will affect the next step
  var structure = determineLeagueStructure(entrants);
  var numConfs = structure.length;
  var numDivs = getTotalDivisions(structure);
  var divsPerConf = numDivs / numConfs;

  if (numDivs == -1) {
    return [ 'Invalid Input', 'Conferences do not', 'have equal numbers', 'of divisions' ];
  }

  // create a deck of matchday cards
  // generate all fixtures
  // split fixtures into buckets
  // shuffle the deck

  // INTRA-DIVISION
  // against each team in the same division

  // INTRA-CONFERENCE
  // every team in ONE other division (same conference)

  // INTRA-RANKMATCHED
  // against one team in each of the other divisions (same conference) finishing in the same place/with same rank
    
  // INTER-RANKMATCHED
  // against one team from a nominated division (other conference) finishing in the same place/with same rank
        // if there is only one conference, or only two divisions per conference, ignore this one
    
  // INTER-CONFERENCE
  // against each team in a nominated division (other conference)

}