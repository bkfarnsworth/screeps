var harvester = require('harvester')
var upgrader = require('Upgrader')
var dedicatedUpgrader = require('DedicatedUpgrader')
var guard = require('Guard')
var healer = require('Healer')
var builder = require('Builder')
var spawner = require('Spawner')
var attacker = require('Attacker')
var repairer = require('Repairer')
var milesHarvester = require('milesHarvester')
var gladiator = require('Gladiator');
var extHarvester = require('ExtHarvester')
var upgradeSupplier = require('upgradeSupplier')
var dedicatedHarvester = require('DedicatedHarvester')
var harvestCarrier = require('HarvestCarrier')
var tracker = require('Tracker');

module.exports.loop = function () {
    
    var status = spawner()
    
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

		if(creep.memory.role == 'harvester') {
			harvester(creep);
		}
		
		if(creep.memory.role == 'extHarvester') {
			extHarvester(creep);
		}
		
		if(creep.memory.role == 'dedicatedHarvester') {
			dedicatedHarvester(creep);
		}
		
	    if(creep.memory.role == 'harvestCarrier') {
			harvestCarrier(creep);
		}
		
		if(creep.memory.role == 'dedicatedUpgrader') {
			dedicatedUpgrader(creep);
		}
		
        if(creep.memory.role == 'upgrader') {
        // 	if(status == 'complete'){
        	    upgrader(creep);
        // 	}
        }
        
        if(creep.memory.role == 'upgradeSupplier') {
        	if(status == 'complete'){
        	    upgradeSupplier(creep);
        	}
        }
        
        if(creep.memory.role == 'guard') {
            guard(creep);
        }
        
        if(creep.memory.role == 'healer') {
            healer(creep);
        }
        
        if(creep.memory.role == 'attacker') {
            attacker(creep);
        }
        
        if(creep.memory.role == 'gladiator') {
            gladiator(creep);
        }
        
        if(creep.memory.role == 'milesHarvester') {
            milesHarvester(creep);
        }
        
        if(creep.memory.role == 'repairer') {
            if(status == 'complete'){
		        repairer(creep);
		    }
        }
        
		if(creep.memory.role == 'builder') {
		    if(status == 'complete'){
		        builder(creep);
		    }
		}
	}
	
	//get total energy capacity as well
    var totalEnergyCapacity = 0;
    var totalEnergyAvailable = 0;
    Game.rooms.W11S5.find(FIND_MY_STRUCTURES).forEach(function(structure){
        if(structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN){
            totalEnergyCapacity += structure.energyCapacity;
            totalEnergyAvailable += structure.energy;
        }
    });
    
    console.log("TOTAL ENERGY: " + totalEnergyAvailable + " / " + totalEnergyCapacity);
    
    tracker(totalEnergyAvailable, totalEnergyCapacity);
}