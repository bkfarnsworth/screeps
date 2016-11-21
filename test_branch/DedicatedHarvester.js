var util = require('util')

module.exports = function (creep, status) {
    
    var sources = creep.room.find(FIND_SOURCES);
    
    if(!util().isNextToTarget(creep, sources[0])){
        
        creep.moveTo(sources[0]);     
        
    // if(code == ERR_NOT_IN_RANGE || code == ERR_NOT_ENOUGH_RESOURCES) {
       
    }else if(creep.carry.energy === creep.carryCapacity){
        
        //keep harvesting, even if you have to drop something
        creep.harvest(sources[0]);
        
        var closestHarvestCarrier = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(creep) {
                // console.log('energy' + creep.energy)
                // console.log(creep.energyCapacity)
                return creep.memory.role == 'dedicatedCarrier';
            }
        });
        
        // console.log(closestHarvestCarrier)
        
        var transferCode = creep.transfer(closestHarvestCarrier, RESOURCE_ENERGY);
        
        // console.log(transferCode)
    }else{
        creep.harvest(sources[0]);
    }
}

