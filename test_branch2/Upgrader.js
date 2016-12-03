var util = require('util');

module.exports = function (creep) {
	if(creep.carry.energy == 0) {
		util().getEnergyFromClosestSource(creep);
	} else {
		if(creep.room.controller) {
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);    
			}
		}			
	}
}