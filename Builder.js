var util = require('util')
var Worker = require('Worker');

class Builder extends Worker {

	constructor(creep, creepOpts){
		super(creep, creepOpts);
	}

	doWork(status){
		var target = this.getTarget();

		if(!super.doWork()){
			util.doWorkOrGatherEnergy(this.creep, {
				workTarget: target,
				workFunc: this.build.bind(this, target),
				status: status
			})
		}
	}

	build(target){
		if(this.creep.build(target) == ERR_NOT_IN_RANGE) {
			this.creep.moveToUsingCache(target);					
		}	
	}

	getTarget(){

		var creep = this.creep;
		var findStrategy = 'closest';
		// var findStrategy = 'FIFO';

		var assignedRoom = creep.memory.assignedRoom || util.northRoomName;
		assignedRoom = Game.rooms[assignedRoom];

		//manually set sites to be done first
		var manualTargetIds = [
			'587467f325890532550d332c',
			'584da2b4cf925b7f32ada75b',
			'584da2b4cf925b7f32ada75c',
			'5843b042b14a695e0d8b3194',
		]

		var closestTarget = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

		if(closestTarget) {
			var target = closestTarget;
			var allTargets;

			if(manualTargetIds.length){
				allTargets = assignedRoom.find(FIND_CONSTRUCTION_SITES);
				if(findStrategy === 'FIFO'){
					closestTarget = allTargets[0];//if we are overriding the closest stuff, just get the first one
				}
			}

			for (var i = 0; i < manualTargetIds.length; i++) {
				target = _.find(allTargets, {id: manualTargetIds[i]});
				if(target){ 
					break;
				}else{
					target = closestTarget;
				}
			};

			return target;
		}
	}
}

module.exports = Builder;
