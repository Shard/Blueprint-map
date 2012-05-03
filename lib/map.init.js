Map.init = function(selector){
	
	$(document).ready(function(){
		
		// Pre Setup
		Map.bind();
		
		// Setup Canvas
		Map.cWidth = $('#mapper-canvas').width();
		Map.cHeight = $('#mapper-canvas').height();
		$('#mapper-canvas').attr('width', Map.cWidth);
		$('#mapper-canvas').attr('height', Map.cHeight);
		$('#mapper-canvas').removeAttr('style');
		$('#mapper-canvas').css('z-index', 900);
		Map.c = $('#mapper-canvas')[0].getContext('2d');
		
		// Init Modules
		Map.Panel.init();
		Map.Tools.init();
		Map.Data.init();
		Map.Ui.init();
		Map.enable();
		Map.Data.populate();
		
		// Load Assets and start drawing
		Map.spawn_point_image = new Image();
		Map.spawn_point_image.src = "/img/spawn.png";
		Map.spawn_point_image.onload = function(){
			Map.draw();
		}
	});
}

Map.bind = function(){
	
	$('#mpanel-swatch').on('click', 'a', function(){
		$('#mpanel-swatch a.active').removeClass('active');
		$(this).addClass('active');
		Map.selected = $(this).attr('href').replace('#','');
		$('#mtool-Erase').removeClass('btn-danger');
		return false;
	});
	
	$('#mpanel-blocks').on('click', 'a', function(){
		$('#mpanel-blocks a.active').removeClass('active');
		$(this).addClass('active');
		Map.selected_block_type = $(this).attr('block-type');
		return false;
	});
	$('#save-map').click(function(){ Map.save();return false; });
	
	// Panel bindings and setup
	$('#swatch-tabs').on('click', 'a', function(){
		$(this).parent().find('a.btn-primary').removeClass('btn-primary').find('i').removeClass('icon-white');
		$(this).addClass('btn-primary').find('i').addClass('icon-white');
		$('#swatch-content > div').hide();
		$('#swatch-content ' + $(this).attr('href')).show();
		return false;
	});
	
	// Update Layers
	$('#mpanel-layers').on('click', 'input', function(){
		var type = $(this).attr('name');
		var status = $(this).is(':checked');
		Map.Layers[type] = status;
		Map.draw();
	});
	
	$('#toggle-layers').click(function(){
		if($('#mpanel-layers').is(':visible')){
			$('#mpanel-layers').fadeOut(300, 'swing');
		} else {
			$('#mpanel-layers').fadeIn(300, 'swing');
		}
		return false;
	});
	
	$('#mtool-Erase').click(function(){
		if(Map.selected == 'erase:0'){
			Map.selected = null;
			$('#mtool-Erase').removeClass('btn-danger');
		} else {
			Map.selected = 'erase:0';
			$('#mtool-Erase').addClass('btn-danger');
			$('#mpanel-swatch a.active').removeClass('active');
			if( _.indexOf(["Draw","Rectangle"], Map.Tools.active) == -1 ){
				Map.Tools.use('Draw');
			}
		}
		return false;
	});
	
	$('#toggle-fullscreen').click(function(){
		if(Map.isFullscreen){
			Map.revertFullscreen();
		} else {
			Map.fullscreen();
		}
		return false;
	});
	
	// Set Default
	$('a[href="#swatch-blocks"]').click();
	
}

// Used for creating sprite objects
Map.mockSprite = function(image_name,top,right,bottom,left){
	
	if(top == undefined){ top = false; }
	if(right == undefined){ right = false; }
	if(bottom == undefined){ bottom = false; }
	if(left == undefined){ left = false; }
	
	image = new Image();
	image.src = image_name;
	image.loaded = false;
	image.onload = function(){ this.loaded = true; }
	return {
		top:top,
		right:right,
		bottom:bottom,
		left:left,
		image:image
	}
}

// Used for testing
Map.mock = function(){
	
	$(document).ready(function(){
		
		// Blocks
		for (var x=0; x < 20; x++) {
			for (var y=0; y < 20; y++) {
				Map.Data.blocks[x][y] = 1;
			};
		};

		Map.Data.blocks[1][1] = 1;
		Map.Data.blocks[4][8] = 1;
		Map.Data.blocks[5][8] = 1;

		Map.Data.addBlockType(1, "Dirt", [
			Map.mockSprite("/img/1.png", true),
			Map.mockSprite("/img/2.png", false, true, false, true),
			Map.mockSprite("/img/3.png", true, false, false, true),
			Map.mockSprite("/img/4.png", false, true, true, true),
			Map.mockSprite("/img/5.png", true, true, true, true),
			Map.mockSprite("/img/6.png")
		]);
		
		// Walls
		var img = new Image();
		img.src = '/img/wall.png';
		Map.Data.wallTypes[1] = img;
		
		Map.Data.walls[20][20] = 1;
		Map.Data.walls[20][21] = 1;
		
		// Liquids
		var img = new Image();
		img.src = '/img/water.png';
		Map.Data.liquidTypes[1] = img;
		
		var img = new Image();
		img.src = '/img/lava.png';
		Map.Data.liquidTypes[2] = img;
		
		Map.Data.liquids[30][1] = 1;
		Map.Data.liquids[30][2] = 1;
		Map.Data.liquids[30][3] = 1;
		Map.Data.liquids[32][1] = 2;
		Map.Data.liquids[32][2] = 2;
		Map.Data.liquids[32][3] = 2;
		
		// Npcs
		var img = new Image();
		img.src = '/img/npc.png'
		Map.Data.npcTypes[1] = {
			name: "knight",
			w: 34,
			h: 54,
			image: img
		}
		
		Map.Data.npcs[35][20] = 1;
		
		// Entities
		var img = new Image();
		img.src = '/img/door.png';
		Map.Data.entityTypes[1] = {
			w: 1,
			h: 2,
			image: img
		}
		
		var img = new Image();
		img.src = '/img/chest.png';
		Map.Data.entityTypes[2] = {
			w: 1,
			h: 1,
			image: img
		}
		
		Map.Data.entities[4][30] = 1;
		Map.Data.entities[10][30] = 2;
		
		
		// Finish
		Map.Data.populate();
		
	});
	
}