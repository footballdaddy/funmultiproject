map = game.add.tilemap('map');
map.addTilesetImage('tiles');
// create our enemies group
enemies = game.add.group();
enemies.enableBody = true;
//  And now we convert all of the Tiled objects with an ID of 5 into sprites within the enemies 
groupmap.createFromObjects('enemies', 5, 'enemy',0, true, false, enemies);
// Loop trough all enemies and scale to the size we want
enemies.forEach(function(enemy){    enemy.scale.x = 1.5;    enemy.scale.y = 1.5;});

// Scaling enemies ^


// Removing TIles
removeTile = function(player, tile){
   ground.alpha = 0;
   ground.collideDown = false;   
   ground.collideUp = false;   
   ground.collideRight = false;   
   ground.collideLeft = false;   
   tile_layer.dirty = true;
};
update = function(){   
game.physics.arcade.collide(player, tile_layer, removeTile);
};

// In the update method handle the collision between the sprite or group with the layer.

game.physics.arcade.collide(group_or_sprite_to_use, main_layer, callback_function);

function callback_function(group_or_sprite,tile) { 
 //Do stuff with group_or_sprite (kill?)  
 map.removeTile(tile.x, tile.y)
 ;} 
