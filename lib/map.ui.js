Map.Ui = {}

Map.Ui.init = function(){
	Map.Ui.ruler = false;
	Map.Ui.grid = true;
}

Map.Ui.keydown = function(e){
	if(e.keyCode == 82){ this.toggleRuler(); } // r
	if(e.keyCode == 222){ this.toggleGrid(); } // '
	if(e.keyCode == 72){ this.toggleHelp(); } // h
	if(e.keyCode == 192){ Map.zoom(30, true); Map.draw(); } // `
	if(e.keyCode == 49){ Map.zoom(24, true); Map.draw(); } // 1
	if(e.keyCode == 50){ Map.zoom(20, true); Map.draw(); } // 2
	if(e.keyCode == 51){ Map.zoom(16, true); Map.draw(); } // 3
	if(e.keyCode == 52){ Map.zoom(12, true); Map.draw(); } // 4
	if(e.keyCode == 53){ Map.zoom(8, true); Map.draw(); } // 5
}

// Toggles Help
Map.Ui.toggleHelp = function(){
	if( $('#mapper-wrap .help').is(':hidden') ){
		$('#mapper-wrap').addClass('mapper-help');
		$('#mapper-wrap .help').show();
	} else {
		$('#mapper-wrap').removeClass('mapper-help');
		$('#mapper-wrap .help').hide();
	}
	Map.Panel.update();
}

// Toggles the ruler
Map.Ui.toggleRuler = function(draw){
	if(draw == undefined){draw = true;}
	if(this.ruler){
		Map.Panel.adjustOffset(-20,0,0,-20);
		this.ruler = false;
	} else {
		Map.Panel.adjustOffset(20,0,0,20);
		this.ruler = true;
	}
	if(draw){Map.draw();}
}

// Toggles the grid
Map.Ui.toggleGrid = function(draw){
	if(draw == undefined){draw = true;}
	if(this.grid){
		this.grid = false;
	} else {
		this.grid = true;
	}
	if(draw){Map.draw(); }
}

Map.zoom = function(value, absolute){
	
	var older = Map.Helper.blockAt( Map.cWidth / 2, Map.cHeight / 2, true );
	
	if(absolute == undefined || absolute == false){
		Map.blockW += value;
		var change = value;
	} else {
		var change = value - Map.blockW;
		Map.blockW = value;
	}
	// Align Zoom
	if(change){
		var newer = Map.Helper.blockAt( Map.cWidth / 2, Map.cHeight / 2, true );
		Map.cameraX += (newer.x - older.x) * Map.blockW;
		Map.cameraY += (newer.y - older.y) * Map.blockW;
	}
	//if(Map.blockW < 8){Map.blockW = 8;}
	Map.draw();
}