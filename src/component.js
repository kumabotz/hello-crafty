// the grid component that allows an element to be located on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    });
  },

  // locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return {
        x: this.x / Game.map_grid.tile.width,
        y: this.y / Game.map_grid.tile.height
      };
    } else {
      this.attr({
        x: x * Game.map_grid.tile.width,
        y: y * Game.map_grid.tile.height
      });
      return this;
    }
  }
});

// an Actor is an entity that is drawn in 2D on canvas via our logical
// coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  }
});

// a Float is an just an Actor with a certain color that will disappear when
// on hit
Crafty.c('Float', {
  init: function() {
    this.requires('Actor');
  },

  collect: function() {
    this.destroy();
  }
});

// a Tree is just an Actor with a certain color
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 125, 40)');
  }
});

// a Bush is just an Actor with a certain color
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 185, 40)');
  }
});

// player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Color, Collision')
      .fourway(4)
      .color('rgb(20, 75, 40)')
      .stopOnSolids()
      // whenever the PC touches a cloud, respond to the event
      .onHit('Cloud', this.visitCloud)
      // whenever the PC touches a village, respond to the event
      .onHit('Village', this.visitVillage);
  },

  // register a stop-movement function to be called when this entity hits an
  // entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
    return this;
  },

  // stop the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

  // respond to player visiting a village
  visitVillage: function(data) {
    village = data[0].obj;
    village.collect();
  },

  // respond to player visiting a cloud
  visitCloud: function(data) {
    cloud = data[0].obj;
    cloud.collect();
  }
});

// village is a tile on the grid that the PC must visit in order to win the
// game
Crafty.c('Village', {
  init: function() {
    this.requires('Float, Color')
      .color('rgb(170, 125, 40)');
  }
});

// cloud is a tile that hide the player view
Crafty.c('Cloud', {
  init: function() {
    this.requires('Float, Color')
      .attr({
        w: Game.map_grid.tile.width * 3,
        h: Game.map_grid.tile.height * 2
      })
      .color('rgb(44, 44, 44)');
  }
});
