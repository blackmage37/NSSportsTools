function doubleEliminationBracket(rangeOfEntrants, seededDraw) {

  // outputs an object representing each matchup in the bracket

}

function generate2E_WinnersBracket(rangeOfEntrants, seededDraw) {

  // expects a range of entrants [ rank, entrant, nation ]
  // seededDraw default to true
  let useSeeds = seededDraw === undefined ? true : seededDraw;

  // sort entrants by rank
  rangeOfEntrants.sort((a, b) => a[0] - b[0]);

  // if not a power of two, then we need to add some BYEs
  let numberEntrants = rangeOfEntrants.length;
  let bracketSlots = 2;
  while (bracketSlots < numberEntrants) {
    bracketSlots *= 2;
  }
  let bracketEntrants = [...rangeOfEntrants];
  for (let i = numberEntrants; i < bracketSlots; i++) {
    bracketEntrants.push([ 0, 'BYE', 'BYE' ]);
  }

  // if not seeded, shuffle the entrants
  if (!useSeeds) {
    bracketEntrants = shuffleArray(bracketEntrants);
  }

  // build the bracket taking one entrant from each end of the list
  

}