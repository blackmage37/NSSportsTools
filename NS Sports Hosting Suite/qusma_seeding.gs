/**
 * Generates a list of entrants in matchup order according to the Qusma seeding method
 *
 * @param {Array<Array<string>>} data A range of data with columns for Group, Group Finish, Seed, and Entrant Name (in that order).
 * @return {Array<Array<string>>} A tournament bracket, with placeholders for BYEs if necessary
 * @customfunction
 */
function buildQusmaBracket(data) {
	
  let auditLog = [];;     // use this to track logical decision making. useful for auditing the process

  auditLog.push("[RUN] Calculating required bracket size...");
  const totalEntrants = data.length;
  auditLog.push(`${totalEntrants} entrants detected.`)
  
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(totalEntrants)));
  const expectedByes = bracketSize - totalEntrants;
  if (expectedByes > 0) { 
    auditLog.push(`Number of entrants is not a power of two. Bracket size set at ${bracketSize}; ${expectedByes} byes will be added.`)
  } else {
    auditLog.push(`Number of entrants is a power of two. Bracket size set at ${bracketSize}.`)
  }
  
  const mid = bracketSize / 2;
  auditLog.push(`[RUN] Initialising empty bracket with ${bracketSize} slots...`);
  let bracket = new Array(bracketSize).fill(null);
  
  // ASSIGN GROUP WINNERS
  // Standard tournament seeding (1 vs 16, etc.)
  auditLog.push("[RUN] Assigning group winners to anchor slots");
  const winners = data.filter(r => r[1] == 1).sort((a, b) => a[2] - b[2]);
  const seedOrder = getStandardSeedOrder(bracketSize);
  
  winners.forEach((entrant, index) => {
    const slotIdx = seedOrder.indexOf(index + 1);
    bracket[slotIdx] = entrant;
    auditLog.push(`Winner seed ${index+1} (${entrant[3]}) placed in slot ${slotIdx} (Match {${Math.floor(slotIdx / 2) + 1}})`);
  });

  // DETERMINE BYE SLOTS (IF ANY)
  let byeSlots = [];
  if (expectedByes > 0) {
    auditLog.push("[RUN] Calculating bye slots...");
    let byeCandidates = [];
    for (let i = 0; i < bracketSize; i++) {
      const matchBase = Math.floor(i / 2) * 2;
      const partnerIdx = (i % 2 === 0) ? matchBase + 1 : matchBase;
      // score the candidate based on how strong its partner is
      byeCandidates.push({ slot: i, partnerSeed: seedOrder[partnerIdx] });
    }
    // sort so the slots paired with seed 1, 2, 3... are at the top
    byeCandidates.sort((a, b) => a.partnerSeed - b.partnerSeed);
    byeSlots = byeCandidates.slice(0, expectedByes).map(c => c.slot);
    
    auditLog.push(`Reserved ${expectedByes} Bye Slots: ${byeSlots.join(", ")}`);
  }

  // ASSIGN RUNNERS-UP
  const runnersUp = data.filter(r => r[1] == 2);
  let ruTopPool = [];    
  let ruBottomPool = []; 
  
  // split by winner half to ensure no rematch before the final
  auditLog.push("[RUN] Splitting runner up pool based on group winner positions");
  runnersUp.forEach(ru => {
    const group = ru[0];
    const winIdx = bracket.findIndex(t => t && t[0] === group && t[1] == 1);
    if (winIdx < mid) {
      ruBottomPool.push(ru);
      auditLog.push(`${ru[3]} (Group ${group} Runner Up): Group ${group} Winner is in top half (slot ${winIdx}) -> ${ru[3]} assigned to bottom half`);
    } else {
      ruTopPool.push(ru);
      auditLog.push(`${ru[3]} (Group ${group} Runner Up): Group ${group} Winner is in bottom half (slot ${winIdx}) -> ${ru[3]} assigned to top half`);
    } 
  });

  // fill runners up into 'weakest' slots (facing lower seeds) to ensure group winners get easier draw
  auditLog.push("[RUN] Assigning runners up to top half of bracket...");
  fillSection(bracket, ruTopPool, 0, mid, "weakest", auditLog);
  auditLog.push("[RUN] Assigning runners up to bottom half of bracket...");
  fillSection(bracket, ruBottomPool, mid, bracketSize, "weakest", auditLog);

  // get third placed entrants, sorted by seed, strongest to weakest
  const thirds = data.filter(r => r[1] == 3).sort((a, b) => a[2] - b[2]);

  // try to solve with no rematches using recursive solver
  if (thirds.length == 0) {

    auditLog.push("[SKIP] No third place entrants to place. Skipping solve algorithm.")

  } else {

    auditLog.push("[TRY] Attempting to solve third place entrant configuration...")
    let success = solveThirdPlaceRecursive(bracket, thirds, seedOrder, 0, true, byeSlots, auditLog);

    // if perfection is impossible, we can solve again without preventing conflicts
    if (!success) {
      auditLog.push("[CRITICAL] Perfect configuration impossible. One quarter final rematch must be allowed.");
      
      // clear all third placed teams from the bracket first
      auditLog.push("[RESET] Removing third place entrants from the bracket...");
      for(let i=0; i<bracket.length; i++) if(bracket[i] && bracket[i][1] == 3) bracket[i] = null;
      
      auditLog.push("[TRY] Re-attempting without quadrant constraint.");
      solveThirdPlaceRecursive(bracket, thirds, seedOrder, 0, false, byeSlots, auditLog);
    }
  }
  
  /* OLD APPROACH: KEEP THIS CODE FOR REFERENCE PURPOSES
  // ASSIGN THIRD-PLACE ENTRANTS
  let placementConflicts = []; // to track teams placed via second pass

  thirds.forEach(team => {
    const group = team[0];
    
    // try to find all slots with NO quadrant rematch
    // and assign the one with the weakest opponent
    let chosenSlot = findThirdSlot(bracket, group, seedOrder, true); 
    
    // if that fails, find the weakest remaining opponent regardless of quadrant rematch rules
    if (chosenSlot === -1) {
      chosenSlot = findThirdSlot(bracket, group, seedOrder, false); 
      if (chosenSlot !== -1) placementConflicts.push(group);    // only gets used if we can't place a team. may need manual correction?
    }

    if (chosenSlot !== -1) {
      bracket[chosenSlot] = team;
    }
  });
  */

  // check to see if we assigned every team
  const slotsFilled = bracket.filter(slot => slot !== null).length;
  if (totalEntrants !== slotsFilled) {
    auditLog.push(`[ERROR] ${totalEntrants} provided, but only ${slotsFilled} placed in bracket.`);
  }

  return formatBracket(bracket, byeSlots, auditLog);
  
}

