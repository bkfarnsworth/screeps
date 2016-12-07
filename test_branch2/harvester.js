var util = require('util')

module.exports = function (creep, sourceIndex) {

    sourceIndex = _.isUndefined(sourceIndex) ? 0 : sourceIndex;//default to 0

    var inAssignedRoom = util().goToAssignedRoom(creep);
    if(!inAssignedRoom){ return; }

	if(creep.carry.energy < creep.carryCapacity) {
		var sources = creep.room.find(FIND_SOURCES);
		if(creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[sourceIndex])
		}			
	}else {
        util().giveEnergyToClosestRecipient(creep, {
            allowStructures: true
        });
	}
}