// game scene
// -------------
// runs the core gameplay loop
Crafty.scene('Game', function() {
  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }

  // player character, placed at 5, 5 on our grid
  this.player = Crafty.e('PlayerCharacter').at(5, 5);
  this.occupied[this.player.at().x][this.player.at().y] = true;

  // generate up to 5 village on the map in random locations
  var max_villages = 5;

  // place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      var at_edge = x === 0 || x === Game.map_grid.width - 1 ||
                    y === 0 || y === Game.map_grid.height - 1;
      if (at_edge) {
        // place a tree entity at the current tile
        Crafty.e('Tree').at(x, y);
        this.occupied[x][y] = true;
      } else {
        var random = Math.random(),
            place_village = random < 0.02,
            place_bush = random < 0.12;

        if (!this.occupied[x][y]) {
          if (place_village && Crafty('Village').length < max_villages) {
            Crafty.e('Village').at(x, y);
            this.occupied[x][y] = true;
          } else if (place_bush) {
            // place a bush entity at the current tile
            Crafty.e('Bush').at(x, y);
            this.occupied[x][y] = true;
          }
        }

        // cover with cloud to hide visibility
        if (x !== Game.map_grid.width - 2 && y !== Game.map_grid.height - 2) {
          Crafty.e('Cloud').at(x, y);
        }
      }
    }
  }

  // show the victory screen once all villages are visited
  this.show_victory = this.bind('VillageVisited', function() {
    if (!Crafty('Village').length) {
      Crafty.scene('Victory');
    }
  });
}, function() {
  // remove our event binding from above so that we don't end up having multiple
  // redundant event watchers after multiple restarts of the game
  this.unbind('VillageVisited', this.show_victory);
});

// Victory scene
// -------------
// tell the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
  // display some text in celebration of the victory
  Crafty.e('2D, DOM, Text')
    .attr({x: 0, y: 0})
    .text('Victory!');

  // watch for the player to press a key, then restart the game when a key is
  // pressed
  this.restart_game = this.bind('KeyDown', function() {
    Crafty.scene('Game');
  });
}, function() {
  // remove our event binding from above so that we don't end up having
  // multiple redundant event watchers after multiple restarts of the game
  this.unbind('KeyDown', this.restart_game);
});

// loading scene
// -------------
// handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function() {
  // draw some text for the player to see in case the file takes a noticeable
  // amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: Game.height() / 2 - 24, w: Game.width() })
    .css($text_css);

  // load our sprite map image
  Crafty.load(['assets/16x16_forest_1.gif', 'assets/hunter.png'], function() {
    // once the image is loaded...

    // define the individual sprites in the image
    // each one (spr_tree, etc) becomes a component
    // these components names are prefixed with "spr_" to remind us that they
    // simply cause the entity to be drawnn with a certain sprite
    Crafty.sprite(16, 'assets/16x16_forest_1.gif', {
      spr_tree:    [0, 0],
      spr_bush:    [1, 0],
      spr_village: [0, 1]
    });

    // define the PC sprite to be the first sprite in the third row of the
    // animation sprite map
    Crafty.sprite(16, 'assets/hunter.png', {
      spr_player: [0, 2]
    }, 0, 2);

    // now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  });
});