function formatBracket(bracket, byeSlots, auditLog) {

  const output = bracket.map((entrant, index) => {
    let matchIdx = Math.floor(index / 2) + 1;
    let isBye = byeSlots.includes(index);
    let slotStatus = entrant ? "Occupied" : (isBye ? "-- BYE --" : "??????"); 
    let displayName = entrant ? entrant[3] : slotStatus;
    let fallback = auditLog.join("").includes("Perfect configuration impossible");
    let isThird = entrant && entrant[1] == 3;
    let note = (fallback && isThird) ? "[VERIFY] Possible conflict" : (slotStatus == "??????") ? "[ERROR] Missing entrant" : "";
    return [ matchIdx, displayName, note ]
  });

  return output;

}

/**
 * Finds available slots for third placed teams
 */
function findThirdSlot(bracket, group, seedOrder, checkQuad) {
  let candidates = [];

  for (let i = 0; i < bracket.length; i++) {
    if (bracket[i] === null) {
      let isSafe = true;

      // check quadrant (bracketSize/4 range of slots) for groupmates
      if (checkQuad) {
        const quadStart = Math.floor(i / 4) * 4;
        const quadTeams = bracket.slice(quadStart, quadStart + 4);
        isSafe = !quadTeams.some(t => t && t[0] === group);
      }
      
      if (isSafe) {
        auditLog.push(`Slot ${i} safe for ${t[3]} (Group ${t[0]} Third Place). No group rematch before quarter-final.`)
        candidates.push({
          idx: i, 
          slotSeedValue: seedOrder[i]
        });
      }
    }
  }

  // sort by slot seed order
  candidates.sort((a, b) => a.slotSeedValue - b.slotSeedValue);

  // return the weakest opponent slot
  return candidates.length > 0 ? candidates[0].idx : -1;
}

