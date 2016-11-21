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
var dedicatedCarrier = require('DedicatedCarrier')
var harvestCarrier = require('HarvestCarrier')
var tracker = require('Tracker');
var util = require('util');
var otherRoomHarvester = require('OtherRoomHarvester');
var survivor = require('Survivor')

module.exports.loop = function () {
    
    var status = spawner()
    
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

        // if(creep.ticksToLive < util().minLife){
        if(util().shouldRenew(creep)){
            survivor(creep);
            continue;
        }

		if(creep.memory.role == 'dedicatedHarvester') {
			dedicatedHarvester(creep, status);
		}
		
	    if(creep.memory.role == 'dedicatedCarrier') {
			dedicatedCarrier(creep, status);
		}
		
	    if(creep.memory.role == 'dedicatedUpgrader') {
		    dedicatedUpgrader(creep, status);            
		}
		
		if(creep.memory.role == 'otherRoomHarvester'){
		    otherRoomHarvester(creep, status);
		}
		
		
		
		
		
		if(creep.memory.role == 'harvester') {
			harvester(creep);
		}
		
		if(creep.memory.role == 'extHarvester') {
			extHarvester(creep);
		}
		
	    if(creep.memory.role == 'harvestCarrier') {
			harvestCarrier(creep);
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
    
    //extraEnergy is energy that is dropped or in a creep, 
    var extraEnergy = getExtraEnergy();
    
    console.log("TOTAL ENERGY: " + totalEnergyAvailable + " (+" + extraEnergy + ") / " + totalEnergyCapacity);
    
    tracker(totalEnergyAvailable, totalEnergyCapacity);
}

function getExtraEnergy(){
    var extraEnergy = 0;
    
    //dropped energy
    util().myRoom.find(FIND_DROPPED_ENERGY).forEach(function(droppedResource){
        extraEnergy += droppedResource.amount;
    });
    
    //energy in creeps
    util().myRoom.find(FIND_MY_CREEPS).forEach(function(creep){
        extraEnergy += creep.carry.energy;
    }) 
    
    //energy in the source
    util().myRoom.find(FIND_SOURCES).forEach(function(source){
        // console.log(source.energy)
        extraEnergy += source.energy;
    });
    
    return extraEnergy;
}