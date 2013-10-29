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

// a Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Solid, spr_tree');
  }
});

// a Bush is just an Actor with a certain sprite
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Solid, spr_bush');
  }
});

// a Rock is just an Actor with a certain sprite
Crafty.c('Rock', {
  init: function() {
    this.requires('Actor, Solid, spr_rock');
  }
});

// this is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
      .fourway(2)
      .stopOnSolids()
      // whenever the PC touches a cloud, respond to the event
      .onHit('Cloud', this.visitCloud)
      // whenever the PC touches a village, respond to the event
      .onHit('Village', this.visitVillage)
      // these next lines define our four animations each call to .animate
      // specifies:
      // - the name of the animation
      // - the x and y corrdinates within the sprite map at which the animation
      //   set begins
      // - the number of animation frames *in addition to* the first one
      .animate('PlayerMovingUp',    0, 0, 2)
      .animate('PlayerMovingRight', 0, 1, 2)
      .animate('PlayerMovingDown',  0, 2, 2)
      .animate('PlayerMovingLeft',  0, 3, 2);

    // watch for a change of direction and switch animations accordingly
    var animation_speed = 4;
    this.bind('NewDirection', function(data) {
      if (data.x > 0) {
        this.animate('PlayerMovingRight', animation_speed, -1);
      } else if (data.x < 0) {
        this.animate('PlayerMovingLeft', animation_speed, -1);
      } else if (data.y > 0) {
        this.animate('PlayerMovingDown', animation_speed, -1);
      } else if (data.y < 0) {
        this.animate('PlayerMovingUp', animation_speed, -1);
      } else {
        this.stop();
      }
    });
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

  // respond to this player visiting a village
  visitVillage: function(data) {
    village = data[0].obj;
    village.visit();
  },

  // respond to player visiting a cloud
  visitCloud: function(data) {
    cloud = data[0].obj;
    cloud.collect();
  }
});

// a village is a tile on the grid that the PC must visit in order to win the
// game
Crafty.c('Village', {
  init: function() {
    this.requires('Actor, spr_village');
  },

  // process a visitation with this village
  visit: function() {
    this.destroy();
    Crafty.audio.play('knock');
    Crafty.trigger('VillageVisited', this);
  }
});

// cloud is a tile that hide the player view
Crafty.c('Cloud', {
  init: function() {
    this.requires('Actor, Color')
      .attr({
        w: Game.map_grid.tile.width * 2,
        h: Game.map_grid.tile.height * 2
      })
      .color('rgb(44, 44, 44)');
  },

  collect: function() {
    this.destroy();
  }
});
