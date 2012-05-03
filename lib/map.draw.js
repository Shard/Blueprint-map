Map.benchmark = function(){
	var start = new Date().getTime();
	for (var i=0; i < 1000; i++) {
		this.draw();
	};
	var elapsed = new Date().getTime() - start;
	console.log(elapsed);
}

Map.draw = function(){
	
	// Setup
	var start = new Date().getTime();
	var topLeft = Map.Helper.blockAt(0,0); // Top left block visible
	var bottomRight = Map.Helper.blockAt(Map.cWidth,Map.cHeight); // Bottom right block visible
	
	// Clear Canvas
	this.c.fillStyle = 'rgb(191,191,191)';
	this.c.fillRect(0,0,Map.cWidth,Map.cHeight);
	this.c.fillStyle = "rgb(255,255,255)";
	this.c.fillRect(Map.cameraX,Map.cameraY,Map.blockW * Map.blocksX,Map.blockW * Map.blocksY);
	
	// Draw Blocks
	for (var x=topLeft.x; x <= bottomRight.x; x++) {
		for (var y=topLeft.y; y <= bottomRight.y; y++) {
			if( x < 0 || y < 0 || x > Map.blocksX || y > Map.blocksY ){ continue; } // Check if its safe
			
			// Strike the earth!
			var render_wall = true;
			var current_block = Map.Data.getBlock(x,y);
			
			if(Map.Layers.blocks && current_block){
				this.c.save();
				this.c.translate( (this.cameraX + (x * Map.blockW)) + Map.blockW / 2,  this.cameraY + (y * Map.blockW) + Map.blockW / 2 );
				this.c.rotate(current_block.rotate * Math.PI / 180);
				this.c.drawImage( current_block.frame.image, -Map.blockW / 2, -Map.blockW / 2,Map.blockW,Map.blockW);
				this.c.restore();
				render_wall = false;
			}
			
			if( Map.Layers.walls && render_wall){
				var current_wall = Map.Data.walls[x][y];
				if(current_wall){
					this.c.drawImage( Map.Data.wallTypes[current_wall], (x * Map.blockW) + this.cameraX, (y * Map.blockW) + this.cameraY, Map.blockW, Map.blockW );
				}
			}
			
			if(Map.Layers.entities){
				var current_entity = Map.Data.entities[x][y];
				if(current_entity){
					this.c.drawImage( 
						Map.Data.entityTypes[current_entity].image,
						(x * Map.blockW) + this.cameraX,
						(y * Map.blockW) + this.cameraY - ( Map.Data.entityTypes[current_entity].h * Map.blockW ) + Map.blockW,
						Map.blockW *  Map.Data.entityTypes[current_entity].w,
						Map.blockW *  Map.Data.entityTypes[current_entity].h
					);
				}
			}
			
			if(Map.Layers.npcs){
				var current_npc = Map.Data.npcs[x][y];
				if( current_npc ){ // May be off on the x axis?
					var scale = Map.blockW / 24;
					var width = Map.Data.npcTypes[current_npc].w * scale;
					var height = Map.Data.npcTypes[current_npc].h * scale;
					var offset_x = ((width - 24) / 4) * -1;
					var offset_y = (height - Map.blockW) * -1;
					this.c.drawImage( 
						Map.Data.npcTypes[current_npc].image,
						Map.cameraX + (x * Map.blockW) + offset_x ,
						Map.cameraY + (y * Map.blockW) + offset_y,
						width,
						height
					);
				}
			}
			
			if(Map.Layers.liquids){
				var current_liquid = Map.Data.liquids[x][y];
				if(current_liquid){
					this.c.drawImage( Map.Data.liquidTypes[current_liquid], (x * Map.blockW) + this.cameraX, (y * Map.blockW) + this.cameraY, Map.blockW, Map.blockW);
				}
			}
			
		}
	}
	
	// Drag Area
	if(Map.Tools.Rectangle.drag_start && Map.Tools.Rectangle.drag_end){
		if(Map.Tools.Rectangle.drag_end.x >= Map.Tools.Rectangle.drag_start.x){ addx = Map.blockW; } else { addx = 0; }
		if(Map.Tools.Rectangle.drag_end.y >= Map.Tools.Rectangle.drag_start.y){ addy = Map.blockW; } else { addy = 0; }
		this.c.fillStyle = "rgba(0,0,0,0.2)";
		this.c.fillRect( 
			(Map.Tools.Rectangle.drag_start.x * Map.blockW) + Map.cameraX,
			(Map.Tools.Rectangle.drag_start.y * Map.blockW) + Map.cameraY,
			((Map.Tools.Rectangle.drag_end.x - Map.Tools.Rectangle.drag_start.x) * Map.blockW) + addx,
			((Map.Tools.Rectangle.drag_end.y - Map.Tools.Rectangle.drag_start.y) * Map.blockW) + addy
		);
	}
	
	// Other Drawing
	if(Map.Ui.grid){ Map.drawGrid(topLeft,bottomRight); }
	if(Map.spawn_point){
		var scale = Map.blockW / 24;
		var width = 34 * scale;
		var height = 54 * scale;
		var offset_x = ((width - 24) / 4) * -1;
		var offset_y = (height - Map.blockW) * -1;
		this.c.drawImage( Map.spawn_point_image, Map.cameraX + (Map.spawn_point.x * Map.blockW) + offset_x , Map.cameraY + (Map.spawn_point.y * Map.blockW) + offset_y, width, height );
	}
	if(Map.Ui.ruler){ Map.drawRuler(topLeft,bottomRight); }
	
	// Finish Up
	var elapsed = new Date().getTime() - start;
	//if(elapsed > 40){ Map.c.fillStyle = "rgb(255,0,0)"; } else { Map.c.fillStyle = "rgb(0,0,0)"; }
	//Map.c.fillText("Drawtime: " + elapsed + 'ms', Map.cWidth - 70, Map.cHeight - 10);
	
}

