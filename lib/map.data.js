Map.Data = {};
	
Map.Data.init = function(){
	
	this.spawn = null;
	this.blocks = new Array();
	this.blockTypes = new Array();
	this.walls = new Array();
	this.wallTypes = new Array();
	this.liquids = new Array();
	this.liquidTypes = new Array();
	this.npcs = new Array();
	this.npcTypes = new Array();
	this.entities = new Array();
	this.entityTypes = new Array();
	
	// Setup instanced data
	for (var i=0; i < Map.blocksX; i++) {
		Map.Data.blocks[i] = new Array();
		Map.Data.walls[i] = new Array();
		Map.Data.liquids[i] = new Array();
		Map.Data.npcs[i] = new Array();
		Map.Data.entities[i] = new Array();
	};
	
}

Map.Data.populate = function(){
	
	$('#swatch-blocks').empty();
	for (var i=0; i < Map.Data.blockTypes.length; i++) {
		if(!Map.Data.blockTypes[i]){ continue; }
		$('#swatch-blocks').append('<a href="#block:'+i+'"><img src="'+Map.Data.blockTypes[i].sprites[0].image.src+'" /></a>');
	};
	
	$('#swatch-walls').empty();
	for (var i=0; i < Map.Data.wallTypes.length; i++) {
		if(!Map.Data.wallTypes[i]){ continue; }
		$('#swatch-walls').append('<a href="#wall:'+i+'"><img src="'+Map.Data.wallTypes[i].src+'" /></a>');
	};
	
	$('#swatch-liquids').empty();
	for (var i=0; i < Map.Data.liquidTypes.length; i++) {
		if(!Map.Data.liquidTypes[i]){ continue; }
		$('#swatch-liquids').append('<a href="#liquid:'+i+'"><img src="'+Map.Data.liquidTypes[i].src+'" /></a>');
	};
	
	$('#swatch-entities').empty();
	for (var i=0; i < Map.Data.entityTypes.length; i++) {
		if(!Map.Data.entityTypes[i]){ continue; }
		$('#swatch-entities').append('<a href="#entity:'+i+'"><img src="'+Map.Data.entityTypes[i].image.src+'" /></a>');
	};
	
	$('#swatch-npcs').empty();
	for (var i=0; i < Map.Data.npcTypes.length; i++) {
		if(!Map.Data.npcTypes[i]){ continue; }
		$('#swatch-npcs').append('<a href="#npc:'+i+'"><img src="'+Map.Data.npcTypes[i].image.src+'" /></a>');
	};
	
	

}


// Get a block from the canvas
Map.Data.getBlock = function(x,y,extra){
		
	if(extra == undefined){ extra = true; }
		
	if(x < 0 || y < 0 || x > Map.blocksX || y > Map.blocksY){
		return null;
	}
		
	block = Map.Data.blocks[x][y];
	if(!block){ return null; }
	block = Map.Data.blockTypes[block];
	if(!block){return null; }
	block.rotate = 0;
	block.frame = block.sprites[5];
		
		
	if(extra){
			
		extra_block = block;
			
		var top = true;
		var right = true;
		var bottom = true;
		var left = true;
			
		// Get Sprite
		if(Map.Data.getBlock(x,y-1,false)){ top = false; }
		if(this.getBlock(x+1,y,false)){ right = false; }
		if(this.getBlock(x,y+1,false)){ bottom = false; } 
		if(this.getBlock(x-1,y,false)){ left = false; } 

			
		if(top == true && right == false && bottom == false && left == false){
			extra_block.frame = extra_block.sprites[0];
		} else if(top == false && right == true && bottom == false && left == false){
			extra_block.frame = extra_block.sprites[0];
			extra_block.rotate = 90;
		} else if(top == false && right == false && bottom == true && left == false){
			extra_block.frame = extra_block.sprites[0];
			extra_block.rotate = 180;
		} else if(top == false && right == false && bottom == false && left == true){
			extra_block.frame = extra_block.sprites[0];
			extra_block.rotate = 270;
		} else if(top == false && right == true && bottom == false && left == true){
			extra_block.frame = extra_block.sprites[1];
		} else if(top == true && right == false && bottom == true && left == false){
			extra_block.frame = extra_block.sprites[1];
			extra_block.rotate = 90;
		} else if(top == true && right == false && bottom == false && left == true){
			extra_block.frame = extra_block.sprites[2];
		} else if(top == true && right == true && bottom == false && left == false){
			extra_block.frame = extra_block.sprites[2];
			extra_block.rotate = 90;
		} else if(top == false && right == true && bottom == true && left == false){
			extra_block.frame = extra_block.sprites[2];
			extra_block.rotate = 180;
		} else if(top == false && right == false && bottom == true && left == true){
			extra_block.frame = extra_block.sprites[2];
			extra_block.rotate = 270;
		} else if(top == true && right == true && bottom == false && left == true){
			extra_block.frame = extra_block.sprites[3];
			extra_block.rotate = 180;
		} else if(top == true && right == true && bottom == true && left == false){
			extra_block.frame = extra_block.sprites[3];
			extra_block.rotate = 270;
		} else if(top == false && right == true && bottom == true && left == true){
			extra_block.frame = extra_block.sprites[3];
		} else if(top == true && right == false && bottom == true && left == true){
			extra_block.frame = extra_block.sprites[3];
			extra_block.rotate = 90;
		} else if(top == true && right == true && bottom == true && left == true){
			extra_block.frame = extra_block.sprites[4];
		} else if(top == false && right == false && bottom == false && left == false){
			extra_block.frame = extra_block.sprites[5];
		} else {
			console.log('noblock');
		}

		return extra_block;
	}
		
	return block;
}

// Set instanced block as
Map.Data.setBlock = function(x,y,type){
	if( x < 0 || y < 0 || x > Map.blocksX || y > Map.blocksY ){ return null; }
	this.blocks[x][y] = type;
}

// Used for loading blocks into the map editor	
Map.Data.loadBlocks = function(blocks){
	$.each(blocks, function(index, type){
		bits = index.split(':');
		Map.Data.blocks[bits[0]][bits[1]] = type;
	});
}

// Should return result of the add
Map.Data.addBlockType = function(id,name,sprites){
	Map.Data.blockTypes[id] = {
		id:id,
		name: name,
		sprites: sprites
	}
	return true;
}

// Set the x,y cordiante with a type i, draws on change
Map.Data.set = function(type,x,y,i){
	
	if( x < 0 || y < 0 || x > Map.blocksX || y > Map.blocksY ){ return null; }
	
	if(type == 'block'){
		var block = Map.Data.getBlock(x,y);
		if(block != i){
			Map.Data.blocks[x][y] = i;
			//Map.draw();
		}
	} else if(type == 'wall'){
		Map.Data.walls[x][y] = i;
	} else if(type == 'liquid'){
		Map.Data.liquids[x][y] = i;
	} else if(type == 'npc'){
		Map.Data.npcs[x][y] = i;
	} else if(type == 'entity'){
		Map.Data.entities[x][y] = i;
	} else if(type == 'erase'){
		// i = 0 means all, we could do specfic types later on?
		delete Map.Data.blocks[x][y];
		delete Map.Data.walls[x][y];
		delete Map.Data.liquids[x][y];
		delete Map.Data.npcs[x][y];
		delete Map.Data.entities[x][y];
	}
	
}