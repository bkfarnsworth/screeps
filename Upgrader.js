var util = require('util')
var Worker = require('Worker');
var EnergyConsumerMixin = require('EnergyConsumerMixin');

class Upgrader extends Worker {

	constructor(creep, creepOpts){
		super(creep, creepOpts);
		this.energyConsumerMixin = new EnergyConsumerMixin(creepOpts.energyCollectionStrategy);
	}

	doWork(status){
		if(!super.doWork()){
			this.upgradeController(status);
		}
	}

	upgradeController(status){
		var creep = this.creep;
		this.energyConsumerMixin.doWorkOrGatherEnergyAccordingToStrategy(creep, {
			workTarget: creep.room.controller,
			workFunc: () => {
				var errCode = creep.upgradeController(creep.room.controller)
				if(errCode == ERR_NOT_IN_RANGE) {
					// change to claimController if I want to claim a new one - make sure you have the claim body part
					creep.moveToUsingCache(creep.room.controller);    
				}
			}
		});
	}
}

module.exports = Upgrader;