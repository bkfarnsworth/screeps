module.exports = function (creep) {
    return {
        milesRoom: 'W11S6',
        harvestOrMoveToSource: function(creep){
            var sources = creep.room.find(FIND_SOURCES);
            var harvestReturnCode = creep.harvest(sources[0]);
            
        	if(creep.carry.energy == 0 || (creep.carry.energy < creep.carryCapacity && harvestReturnCode != ERR_NOT_IN_RANGE)) {
        		if(harvestReturnCode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0])
        		}	
        	}
        },
        needToHarvest: function(creep){
            
        },
        getEnergyFromClosestSource: function(creep){
            
            var closestEnergySource = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure){
                    return structure.structureType === STRUCTURE_SPAWN || (structure.structureType === STRUCTURE_EXTENSION && structure.energy === structure.energyCapacity);
                }
            });
            
            console.log(closestEnergySource)
            
            // if(structure.structureType === STRUCTURE_EXTENSION){
                
            // }
            
            if(closestEnergySource.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(closestEnergySource);				
    		}
        }
    }   
}