var util = require('util')
var Worker = require('Worker');

class Harvester extends Worker{

	constructor(creep, creepOpts={}){

		super(creep, creepOpts);

		_.defaults(this.creepOpts, {
			sourceIndex: 0,
			takeFromStorage: this.creep.room.status === 'incomplete',
			giveToStorage: this.creep.room.status === 'complete',
		});
	}

	doWork(){
		if(!super.doWork()){
			util().depositEnergyOrHarvest(this.creep, this.creepOpts);
		}
	}
}

module.exports = Harvester;  