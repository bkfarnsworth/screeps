var util = require('util');

module.exports = function (creep) {

	var assignedRoom = creep.memory.assignedRoom || 'E77S46';

	if(creep.carry.energy < (creep.carryCapacity * 0.5) && assignedRoom === 'E77S46') {
		util().getEnergyFromClosestSource(creep, 0, false);
	}else if(creep.carry.energy === 0 && assignedRoom === 'E77S47'){
		util().getEnergyFromClosestSource(creep, 0, false);
	} else {
		var errCode = creep.upgradeController(Game.rooms[assignedRoom].controller)
		if(errCode == ERR_NOT_IN_RANGE) {
				// change to claimController if I want to claim a new one - make sure you have the claim body part
				creep.moveTo(Game.rooms[assignedRoom].controller);    
		}
	}
}