/**
 * Fills a specific range of the bracket with a list of entrants
 */
function fillSection(bracket, pool, start, end, strategy, auditLog) {
  let slots = [];
  for (let i = start; i < end; i++) {
    if (bracket[i] === null) slots.push(i);
  }

  // sort slots based on the seed of the opponent they face
  slots.sort((a, b) => {
    const sA = getOpponentSeed(bracket, a);
    const sB = getOpponentSeed(bracket, b);
    return strategy === "weakest" ? sB - sA : sA - sB;
  });

  // Sort the pool by seed (Strongest team first) and assign
  pool.sort((a, b) => a[2] - b[2]).forEach((t, i) => {
    if (slots[i] !== undefined) {
      bracket[slots[i]] = t;
      const oppSeed = getOpponentSeed(bracket, slots[i]);
      auditLog.push(`Placed ${t[3]} (Group ${t[0]} Runner Up) in Slot ${slots[i]} (Opponent Seed ${oppSeed === 99 ? 'NONE' : oppSeed})`);
    }
  });
}

/**
 * Determines the seed of the opponent in a matchup
 */
function getOpponentSeed(bracket, slot) {
  const matchBase = Math.floor(slot / 2) * 2;
  const oppIdx = (slot % 2 === 0) ? matchBase + 1 : matchBase;
  // if no opponent exists yet, treat as weakest (99)
  return bracket[oppIdx] ? Number(bracket[oppIdx][2]) : 99;
}

/**
 * A recursive backtracking function to solve the Third-Place 'puzzle'.
 * @param {Array} bracket - The current state of the 16-team bracket.
 * @param {Array} thirds - The list of Third-Place teams to be placed.
 * @param {Array} seedOrder - The standard 16-team seeding sequence.
 * @param {number} teamIdx - The index of the team currently being placed.
 * @param {boolean} enforceSafety - Whether to check for Quadrant rematches.
 */
function solveThirdPlaceRecursive(bracket, thirds, seedOrder, teamIdx, enforceSafety, byeSlots, auditLog) {
  
  // base case: all teams placed successfully
  if (teamIdx === thirds.length) return true;

  const currentTeam = thirds[teamIdx];
  const group = currentTeam[0];

  // find all available slots
  let availableSlots = [];
  for (let i = 0; i < bracket.length; i++) {
    if (bracket[i] === null && !byeSlots.includes(i)) availableSlots.push(i);
  }

  // sort slots by seed order
  availableSlots.sort((a, b) => seedOrder[a] - seedOrder[b]);

  // try each slot and identify whether there is a conflict
  for (let slot of availableSlots) {
    let canPlace = true;

    if (enforceSafety) {
      // check for groupmate in the same quadrant (bracketSize/4 range)
      const quadStart = Math.floor(slot / 4) * 4;
      const quadEntrants = bracket.slice(quadStart, quadStart + 4);
      if (quadEntrants.some(t => t && t[0] === group)) {
        canPlace = false;
      }
    }

    if (canPlace) {
      // place the team if safe
      bracket[slot] = currentTeam;
      auditLog.push(`[TRY] ${currentTeam[3]} (Grp ${group}) in Slot ${slot} (Rank ${seedOrder[slot]})`);

      // recursive call to try and place the rest of the teams with this placement in mind
      // teamIdx increments each time
      if (solveThirdPlaceRecursive(bracket, thirds, seedOrder, teamIdx + 1, enforceSafety, byeSlots, auditLog)) {
        return true; 
      }

      // dead end. remove the team and try the next slot
      bracket[slot] = null;
      auditLog.push(`[BACKTRACK] Removing ${currentTeam[3]} from Slot ${slot} (Match ${Math.floor(slot / 2) + 1}) - path leads to unavoidable conflict.`);
    } else {
      auditLog.push(`[SKIP] Slot ${slot} invalid for ${currentTeam[3]} due to group stage rematch before semi-final.`);
    }
  }

  // if no slots worked for this team in this branch, return false
  return false;
}
