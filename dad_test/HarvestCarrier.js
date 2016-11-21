var util = require('util')

module.exports = function (creep) {
    
    //if there is dropped energy, get those first
    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if(target && creep.carry.energy < 50) {
        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        
        return;
    }
    
    
    //if full then go deposit it
    if(creep.carry.energy >= 50){
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
            if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(Game.spawns.Spawn1);
    		}
        }
    }else{
        
        var almostFullHarvesters = Game.rooms.W11S5.find(FIND_MY_CREEPS, {
            filter: function(creep) {
                // console.log('energy' + creep.energy)
                // console.log(creep.energyCapacity)
                return creep.memory.role == 'dedicatedHarvester' && creep.carry.energy > creep.carryCapacity * 3/4;
            }
        });
    
        creep.moveTo(almostFullHarvesters[0]);    
    }
}