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
        Crafty.e('Cloud').at(x, y);
      }
    }
  }

  this.show_victory = this.bind('VillageVisited', function() {
    if (!Crafty('Village').length) {
      Crafty.scene('Victory');
    }
  });
}, function() {
  this.unbind('VillageVisited', this.show_victory);
});

Crafty.scene('Victory', function() {
  Crafty.e('2D, DOM, Text')
    .attr({x: 0, y: 0})
    .text('Victory!');

  this.restart_game = this.bind('KeyDown', function() {
    Crafty.scene('Game');
  });
}, function() {
  this.unbind('KeyDown');
});
