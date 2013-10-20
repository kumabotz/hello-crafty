Game = {
  // define our grid's size and the size of each of its tiles
  map_grid: {
    width: 24,
    height: 16,
    tile: {
      width: 24,
      height: 24
    }
  },

  // total width of the game screen. Since our grid takes up the entire screen
  // this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  // total height of the game screen. Since our grid takes up the entire screen
  // this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  // initialize and start our game
  start: function() {
    // start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background('rgb(249, 223, 125)');

    // simply start the Game scene to get things going
    Crafty.scene('Game');
  }
};