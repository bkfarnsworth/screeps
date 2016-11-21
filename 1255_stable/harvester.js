module.exports = function (creep) {
    var Spawn1 = Game.spawns.Spawn1
	
	if(creep.carry.energy < creep.carryCapacity) {
	    
		var sources = creep.room.find(FIND_SOURCES);
		if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0])
		}			
	}else {
	    
	    //if the spawn needs energy fill that first, then extensions
	    if(Spawn1.energy < Spawn1.energyCapacity){
            if(creep.transfer(Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(Spawn1);
    		}
	    }else{
	       // console.log('fsdfdsa')
    	    var closestNonFullExtension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;
                }
            });
            
            // console.log(closestNonFullExtension)
        
            if(closestNonFullExtension){
                if(creep.transfer(closestNonFullExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        			creep.moveTo(closestNonFullExtension);
        		}
            }
	    }
	}
}