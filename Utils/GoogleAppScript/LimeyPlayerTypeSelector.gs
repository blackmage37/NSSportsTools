function PLAYERTYPE(dateOfBirth) {

  var dob = new Date(dateOfBirth);
  var yr = dob.getFullYear();
  var r = Math.random();

  // if 2300 or later, can be an all-rounder
  if (yr >= 2300) {
    // 2% chance of all-rounder
    // 43% runner or hitter
    // 12% lumberjack
    switch(true) {
      case r <= 0.02:
        return 'A';
      case r <=0.45:
        return 'R';
      case r <=0.88:
        return 'H';
      default:
        return 'L';
    }
  } else {
    // otherwise, bump runner/hitter chances 1% each
    switch(true) {
      case r <=0.44:
        return 'R';
      case r <=0.88:
        return 'H';
      default:
        return 'L';
    }
  }

}