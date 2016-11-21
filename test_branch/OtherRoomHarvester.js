module.exports = function (creep) {
    var Spawn1 = Game.spawns.Spawn1
	
	if(creep.carry.energy < creep.carryCapacity) {
	    
	    if(creep.room.name === 'W12S5'){
    		var sources = creep.room.find(FIND_SOURCES);
    		if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0])
    		}	
        }else{
            var exit = FIND_EXIT_LEFT;
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
		
	}else {
	    
	    //if there are extensions fill those first
	    var nonFullExtension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;
            }
        });
        
        if(nonFullExtension){
            if(creep.transfer(nonFullExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(nonFullExtension);
    		}
        }else{
            if(creep.transfer(Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(Spawn1);
    		}
        }
	}
}