Map.drawGrid = function(topLeft, bottomRight){
	Map.c.fillStyle = 'rgba(0,0,0,0.1)';
	for(var x = topLeft.x; x <= bottomRight.x; x++){
		Map.c.fillRect(this.cameraX + (x * Map.blockW), 0, 1, Map.cHeight);
	}
	for(var y = topLeft.y; y <= bottomRight.y; y++){
		Map.c.fillRect(0, this.cameraY + (y * Map.blockW), Map.cWidth, 1);
	}
}

Map.drawRuler = function(topLeft, bottomRight){

	// Draw ruler backdrop
	Map.c.fillStyle = 'rgb(255,255,255)';
	Map.c.fillRect(0,0,Map.cWidth, 20);
	Map.c.fillRect(0,0,20,Map.cHeight);
	Map.c.fillStyle = 'rgb(0,0,0)';
	Map.c.textAlign = "center";
	Map.c.fillRect(0,20,Map.cWidth, 1);
	Map.c.fillRect(20,0, 1, Map.cHeight);
	
	// Draw Ruler
	for(var x = topLeft.x; x <= bottomRight.x; x++){
		Map.c.fillRect(this.cameraX + (x * Map.blockW), 16, 1, 4);
		Map.c.fillText(x, this.cameraX + (x * Map.blockW) + Map.blockW/2, 10); // Need to proper align
	}
	for(var y = topLeft.y; y <= bottomRight.y; y++){
		Map.c.fillRect(16, this.cameraY + (y * Map.blockW), 4, 1);
		Map.c.fillText(y, 10, this.cameraY + (y * Map.blockW) + Map.blockW/2 + 3); // Need to proper align
	}
	
	// Draw top Left box
	Map.c.fillStyle = "rgb(255,255,255)";
	Map.c.fillRect(0,0,20,20);
}
