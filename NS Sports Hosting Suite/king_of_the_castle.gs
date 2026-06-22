function simulateKingOfTheCastleSeason(rangeOfEntrants, numberOfRoundsRobin) {
  // simulates a season by Novum-castrum's "King of the Castle" rules

  // determine season length
  // if no number of rounds robin provided, default to 4
  var numberLoops = numberOfRoundsRobin === undefined ? 4 : numberOfRoundsRobin;
  var seasonLength = numberLoops * rangeOfEntrants.length;


}

  /* KING OF THE CASTLE SYSTEM
  
  There are three distinct roles/phases:
    - Pugnator (Challenger/Fighter)
    - Eversor  (Contender/Destroyer)
    - Custus   (Champion/Warden)

  At the beginning of the season, the championship is vacated and all teams are challengers (i.e. ineligible to be champion) and have any previous points reset to zero. 
  To become a contender (i.e. eligible to be champions), a team must reach two challenger points. 

  Challenger status
  A win during this status grants a team one challenger point, and a loss either subtracts one point or sets a team to minus one (whichever is lower).
  A draw resets a team to zero or leaves their score unchanged (whichever total is lower).

  Contender status
  Once a team reaches two challenger points, they become a “contender” (i.e. eligible to become champions) and the rules are adjusted slightly. 
  Upon becoming eligible, their challenger goal difference is considered zero, and only matches played at this status will adjust it
  Losses subtract one challenger point. Draws leave challenger points unchanged. If an eligible team reaches zero challenger points, they are no longer eligible. 

  To become champions, a team must accumulate four challenger points, or a cumulative challenger goal difference of +10.

  Becoming Champion / King of the Castle
  If two teams achieve four challenger points on the same matchday, the team with the best challenger goal difference is awarded the championship. 
  If two teams reach +10 challenger goal difference on the same matchday, the team to reach that point first is awarded the championship. 
  This does mean that scoring lots of goals as early as possible is in a team's best interests.

  Championship points
  As champions, teams are awarded three championship points per win, and one for a draw. 
  Goal difference is accumulated as normal. 
  A win by more than three goals earns a bonus point. A clean sheet also earns a bonus point. 
  If the champion team loses a game, the championship is immediately forfeit, and becomes available to any eligible teams on the next matchday. 
  The team that beat the champion is awarded three championship points, regardless of their status.

  Contender points
  Eligible teams (challengers) have their challenger points frozen while there is a champion except if they play against the champions.
  In such cases, a win awards them the championship, as well as the three point "conquest bonus". 
  
  Otherwise, they accumulate points and goal difference in the same way the champions do, but these are considered contender points and goal difference. 
  When a contender loses, two contender points are converted to challenger points to make them eligible again immediately. 
  
  If they have fewer than two contender points, they convert all of them. 
  Their goal difference and the remaining contender point are then “stashed” for tiebreaker purposes and the team begins the process as a challenger team again.

  Ranking
  At the end of the season, teams are ranked by the following metrics:
      Championship points
      Championship goal difference 
      Championship wins
      Contender points
      Contender goal difference
      Challenger points
      Challenger goal difference 
      Total wins
      Head to head results
      Head to head goal difference 
      Coin flip
      Determining the Champion

  If the team in the role of champion (or custus) at the end of the season is different to the team atop the rankings, two new titles are awarded:
    The number one ranked team are awarded the title of “Princeps” (first among equals)
    The reigning custus is awarded the title of “Interrex” (“between king”, or regent). 
  
  Then, a grand final match, The Discrimen (the decider, or discriminator) is played on neutral ground to determine the Imperator (commander, or emperor; the overall season champion).
 
  */
