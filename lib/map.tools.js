Map.Tools.init = function(){
	this.use('Move');
	$('#mpanel-tools a').click(function(){
		return false;
	});
}

// Handles different events and passes it onto the active tools
Map.Tools.handleEvent = function(name, e){

	if(!Map.Tools.active){ return true; }
	
	if(name == 'mousedown'){
		if( this[this.active].mousedown != undefined ){ this[this.active].mousedown(e); }
	} else if(name == 'mousemove') {
		if( this[this.active].mousemove != undefined ){ this[this.active].mousemove(e); }
	} else if(name == 'mouseup'){
		if( this[this.active].mouseup != undefined ){ this[this.active].mouseup(e); }
	} else if(name == 'click'){
		if( this[this.active].click != undefined ){ this[this.active].click(e); }
	}
}

// Handles Keyboard presses
Map.Tools.keydown = function(e){
	if(e.keyCode == 86){ this.use('Move'); } // v
	if(e.keyCode == 66){ this.use('Draw'); } // b
	if(e.keyCode == 78){ this.use('Rectangle'); } // n
	if(e.keyCode == 83){ this.use('Spawn'); } // n
	if(e.keyCode == 32 && !Map.Tools.keydown){
		Map.Tools.last_tool = Map.Tools.active;
		Map.Tools.keydown = true;
		Map.Tools.use('Move');
		return false;
	}
}

// Handles Keyboard Releases
Map.Tools.keyup = function(e){
	if(e.keyCode == 32 && Map.Tools.keydown){
		Map.Tools.use(Map.Tools.last_tool);
		$('#mapper-canvas').mouseenter();
		Map.Tools.keydown = false;
		return false;
	}
}

// Changes the current active tool
Map.Tools.use = function(name){
	if(Map.Tools.active){
		if( this[this.active].end != undefined){ this[this.active].end(); }
		$('#mtool-' + Map.Tools.active).removeClass('btn-primary').find('i').removeClass('icon-white');
	}
	if( this[name].start != undefined ){ this[name].start(); }
	Map.Tools.active = name;
	$('#mtool-' + name).addClass('btn-primary').find('i').addClass('icon-white');
	
	// Eraser
	if(this.active == 'Draw' || this.active == 'Rectangle'){
		if(Map.selected == 'erase:0'){
			$('#mtool-Erase').addClass('btn-danger');
		}
	} else {
		$('#mtool-Erase').removeClass('btn-danger');
	}
	
}

// Move Tool
Map.Tools.Move = {
	start: function(){ 
		Map.changeCursor('move');
	},
	mousedown: function(e){
		this.start_drag_x = e.screenX - Map.cameraX;
		this.start_drag_y = e.screenY - Map.cameraY;
	},
	mousemove: function(e){
		if(Map.mousedown){
			Map.cameraX = e.screenX - this.start_drag_x;
			Map.cameraY = e.screenY - this.start_drag_y;
			Map.draw();
		}
	}
}

// Pencil Tool
Map.Tools.Draw = {
	start: function(){
		Map.changeCursor('crosshair');
		$('#mpanel-blocks').show();
	},
	mousemove: function(e){
		if(Map.mousedown && Map.selected){
			var loc = Map.Helper.blockAt(e);
			var bits = Map.selected.split(':');
			Map.Data.set(bits[0],loc.x,loc.y,bits[1]);
			Map.draw();
		}
	},
	end: function(){
		$('#mpanel-blocks').hide();
	}
}

// Spawn Location
Map.Tools.Spawn = {
	start: function(){
		Map.changeCursor('crosshair');
	},
	click: function(e){
		console.log('spawn');
		loc = Map.Helper.blockAt(e);
		Map.spawn_point = loc;
		Map.draw();
	},
	end: function(){
		$('#mapper-canvas').unbind('click');
	}
}

// Rectangle Tool
Map.Tools.Rectangle = {
	start: function(){
		Map.changeCursor('crosshair');
		$('#mpanel-blocks').show();
		this.drag_start = null;
		this.drag_end = null;
	},
	mousedown: function(e){
		this.drag_start = Map.Helper.blockAt(e);
		this.drag_end = Map.Helper.blockAt(e);
	},
	mousemove: function(e){
		if(Map.mousedown){
			this.drag_end = Map.Helper.blockAt(e);
			Map.draw();
		}
	},
	mouseup: function(e){
		
		if(this.drag_start == null || this.drag_start.x == undefined){ return false; }
		
		// Build the correct selection area
		if( this.drag_start.x > this.drag_end.x ){ 
			start_x = this.drag_end.x;
			end_x = this.drag_start.x;
		} else { 
			start_x = this.drag_start.x;
			end_x = this.drag_end.x;
		}
		if( this.drag_start.y > this.drag_end.y ){ 
			start_y = this.drag_end.y;
			end_y = this.drag_start.y;
		} else { 
			start_y = this.drag_start.y;
			end_y = this.drag_end.y;
		}
		
		// Apply blocks
		for (var x=start_x; x <= end_x; x++) {
			for (var y=start_y; y <= end_y; y++) {
				var bits = Map.selected.split(':');
				Map.Data.set(bits[0],x,y,bits[1]);
			};
		};
		this.drag_start = null;
		this.drag_end = null;
		Map.draw();
	},
	end: function(){
		$('#mpanel-blocks').hide();
		this.drag_start = null;
		this.drag_end = null;
	}
}