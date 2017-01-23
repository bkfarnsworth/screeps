var util = require('util');
var Worker = require('Worker');

class Demoman extends Worker{

	constructor(creep, creepOpts){
		super(creep, creepOpts);
		this.targetRoomName = util.room1.name;

		//list of targets
		var wall = util.getHarvestWall(creep.room);
		this.targets = [
			wall
		];
	}

	doWork(){ 
		var creep = this.creep;
		if(creep.room.name !== this.targetRoomName){
			util.goToRoom(this.targetRoomName, creep);
		}else{
			this.goToAndDismantleTarget();
		}	
	}

	goToAndDismantleTarget(){
		var creep = this.creep;
		for (var i = 0; i < this.targets.length; i++) {
			var exists = this.dismantleTargetIfExists(this.targets[i], creep);
			if(exists){ break; }
		};
	}

	dismantleTargetIfExists(target, creep){

		var structToDismantle = target;
		var bestEnergyRecipient = util.getBestEnergyRecipient(creep);
		var exists = false
		var work = () => {
			if(structToDismantle){
				var errCode = creep.dismantle(structToDismantle);
				console.log('structToDismantle: ', structToDismantle);
				console.log('structToDismantle.hits: ', structToDismantle.hits);
				if(errCode === ERR_NOT_IN_RANGE){
					creep.moveToUsingCache(target);
				}
				exists = true
			}
		}

		util.doWorkOtherwise(creep, {
			workTarget    : structToDismantle,
			workFunc      : work,
			otherwiseFunc : util.giveEnergyToRecipient.bind(util, creep, bestEnergyRecipient),
			otherwiseTarget: bestEnergyRecipient,
			polarity      : 'positive'
		});

		return exists;
	}
}

module.exports = Demoman;