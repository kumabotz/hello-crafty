// game obj has one element, start function
Game = {
  // initialize and start our game
  start: function() {
    // start crafty and set a background color so that we can see it's working
    Crafty.init(480, 320);
    Crafty.background('green');
  }
};