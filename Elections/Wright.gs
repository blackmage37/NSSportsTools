/**
 * Main function to conduct a Wright System STV election
 * 
 */
function WRIGHT_SYSTEM(ballotData, numberOfSeats, useHareMethod = false, tiebreakRule = "random") {

  // do some prep to get things in the right format
  const prepared = prepareBallots(ballotData);
  const ballots = prepared.ballots;
  const allCandidates = prepared.allCandidates;

  // verify tiebreak rule is valid choice
  // if not, default it to random
  const validTiebreakRules = [ 'countback', 'firsts', 'random' ];
  if (!validTiebreakRules.indexOf(tiebreakRule) >= 0) {
    tiebreakRule = 'random';
  }

  // now we run the recursive algorithm
  // start with empty values for excluded, winners, and history
  const result = wrightRecursive(ballots, numberOfSeats, useHareMethod, tiebreakRule, [], [], []);

  // format the output for display
  return formatResultsOutput(result.winners, result.history, allCandidates);

}

/**
 * Recursive function to calculate election results from a range of ballots using the Wright System
 * 
 * @param {Array<Array<string>>} ballots - A 2D array of ballots with preferences indicated by numbers. Candidate names as headers, each row represents one vote.
 * @param {number} seats - The number of seats to allocate based on the election results.
 * @param {boolean} useHareMethod - If true, the quota will be calculated using the Hare method. Defaults to false, which uses Droop.
 * @param {string} tiebreakRule - Determines the primary method of breaking ties. Accepts 'countback' (checks previous round tally), 'firsts' (ranks based on 1 preferences), or 'random'. If countback or firsts is chosen, second preference will be the other and random will be last choice (unless specified as primary method). Defaults to random.
 * @param {Array<string>} allCandidates - The full list of candidates in the election.
 * @param {Array<string>} excluded - The list of excluded candidates.
 * @param {Array<string>} elected - The list of already elected candidates.
 * @param {Array<string>} history - A log containing all relevant information for auditing. Results by round, transfer values, etc.
 */
function wrightRecursive(ballots, seats, useHareMethod, tiebreakRule, allCandidates, excluded = [], elected = {}, history = []) {

  // base case: if all seats are full, or there are no candidates left to exclude... we're done
  const remainingCandidates = allCandidates.filter(c => !excluded.includes(c));
  const seatsToFill = seats - elected.length;

  if (seatsToFill <= 0 || remainingCandidates.length <= seatsToFill) {
    // if finishing by exclusion, add remaining candidates to elected
    const finalWinners = [...elected, ...remainingCandidates.slice(0, seatsToFill)];
    return { winners: finalWinners, history: history };
  }  

  // restart variables
  let currentElected = {};      // we need to store the transfer values for this restart
  let restartWinners = [];      // need to keep track of winners found on this pass
  let roundEvents = [];         // for audit purposes

  // internal loop
  let foundNewWinner = true;
  let currentQuota, currentTallies;

  // keep looking for a new winner as long as we haven't filled all seats yet
  while (foundNewWinner && (elected.length + restartWinners.length) < seats) {

    // recalculate quota based on non-exhausted ballots
    currentQuota = calculateWrightQuota(ballots, seats, excluded, useHareMethod);

    // tally votes using the transfer values in currentElected
    // on first pass, this is empty, so all are worth 1.0 votes
    

  }

  return 1;

}

/****** HELPER FUNCTIONS BELOW THIS LINE ******/

function prepareBallots(data) {
  const headers = data[0];        // candidate Names
  const rows = data.slice(1);     // the votes
  const cleanBallots = [];

  for (let i = 0; i < rows.length; i++) {
    let ballot = [];
    let voterRow = rows[i];
    
    // create a temporary array of {name, rank}
    let prefs = [];
    for (let j = 0; j < voterRow.length; j++) {
      if (voterRow[j] !== "" && voterRow[j] !== null) {
        prefs.push({ name: headers[j], rank: voterRow[j] });
      }
    }

    // sort by rank (1, 2, 3...)
    prefs.sort((a, b) => a.rank - b.rank);
    
    // extract just the names in order
    ballot = prefs.map(p => p.name);
    if (ballot.length > 0) cleanBallots.push(ballot);
  }
  
  return {
    ballots: cleanBallots,
    allCandidates: headers.filter(h => h !== "")
  };
}

/**
 * Tallies the value of all ballots based on the current state.
 * @param {Array} ballots - The 2D array of preferences.
 * @param {Object} currentElected - {Name: TransferValue} for this restart.
 * @param {Array} excluded - Names of candidates who are out.
 * @return {Object} An object containing {CandidateName: TotalValue, "Exhausted": TotalValue}.
 */
