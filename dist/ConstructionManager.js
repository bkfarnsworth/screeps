var util = require('util');

// COLOR_RED,
// COLOR_PURPLE,
// COLOR_BLUE,
// COLOR_CYAN,
// COLOR_GREEN,
// COLOR_YELLOW,
// COLOR_ORANGE,
// COLOR_BROWN,
// COLOR_GREY,
// COLOR_WHITE

//extends worker? everything that needs to do work on a tick
module.exports = function(){

	this.doWork = function(){
		var constuctionGrids = [
		    COLOR_RED,
		    COLOR_PURPLE,
		    COLOR_BLUE,
		    COLOR_YELLOW,
		];

		var constructionPaths = [
			COLOR_CYAN,
			// COLOR_GREEN,
			COLOR_ORANGE,
		];

		constuctionGrids.forEach(grid => {
			util.forEachCellInGrid(grid, this.createConstructionSite);
		});

		constructionPaths.forEach(path => {
			util.forEachCellInPath(path, this.createConstructionSite);
		});
	}

	this.createConstructionSite = (pos) => {
		var structures = pos.lookFor(LOOK_STRUCTURES);
		var constructionSites = pos.lookFor(LOOK_CONSTRUCTION_SITES);

		if(![...structures, ...constructionSites].length){
			pos.createConstructionSite(STRUCTURE_ROAD);
		}
	}

	this.removeConstructionSites = (pos) => {
		var constructionSites = pos.lookFor(LOOK_CONSTRUCTION_SITES);
		constructionSites.forEach(cs => {
			cs.remove();
		});
	}

	return this;
}

