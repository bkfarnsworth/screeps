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
            creep.moveTo(creep.pos.findClosest(exit));
        }
		
	}else {
	    
	    //if there are extensions fill those first
	    var nonFullExtensions = Game.rooms.W11S5.find(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;
            }
        });
        
        if(nonFullExtensions.length){
            if(creep.transfer(nonFullExtensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(nonFullExtensions[0]);
    		}
        }else{
            if(creep.transfer(Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(Spawn1);
    		}
        }
	}
}