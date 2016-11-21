module.exports = function (creep) {
    var Spawn1 = Game.spawns.Spawn1
// 	console.log('fdasfdsa')
	if(creep.carry.energy < creep.carryCapacity) {
	   // console.log('fdasfdsa2')
		var sources = creep.room.find(FIND_SOURCES);
		if(creep.harvest(sources[0]) != OK) {
		  //  console.log('fdasfdsa3')
            creep.moveTo(sources[0])
		}			
	}else {
	    
	    //if there are extensions fill those first
	    var closestNonFullExtension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;
            }
        });
        
        if(closestNonFullExtension){
            if(creep.transfer(closestNonFullExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(closestNonFullExtension);
    		}
        }else{
            if(creep.transfer(Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(Spawn1);
    		}
        }
	}
}