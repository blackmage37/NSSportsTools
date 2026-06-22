/**
 * Draws a group stage from a rangeOfEntrants
 *
 * @param {Array<string>} rangeOfEntrants A range containing Ranks (numeric), Names, and Nations, in that order. Ranks must be ordinal.
 * @param {number} numberOfGroups The number of groups desired
 * @param {boolean} seededDraw If false, the draw will be unseeded. Defaults to true (seeded draws).
 * @return An array of groups. Order of teams within each group is randomised.
 * @customfunction
 */
function drawGroupStage(rangeOfEntrants, numberOfGroups, seededDraw) {
  // pass original entrants range and do pot sorting within this function
  // default to a seeded draw
  let seeded = seededDraw === undefined ? true : seededDraw;

  // if no number of groups specified, exit function
  if (numberOfGroups === undefined) { return 'Number of Groups not specified'; }

  let teamsPerGroup = rangeOfEntrants.length / numberOfGroups;
  
  // build group array
  let groups = [];
  for (let i = 0; i < numberOfGroups; i++) {
    groups.push([]);
    for (let j = 0; j < teamsPerGroup; j++) {
      groups[i].push([])
    }
  }

  // do the draw
  if (seeded) {
    
    const pots = createVariablePots(rangeOfEntrants, teamsPerGroup);

    // loop through pots
    let teamNo = 0;
    pots.forEach(pot => {
      // shuffle the order of teams in the pot
      shuffleArray(pot);
      for (let i = 0; i < numberOfGroups; i++) {
        // pop the team in the list
        let teamToAdd = pot.pop();
        groups[i][teamNo] = teamToAdd;
        // shuffle the order of teams in the pot again
        shuffleArray(pot);
      }
      // increment here so we can place the next team (this is where we prepare to use the next pot)
      teamNo++;    
    });
  } else {
    // just select randomly from the full list. no need for pots.
    teams = shuffleArrayCopy(rangeOfEntrants);
    for (let i = 0; i < numberOfGroups; i++) {
      for (let j = 0; j < teamsPerGroup; j++) {
        groups[i][j] = teams.pop();
      }
      teams = shuffleArrayCopy(rangeOfEntrants);    // additional shuffle after each group is done
    }
  }

  // shuffle the order of teams within each group, and flatten to produce a table of groups with team names only
  let flatGroups = groups.map(group => {
    return shuffleArrayCopy([...group]).flatMap(team => {
      return [ team[1] ];
    })
  })

  return flatGroups;

}

/**
 * Draws a group stage from a rangeOfEntrants
 *
 * @param {Array<string>} rangeOfEntrants A range containing Ranks (numeric), Names, and Nations, in that order. Leave the hosts out of this range. Ranks must be ordinal.
 * @param {Array<string>} hostsRange A range containing Ranks (numeric), Names, and Nations of HOSTS ONLY. Ranks must be ordinal.
 * @param {number} numberOfGroups The number of groups desired
 * @param {boolean} seededDraw If false, the draw will be unseeded. Defaults to true (seeded draws).
 * @return An array of groups with hosts in fixed groups. If a seeded draw, hosts are treated as Pot 1. Order of teams within each group is randomised.
 * @customfunction
 */
function drawGroupsFixedHosts(rangeOfEntrants, hostsRange, numberOfGroups, seededDraw) {

  // pass original entrants range and do pot sorting within this function
  // default to a seeded draw
  let seeded = seededDraw === undefined ? true : seededDraw;

  // if no number of groups specified, exit function
  if (numberOfGroups === undefined) { return 'Number of Groups not specified'; }

  let teamsPerGroup = (rangeOfEntrants.length + hostsRange.length) / numberOfGroups;
  let groupSpacing = Math.floor(numberOfGroups / hostsRange.length);

  // build group array
  let groups = [];
  for (let i = 0; i < numberOfGroups; i++) {
    groups.push([]);
    for (let j = 0; j < teamsPerGroup; j++) {
      groups[i].push([])
    }
  }

  // do the draw
  if (seeded) {
    
    let fullRangeOfEntrants = hostsRange.concat(rangeOfEntrants);
    let pots = createVariablePots(fullRangeOfEntrants, teamsPerGroup);

    // pot 1 contains hosts, so remove them and place them in their fixed positions
    let counter = 0;
    hostsRange.forEach(host => {
      let grpNum = counter * groupSpacing;
      groups[grpNum][0] = host;
      counter++;
    });

    let firstPot = pots.shift();
    for (let i = 0; i < firstPot.length; i++) {
      if (hostsRange.includes(firstPot[i])) {
        firstPot.shift();
        i--;
      }
    }

    // now place the remaining teams
    shuffleArray(firstPot);
    let grpNum = 1;   // start at 1 (Grp B) because we know Group A has a host in there already
    firstPot.forEach(team => {
      // find next available slot
      while (groups[grpNum][0][1] !== undefined) {
        grpNum++
      }
      groups[grpNum][0] = team;
      grpNum++;
    })

    // loop through pots 2-n
    let teamNo = 1;     // start at second slot in each group, because they should all have one team each already
    pots.forEach(pot => {
      // shuffle the order of teams in the pot
      shuffleArray(pot);
      for (let i = 0; i < numberOfGroups; i++) {

        // pop the team in the list
        let teamToAdd = pot.pop();
        
        // only populate a slot if there is no team there already
        if (groups[i][teamNo][1] === undefined) {
          groups[i][teamNo] = teamToAdd;
        } 

        // shuffle the order of teams in the pot again
        shuffleArray(pot);
      }
      // increment here so we can place the next team (this is where we prepare to use the next pot)
      teamNo++;    
    });
  } else {

    // place hosts first
    let counter = 0;
    hostsRange.forEach(host => {
      let grpNum = counter * groupSpacing;
      groups[grpNum][0] = host;
      counter++;
    });

    // just select randomly from the full list. no need for pots.
    teams = shuffleArrayCopy(rangeOfEntrants);
    for (let i = 0; i < numberOfGroups; i++) {
      for (let j = 0; j < teamsPerGroup; j++) {
        // only populate a slot if there is no team there already
        if (groups[i][j][1] === undefined) {
          groups[i][j] = teams.pop();
        } 
      }
      teams = shuffleArrayCopy(rangeOfEntrants);    // additional shuffle after each group is done
    }
  }

  // shuffle the order of teams within each group, and flatten to produce a table of groups with team names only
  let flatGroups = groups.map(group => {
    return shuffleArrayCopy([...group]).flatMap(team => {
      return [ team[1] ];
    })
  })

  return flatGroups;

}