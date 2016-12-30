var util = require('util')
var Worker = require('Worker');

class Harvester extends Worker{

	constructor(creep, creepOpts={}){

		super(creep, creepOpts);

		_.defaults(this.creepOpts, {
			sourceIndex: 0,
			takeFromStorage: this.status === 'incomplete',
			giveToStorage: this.status === 'complete',
		});
	}

	doWork(){
		util().depositEnergyOrHarvest(this.creep, this.creepOpts);
	}
}

module.exports = Harvester;  