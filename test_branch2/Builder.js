var util = require('util')

module.exports = function (creep) {

	if(creep.carry.energy !== 0) {
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0]);					
			}
		}
	}else{
	    util().getEnergyFromClosestSource(creep)
	}
}
