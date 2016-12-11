var util = require('util');

//extends worker? everything that needs to do work on a tick
module.exports = function(){

	this.doWork = function(){
		var constuctionZones = [
		    COLOR_RED,
		    COLOR_PURPLE,
		    COLOR_BLUE,
		    COLOR_CYAN,
		    COLOR_GREEN,
		    COLOR_YELLOW,
		    COLOR_ORANGE,
		    COLOR_BROWN,
		    COLOR_GREY,
		    // COLOR_WHITE
		];

		constuctionZones.forEach(zone => {
			util().forEachCellInGrid(zone, pos => {
				var structures = pos.lookFor(LOOK_STRUCTURES);
				var constructionSites = pos.lookFor(LOOK_CONSTRUCTION_SITES);

				if(![...structures, ...constructionSites].length){
					pos.createConstructionSite(STRUCTURE_ROAD);
				}
			});
		});
	}

	return this;
}