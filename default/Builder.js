var constants = require('Constants');


module.exports = function (creep) {

    var useSpawnForEnergy = false;
    var sources = creep.room.find(FIND_SOURCES);
    var harvestReturnCode = creep.harvest(sources[0]);

	if(creep.carry.energy <= 1 && useSpawnForEnergy) {
       	if(Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
	    	creep.moveTo(Game.spawns.Spawn1);				
	    }
	}else if(!useSpawnForEnergy && (creep.carry.energy == 0 || (creep.carry.energy < creep.carryCapacity && harvestReturnCode != ERR_NOT_IN_RANGE))){
	    constants().harvestOrMoveToSource(creep);
    }else {
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			if(creep.build(targets[targets.length - 1]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[targets.length - 1]);					
			}
		}
	}
}
