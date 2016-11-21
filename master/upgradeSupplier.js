var util = require('util')

module.exports = function (creep) {
    
    var nonFullUpgraders = Game.rooms.W11S5.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            // console.log( creep.memory.role)
            // console.log('energy' + creep.carry.energy)
            // console.log(creep.carryCapacity)
            return creep.memory.role == 'upgrader' && (creep.carry.energy < creep.carryCapacity / 2);
        }
    });
    
    
        
    // console.log(nonFullUpgraders[0].carry.energy)
        
    var transferCode = nonFullUpgraders.length ? creep.transfer(nonFullUpgraders[0], RESOURCE_ENERGY) : null;
    
    // console.log(transferCode)
    // console.log('rqwrewq')

	if(util().needsEnergy(creep, transferCode)){
	   // console.log('fsdafdsa')
        util().getEnergyFromClosestSource(creep)
	}else{
        if(transferCode == ERR_NOT_IN_RANGE) {
            creep.moveTo(nonFullUpgraders[0]);    
        }
	}
}