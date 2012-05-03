Map.History = {};

Map.History.init = function(){
	
	this.steps = new Array();
	this.redos = new Array();
	this.current_step = new Array();
	
}

// Start recording changes to the canvas
Map.History.start = function(){
	this.current_step = new Array();
}

// Add a change to the canvas to the current recording
Map.History.add = function( type, x, y, i ){
	var new_action = {type:type,x:x,y:y,i:i}
	for (var i=0; i < this.steps.length; i++) {
		if(this.steps[i] == new_action){ return true; } // Already in the current step
	};
	this.current_step.push(new_action);
}

// End the current recording and save it as a step for later use
Map.History.end = function(){
	if(this.current_step){
		this.steps.push(this.current_step);
		this.redos = new Array(); // A change was made, clear the redos
	}
}

// Undo the last action a user undertook by grabbing it from the steps stack
Map.History.undo = function(){
	
	if(!this.steps){ return false; }
	
	var step = this.steps.pop();
	for (var i=0; i < step.length; i++) {
		// Undo the change
	};
	
}

// Undo an undo from from the redos stack
Map.History.redo = function(){
	
}