var util = require('util')

module.exports = function (creep) {

	var findStrategy = 'closest';
	// var findStrategy = 'FIFO';

	var assignedRoom = creep.memory.assignedRoom || util().northRoom;
	assignedRoom = Game.rooms[assignedRoom];

	if(creep.carry.energy !== 0) {
		//manually set sites to be done first
		var manualTargetIds = [
			'5843b03fb14a695e0d8b318f',
			'5843b041b14a695e0d8b3192',
			'5843b042b14a695e0d8b3194',
			'',
			'',
			'',
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

			if(creep.build(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);					
			}	
		}else{
			//we need to go into the next room
			if(creep.room.name === util().southRoom){
			    var exit = FIND_EXIT_TOP;
			    creep.moveTo(creep.pos.findClosestByRange(exit));    
			}
		}
	}else{
	    util().getEnergyFromClosestSource(creep, 0.2, true, true)
	}
}
