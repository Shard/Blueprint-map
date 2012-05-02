Map.Panel = {}

Map.Panel.init = function(){

	this.panels = new Array();
	this.toffset = 0;
	this.roffset = 0;
	this.boffset = 0;
	this.loffset = 0;
	
	this.register( $('#save-map')[0], "save", 'tr', 20, 20 );
	this.register( $('#mpanel-tools')[0], "tools", "tl", 20, 20 );
	this.register( $('#mpanel-swatch')[0], "swatch", "tl", 20, 200 );
	this.register( $('#mpanel-layers')[0], 'layers', 'tr', 20, 60 );
	this.update();
}

// Registers a DOM element as a panel
Map.Panel.register = function( element, name, anchor, offsetx, offsety ){
	
	if(anchor == undefined){ anchor = "tl"; }
	if(offsetx == undefined){ offsetx = 0; }
	if(offsety == undefined){ offsety = 0; }
	
	this.panels.push({
		name: name,
		element: element,
		anchor: anchor,
		x: offsetx,
		y: offsety
	});
	
}

// Updates the positions of panels
Map.Panel.update = function(){
	
	_.each(this.panels, function(panel, i){
		var mtop = this.toffset;
		var mright = this.roffset;
		var mbottom = this.boffset;
		var mleft = this.loffset;
		if(panel.anchor == "tr"){
			mtop = panel.y + this.toffset;
			mleft =  Map.cWidth - ( panel.x + $(panel.element).outerWidth() + this.roffset );
		} else if(panel.anchor == 'bl'){
			mbottom = panel.u;
			mleft = panel.x;
		} else if(panel.anchor == 'br'){
			mbottom = panel.y;
			mleft =  Map.cWidth - ( panel.x + $(panel.element).outerWidth() );
		} else { // tl
			mtop = panel.y + this.toffset;
			mleft = panel.x + this.loffset;
		}
		if(Map.isFullscreen){
			$(panel.element).removeAttr('style')
				.css('top', mtop)
				.css('right', mright)
				.css('bottom', mbottom)
				.css('left', mleft)
				.css('position', 'fixed')
				.css('z-index', 1000);
			
		} else {
			$(panel.element).removeAttr('style')
				.css('margin-top', mtop)
				.css('margin-right', mright)
				.css('margin-bottom', mbottom)
				.css('margin-left', mleft)
				.css('position', 'absolute')
				.css('z-index', 1000);
		}
	
		
	}, this);
	
}


// Adjusts the global offset
Map.Panel.adjustOffset = function( top, right, bottom, left ){
	if(top == undefined){ top = 0; }
	if(right == undefined){ right = 0; }
	if(bottom == undefined){ bottom = 0; }
	if(left == undefined){ left = 0; }
	this.toffset += top;
	this.roffset += right;
	this.boffset += bottom;
	this.loffset += left;
	this.update();
}

// Adjusts the position of a panel
Map.Panel.adjustPosition = function( name, x, y, anchor ){
	var panel = this.get(name);
	if(anchor == undefined){ anchor = panel.anchor; }
	panel.x += x;
	panel.y += y;
	panel.anchor = anchor;
	var result = this.set(name, panel);
	this.update();
	return result;
}

// Gets a panel by its name
Map.Panel.get = function( name ){
	for (var i=0; i < this.panels; i++) {
		if(this.panel[i].name == name){ return this.panel; }
	};
	return null;
}

// Sets a panel by its name
Map.Panel.set = function( name, panel ){
	for (var i=0; i < this.panels; i++) {
		if(this.panel[i].name == name){ this.panel[i] = panel;return true; }
	};
	return false;
}

// Gets the DOM element of the panel
Map.Panel.getDOM = function( name ){
	var panel = this.get(name);
	if(panel){
		return panel.element;
	}
	return null;
}