function tallyVotes(ballots, currentElected, excluded) {
  let totals = { "Exhausted": 0 };
  
  // initialize all candidates with 0 to ensure they appear in the audit
  // we can take this from the ballots


  // tally the ballots
  for (let i = 0; i < ballots.length; i++) {
    let result = evaluateBallot(ballots[i], currentElected, excluded);
    
    if (result) {
      // result = { candidate: "Name", value: 0.85 }
      if (!totals[result.candidate]) totals[result.candidate] = 0;
      totals[result.candidate] += result.value;
    } else {
      // ballot had no valid candidates left
      totals["Exhausted"] += 1.0;
    }
  }
  
  return totals;
}

/**
 * Calculates the proportion of a vote to be transferred.
 * @param {number} candidateVotes - The total value of ballots currently assigned to the elected candidate
 * @param {number} currentQuota - The quota required for election in this specific round
 * @return {number} The transfer value (surplus divided by total)
 */
function calculateTransferValue(candidateVotes, currentQuota) {
  if (candidateVotes <= currentQuota) return 0;

  let surplus = candidateVotes - currentQuota;
  return surplus / candidateVotes;

}

/**
 * Calculates the Quota based on non-exhausted ballots.
 * @param {Array} ballots - The 2D array of all preferences.
 * @param {number} seats - Number of vacancies to fill.
 * @param {Array} excluded - List of candidate names/IDs who are out.
 * @param {boolean} useHare - use Hare instead of Droop. Defaults to false
 * @return {number} The new quota for this round.
 */
function calculateWrightQuota(ballots, seats, useHare = false, excluded = []) {
  let activeBallotCount = 0;

  for (let i = 0; i < ballots.length; i++) {
    let isExhausted = true;
    
    // check every preference on this single ballot
    for (let j = 0; j < ballots[i].length; j++) {
      let candidate = ballots[i][j];
      
      // if the ballot has a name that is NOT in the excluded list, 
      // the ballot is still "active."
      if (candidate !== "" && !excluded.includes(candidate)) {
        isExhausted = false;
        break; // we found an active candidate, move to the next ballot
      }
    }

    if (!isExhausted) {
      activeBallotCount++;
    }
  }

  // return quota based on method selected
  if (useHare) {
    return activeBallotCount / seats;
  } else {
    return Math.floor(activeBallotCount / (seats + 1)) + 1;
  }
}

/**
 * Processes a single ballot to determine who gets the vote and what its value is.
 * @param {Array} ballot - Array of candidate names/IDs in order of preference.
 * @param {Object} elected - {candidateName: transferValue}
 * @param {Array} excluded - List of excluded candidate names.
 * @return {Object|null} {candidate: name, value: weight} or null if exhausted.
 */
function evaluateBallot(ballot, elected, excluded) {
  let runningValue = 1.0; // start with a full vote

  for (let i = 0; i < ballot.length; i++) {
    let candidate = ballot[i];
    
    // skip empty ranks or excluded candidates
    if (!candidate || excluded.includes(candidate)) {
      continue;
    }

    // if the candidate is already elected, multiply value and keep moving
    if (elected.hasOwnProperty(candidate)) {
      runningValue *= elected[candidate];
      
      // if value drops to near-zero, the ballot is effectively dead
      if (runningValue < 0.000001) return null; 
      
      continue;
    }

    // if we hit a candidate who is still "Running" (not elected or excluded)
    // they get the remaining value of this ballot.
    return {
      candidate: candidate,
      value: runningValue
    };
  }

  // if the loop finishes without finding a running candidate, the ballot is exhausted.
  return null;
}

function formatResultsOutput(winners, history, allCandidateNames) {
  let output = [];

  // winners section
  output.push(["ELECTION RESULTS - WINNERS"]);
  output.push(winners); 
  output.push([]); // spacer row

  // audit log headers
  // dynamically create headers based on the candidates in the race
  let headers = ["Iteration", "Quota", "Exhausted", ...allCandidateNames, "Result"];
  output.push(["AUDIT LOG / TALLY HISTORY"]);
  output.push(headers);

  // audit log data
  history.forEach(round => {
    let row = [round.id, round.quota, round.exhausted];
    
    // add the vote count for each candidate in this specific round
    allCandidateNames.forEach(name => {
      row.push(round.votes[name] || 0);
    });
    
    row.push(round.action);
    output.push(row);
  });

  return output;
}