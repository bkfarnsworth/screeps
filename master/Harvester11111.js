var util = require('util')

class Harvester {

	constructor(creep, creepOpts={}){

		this.creep = creep;
		this.creepOpts = creepOpts;

		_.defaults(this.creepOpts, {
			sourceIndex: 0,
			takeFromStorage: this.status === 'incomplete',
			giveToStorage: this.status === 'complete',
		});
	}

	doWork(){
		var inAssignedRoom = util().goToAssignedRoom(this.creep);
		if(!inAssignedRoom){ return; }
		util().depositEnergyOrHarvest(this.creep, this.creepOpts);
	}
}

module.exports = Harvester;  