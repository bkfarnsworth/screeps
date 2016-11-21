var util = require('util');

module.exports = function (creep) {
    var Spawn1 = Game.spawns.Spawn1
    
    if(creep.room.name === util().tamsonsRoom){
        
        util().registerOtherRoomCreep(creep);
        
    }
	
	if(creep.carry.energy < creep.carryCapacity) {
	    
	    if(creep.room.name === util().tamsonsRoom){
	       
	        
    		var sources = creep.room.find(FIND_SOURCES);
    		if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0])
    		}	

        }else{
            var exit = FIND_EXIT_LEFT;
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
		
	}else {


    //     if(creep.room.controller) {
    //         var code = creep.reserveController(creep.room.controller);
    //         console.log(code)
    //         if(code == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(creep.room.controller);    
    //         }
    // 	}
	    
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