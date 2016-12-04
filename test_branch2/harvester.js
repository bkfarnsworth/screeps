module.exports = function (creep, sourceIndex, spawnFirst) {

    sourceIndex = _.isUndefined(sourceIndex) ? 0 : sourceIndex;//default to 0
    spawnFirst = _.isUndefined(spawnFirst) ? true : spawnFirst;

    var Spawn1 = Game.spawns.Spawn1
    
	if(creep.carry.energy < creep.carryCapacity) {
		var sources = creep.room.find(FIND_SOURCES);
		if(creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[sourceIndex])
		}			
	}else {
	    //if the spawn needs energy fill that first, then extensions
	    if(spawnFirst && Spawn1.energy < Spawn1.energyCapacity){
            if(creep.transfer(Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(Spawn1);
    		}
	    }else{
    	    var closestNonFullExtension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;
                }
            });
            
            if(closestNonFullExtension){
                if(creep.transfer(closestNonFullExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        			creep.moveTo(closestNonFullExtension);
        		}
            }
	    }
	}
}