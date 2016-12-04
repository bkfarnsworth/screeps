/*
    TODO:

        build walls around swamp paths so I don't have to walk on the swamp.  just need a way to limit how much we repair them

        upgraders in both rooms
        need granular control over which creeps are in which room
        walls
        repairers on the walls
        roads
        spawn
        harvesters


        really need to let them keep going if they aren't near the sources now


        in my output, I could show what percent that creep contributing to upgrading
        make it so it only stopsOperation if there are 2 harvesters missing or something
        can I trigger an alert in certain situations? like if all my creeps are dead?
        instead of stopping all production, have the creeps finish what they are doing and return to get more energy but don't take it
        make it so it counts screeps that are spawning too, so it doesn't wait until they are done
        make it so if a creep comes to the spawn to get energy, it stays there until it is at full capacity.  It doesn't leave with a few.
        make it so the carriers just drop energy right by the upgraders, so they don't have to wait there.
            we just need to make sure that the carriers don't go after that dropped stuff.
                fill the creeps first, and then drop it in the middle where either can get it.
            have a seperate track for when things need to spawn, like go take it from the drop and put it in extensiosn.
            if I drop it there, I can make my builders faster.
            another idea is the fact that the expensive part of a harvester is having one...I think it would be better to have 2 at 700 than 2 at 500 because the extra 2 hundred to spawn them isn't that expensive

*/

var creepTracker = require('CreepTracker')
var harvester = require('harvester')
var harvesterTwo = require('HarvesterTwo')
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

module.exports.loop = function () {

    var useTracker = false;
    var seeCPU = false;
    var debugMode = false;

        
    console.log();
    console.log("--------- Creep Report - new tick -------------");

    if(seeCPU){ util().printCPU(() => { console.log('main.js::59 :: '); }); }   

    var status = spawner();
    
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

        if(seeCPU){
            console.log('creep.memory.role: ', creep.memory.role);
            util().printCPU(() => { console.log('main.js::66 :: ');  });
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

        if(creep.memory.role == 'harvesterTwo') {
            harvesterTwo(creep);
        }
		
		if(creep.memory.role == 'extHarvester') {
			extHarvester(creep);
		}
		
	    if(creep.memory.role == 'harvestCarrier') {
			harvestCarrier(creep);
		}
		
        if(creep.memory.role == 'upgrader') {
        	// if(status == 'complete'){
        	    upgrader(creep);
        	// }
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
		    // if(status == 'complete'){
		        builder(creep);
		    // }
		}
	}
	   
    if(seeCPU){ util().printCPU(() => { console.log('main.js::145 :: '); }); }   

	//get total energy capacity as well
    var totalEnergyCapacity = 0;
    var totalEnergyAvailable = 0;
    util().myRoom.find(FIND_MY_STRUCTURES).forEach(function(structure){
        if(structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN){
            totalEnergyCapacity += structure.energyCapacity;
            totalEnergyAvailable += structure.energy;
        }
    });
    
    //extraEnergy is energy that is dropped or in a creep, 
    var extraEnergy = getExtraEnergy();
    
    console.log("TOTAL ENERGY: " + totalEnergyAvailable + " (+" + extraEnergy + ") / " + totalEnergyCapacity);
    
    if(seeCPU){ util().printCPU(() => { console.log('main.js::160 :: '); }); }   

    if(useTracker){
        tracker(totalEnergyAvailable, totalEnergyCapacity);
    }

    if(seeCPU){ util().printCPU(() => { console.log('main.js::163 :: '); }); }   
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