/**
 * Builds a menu under "NS Sport" in the top ribbon when the file is opened
 *
 * @customfunction
 */
function onOpen() {
  // build top menu
  SpreadsheetApp.getUi()
    .createMenu('NS Sport')

    // menu_other: things that don't fit into the other sub menu groupings
    .addItem('Simulate Coin Flip', 'runCoinFlip')    
    
    // menu_tablegen: table generators
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Table Generators')
      .addItem('Regular', 'runTableGen')
      .addItem('Hockey', 'runHockeyTableGen')
    )

    .addSeparator()

    // menu_fixtures: scheduling functions
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Fixture Generators')
      .addItem('Bluebones', 'runBluebones')
      .addSubMenu(SpreadsheetApp.getUi().createMenu('FIDE Swiss')
        .addItem('Swiss (FIDE Dutch) Tournament', 'runFIDESwiss')
        .addItem('Next FIDE Swiss Round', 'runFIDESwiss_NextRound')
      )
      .addSubMenu(SpreadsheetApp.getUi().createMenu('FIDE Swiss')
        .addItem('Casaran Tournament', 'runCasaran')
        .addItem('Next Casaran Round', 'runCasaran_NextRound')
      )
      .addItem('Helvetica Scenario', 'runHelveticaScenario')
      .addItem('Inter-Conference (NSFS Style)', 'runInterConference')
      .addItem('Inter-Conference (NFL Style)', 'runNFLStyle')
    )
    
    // menu_knockout: knockout bracket functions
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Knockout Brackets')    
      .addItem('Qusma Seeded Bracket', 'runQusmaDraw')
      .addItem('Double Elimination', 'runDoubleElim')
      .addItem('Triple Elimination', 'runTripleElim')
      .addItem('Page Playoff', 'runPagePlayoff')
      .addItem('Stepladder Bracket', 'buildStepladderBracket')
      .addItem('Tennis Style', 'runTennisStyleBracket')
      .addSubMenu(SpreadsheetApp.getUi().createMenu('Seeded Draw')
        .addItem('Nation Protected', 'runAvoidNation_Seeded')
        .addItem('No Protection', 'runDraw_Seeded')
      )
      .addSubMenu(SpreadsheetApp.getUi().createMenu('Unseeded Draw')
        .addItem('Nation Protected', 'runAvoidNation_Unseeded')
        .addItem('No Protection', 'runDraw_Unseeded')
      )
    )

    // menu_groups: group stage functions
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Group Stages')
      .addSubMenu(SpreadsheetApp.getUi().createMenu('Standard Group Draw')
        .addItem('Seeded', 'runGroupDraw_Seeded')
        .addItem('Unseeded', 'runGroupDraw_Unseeded')
      )
      .addItem('UEFA CL Style', 'runCLLeaguePhaseDraw')
      .addItem('Arial Scenario', 'runArialScenario')
    )

    .addSeparator()
    
    // menu_other: things that don't fit into the other sub menu groupings
    .addItem('Create Pots', 'runVariablePots')
    .addItem('Ladder Matchmaking', 'runLadderMatchmaking')
    
    .addSeparator()

    // menu_ranks: rank-related functions
    .addItem('Normalise Ranks', 'runRankNormaliser')
    .addItem('Analyse Ranks', 'runRankAnalysis')
    .addItem('Analyse RP Bonus Data', 'runRPBonusAnalysis')
/*    
    .addSeparator()

    // menu_scorinate: scorination functions
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Scorination')
      .addItem('Single Match', 'runScorinateSingleMatch')
      .addItem('League', 'runScorinateLeague')
      .addItem('Stepladder Tournament', 'runStepladderTournament')
    )
/*
/*
    .addSeparator()

    // menu_tiebreakers: tiebreaker functions
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Match Tiebreakers')
      .addItem('Penalty Shootout', 'runPenaltyShootout')
      .addItem('Imperial Shootout', 'runImperialShootout')
      .addItem('Evil Penalties', 'runEvilPenalties')
      .addItem('Chaotic Penalties', 'runChaoticPenalties')
      .addItem('Attacker-Defender-Goalkeeper', 'runADGTiebreak')
      .addItem('Crossbar Challenge', 'runCrossbarChallenge')
      .addItem('HORSE', 'runHORSETiebreak')
      .addItem('Lag Curling', 'runLagCurling')
    )
*/
/*
    .addSeparator()

    // menu_experimental: weird formats for Os' puppet nations and whatnot
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Experimental Formats')
      .addItem('King of the Castle', 'runKingOfTheCastle')
      .addItem('Kage no Ryouiki', 'runKageNoRyouikiTableGen')
      .addItem('Callistea', 'runCallisteaTableGen')
      .addItem('Marmaladaica', 'runMarmaladaicaTableGen')
      .addItem('Xiaolin', 'runXiaolinSeason')
    )
*/
/*    
    .addSeparator()

    // other admin functions?
*/
    .addToUi();
  
  showSidebar();
  
}