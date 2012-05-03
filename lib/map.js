Map = {
	cameraX: 0, // X position of the camera, used for offsetting
	cameraY: 0,// Y position of the camera, used for offsetting
	c: null,// the canvas context 
	Tools: {
		active: null //Active tool being used
	},
	Helper: {},
	Events: {
		onsave: function(){} // Call after save, passes through 1 arg which contains the map data
	},
	cWidth: 0, // Canvas Width
	cHeight: 0, // Canvas Height
	blocksX: 700, // How many blocks wide
	blocksY: 200, // How many blocks tall
	blockW: 24, // The width of blocks that will be rendered
	selected: null, // The selected object (block:1 || wall:3 || npc:22)
	spawn_point: {x:30,y:5}, // The location of the spawn point
	spawn_point_image: null, // The image for the spawn point
	isFullscreen: false,
	Layers: {
		blocks:true,
		walls:true,
		liquids:true,
		npcs:true,
		entities:true
	}
}

Map.changeCursor = function(cursor){
	$('#mapper-canvas, #mapper-wrap .panel').css('cursor', cursor);
}

Map.Helper.blockAt = function(x,y,applyCamera){
	
	// If event is passed instead, instead use function(e,applyCamera)
	if(x.offsetX != undefined){
		var e = x;
		applyCamera = y;
		if(Map.isFullscreen){
			x = e.clientX;
			y = e.clientY;
		} else {
			x = e.offsetX;
			y = e.offsetY;
		}
	}
	
	if(applyCamera == undefined){ applyCamera = true; }
	if(applyCamera){
		x -= Map.cameraX;
		y -= Map.cameraY;
	}
	
	x = Math.floor(x / Map.blockW);
	y = Math.floor(y / Map.blockW);
	
	return {x:x,y:y};
	
}

// Enables all map functionality
Map.enable = function(){
	
	$(document).bind('keydown', function(e){
		Map.Tools.keydown(e);
		Map.Ui.keydown(e);
	});
	
	$(document).bind('mousedown', function(e){
		if(e.toElement.id != 'mapper-canvas' && !$.contains($('#mapper-wrap'), e.toElement) ){ return true; }
		Map.Tools.handleEvent('mousedown', e);
		Map.mousedown = true;
		return false;
	}).bind('mousemove', function(e){
		Map.Tools.handleEvent('mousemove', e);
		return false;
	}).bind('mouseup', function(e){
		Map.Tools.handleEvent('mouseup', e);
		Map.mousedown = false;
		return false;
	}).bind('click', function(e){
		if(e.toElement.id != 'mapper-canvas' && !$.contains($('#mapper-wrap'), e.toElement) ){ return true; }
		Map.Tools.handleEvent('click', e);
		return false;
	});
	
}

// Disables all map functionality, useful for tabbed interfaces
Map.disable = function(){
	
	$(document).unbind('keydown');
	$(document).unbind('mousedown').unbind('mousemove').unbind('mouseup');
	
}

Map.fullscreen = function(){
	
	// Remember what we were
	Map.old_width = Map.cWidth;
	Map.old_height = Map.cHeight;
	
	
	// Do fullscreen
	Map.cWidth = $(document).width();
	Map.cHeight = $(document).height();
	$('#mapper-canvas')
		.width( Map.cWidth )
		.height( Map.cHeight )
		.parent().addClass('mapper-fullscreen')
	$('#mapper-canvas')[0].width = Map.cWidth;
	$('#mapper-canvas')[0].height = Map.cHeight;
	this.isFullscreen = true;
	
	Map.Panel.update();
	Map.draw();
	
}

Map.revertFullscreen = function(){
	
	// Do Normal Screen
	Map.cWidth = Map.old_width;
	Map.cHeight = Map.old_height;
	$('#mapper-canvas')
		.width( Map.cWidth )
		.height( Map.cHeight )
		.parent().removeClass('mapper-fullscreen');
	$('#mapper-canvas')[0].width = Map.cWidth;
	$('#mapper-canvas')[0].height = Map.cHeight;
	this.isFullscreen = false;
	
	Map.Panel.update();
	Map.draw();
	
}

Map.save = function(){
	
	data = {
		blocks: {},
		spawn: Map.spawn_point
	};
	
	// Blocks
	for (var x=0; x < Map.blocksX; x++) {
		for (var y=0; y < Map.blocksY; y++) {
			if(Map.Data.blocks[x][y]){
				data.blocks[x + ":" + y] = Map.Data.blocks[x][y];
			}
		};
	};
	data.blocks = JSON.stringify(data.blocks);
	data.spawn = data.spawn.x + ":" + data.spawn.y;
	
	Map.Events.onsave(data);
	
	return data;
	
}
