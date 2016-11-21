var util = require('util')

module.exports = function (creep) {

	if(creep.carry.energy <= 1) {
	    //TODO: need to fix this so that it will wait for the source to have 50.
        util().getEnergyFromClosestSource(creep)
	}else {
		if(creep.room.controller) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);    
            }
		}			
	}
}