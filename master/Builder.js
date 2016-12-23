var util = require('util')

module.exports = function (creep) {

	var findStrategy = 'closest';
	// var findStrategy = 'FIFO';

	var assignedRoom = creep.memory.assignedRoom || util().northRoomName;
	assignedRoom = Game.rooms[assignedRoom];

	var inAssignedRoom = util().goToAssignedRoom(creep);
	if(!inAssignedRoom){ return; }

	if(creep.carry.energy !== 0) {
		//manually set sites to be done first
		var manualTargetIds = [
			'585cb1f4badd41083415e6b8',
			'584da2b4cf925b7f32ada75b',
			'584da2b4cf925b7f32ada75c',
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
				creep.moveToUsingCache(target);					
			}	
		}else{
			//we need to go into the next room
			// if(creep.room.name === util().southRoomName){
			//     var exit = FIND_EXIT_TOP;
			//     creep.moveToUsingCache(creep.pos.findClosestByRange(exit));    
			// }
		}
	}else{
		util().getEnergyFromBestSource(creep, {
			minEnergyRatio: 0.2,
			allowCarrier: true,
			allowHarvesting: true
		});
	}
}
