var util = require('util')

module.exports = function (creep) {
    
    var sources = creep.room.find(FIND_SOURCES);
    
    var code = creep.harvest(sources[0]);
    
    if(code == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);    
    }else if(creep.carry.energy === creep.energyCapacity){
        var closestHarvestCarrier = Game.rooms.W11S5.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(creep) {
                // console.log('energy' + creep.energy)
                // console.log(creep.energyCapacity)
                return creep.memory.role == 'harvestCarrier';
            }
        });
        
        console.log(closestHarvestCarrier)
            
        // console.log(nonFullUpgraders[0].carry.energy)
            
        var transferCode = creep.transfer(closestHarvestCarrier, RESOURCE_ENERGY);
    }
}