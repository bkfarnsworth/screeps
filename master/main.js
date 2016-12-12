
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
var dedicatedHarvester = require('DedicatedHarvester')
var carrier = require('Carrier')
var tracker = require('Tracker');
var util = require('util');
var tower = require('Tower');
var ConstructionManager = require('ConstructionManager');

var useTracker = false;
var seeCPU = false;
var debugMode = false;
var throttleRatio = 0.1;//0 - never throttle, 1 - throttle 100%

module.exports.loop = function () {
        
    console.log();
    console.log("--------- Creep Report - new tick -------------");

    if(_.random(1, 10) <= throttleRatio*10){
        console.log('SAVING CPU');
        return;
    }

    if(seeCPU){ util().printCPU(() => { console.log('main.js::59 :: '); }); }   


    var status = spawner();
    Game.briansStatus = status;

    //we could do this even less, but for now throttle it so it only happens on average every 100 ticks
    if(_.random(1, 100) === 1){
        var constructionManager = new ConstructionManager();
        constructionManager.doWork();    
    }

    //TOWERS
    for(var structureKey in Game.structures) {
        var structure = Game.structures[structureKey];
        if(structure instanceof StructureTower){
            var hostiles = structure.room.find(FIND_HOSTILE_CREEPS);

            //towers go fast, so if there are no hostiles let's throttle them for now
            if(hostiles.length || _.random(1, 3) === 1){
                tower(structure);
            }
        }
    }    

    //CREEPS
    var tempCpuUsed = Game.cpu.getUsed();
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

        //generic creep actions
        if(creep.room.name === util().milesRoomName){
            console.log('MILES ROOM creep.name: ', creep.name);
            util().goToRoom(util.southRoomName, creep);
            continue;
        }
		
	    if(creep.memory.role == 'carrier') {
            carrier(creep);
		}
		
		if(creep.memory.role == 'harvester') {
			harvester(creep);
		}

        if(creep.memory.role == 'harvesterTwo') {
            harvesterTwo(creep);
        }
		
        if(creep.memory.role == 'upgrader') {
      	    upgrader(creep);
        }
        
        if(creep.memory.role == 'repairer') {
	        repairer(creep);
        }

        if(creep.memory.role == 'attacker') {
            attacker(creep);
        }
        
		if(creep.memory.role == 'builder') {
	        builder(creep);
		}

        if(seeCPU){
            console.log('creep.memory.role: ', creep.memory.role);
            console.log('CPU used: ' + (Game.cpu.getUsed() - tempCpuUsed));
            tempCpuUsed = Game.cpu.getUsed();
        }
	}
	   
    if(seeCPU){ util().printCPU(() => { console.log('main.js::145 :: '); }); }   

    printEnergy(util().southRoom);
    printEnergy(util().northRoom);
    
    if(seeCPU){ util().printCPU(() => { console.log('main.js::163 :: '); }); }   
}

Creep.prototype.getName = function(){
    return this.name;
}

Creep.prototype.getAssignedRoom = function(){
    return Game.rooms[this.memory.assignedRoom] || util().southRoom;
}

function printEnergy(room){
    //get total energy capacity as well
    var totalEnergyCapacity = 0;
    var totalEnergyAvailable = 0;
    room.find(FIND_MY_STRUCTURES).forEach(function(structure){
        if(structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN){
            totalEnergyCapacity += structure.energyCapacity;
            totalEnergyAvailable += structure.energy;
        }
    });
    
    //extraEnergy is energy that is dropped or in a creep, 
    var extraEnergy = getExtraEnergy(room);
    
    console.log("TOTAL ENERGY ("+room.name+"): " + totalEnergyAvailable + " (+" + extraEnergy + ") / " + totalEnergyCapacity);

    if(seeCPU){ util().printCPU(() => { console.log('main.js::185 :: '); }); }   

    if(room === util().southRoom){
        if(useTracker){
            tracker(totalEnergyAvailable, totalEnergyCapacity);
        }    
    }
    
    if(seeCPU){ util().printCPU(() => { console.log('main.js::192 :: '); }); }   
}

function getExtraEnergy(room){
    var extraEnergy = 0;
    
    //dropped energy
    room.find(FIND_DROPPED_ENERGY).forEach(function(droppedResource){
        extraEnergy += droppedResource.amount;
    });
    
    //energy in creeps
    room.find(FIND_MY_CREEPS).forEach(function(creep){
        extraEnergy += creep.carry.energy;
    }) 
    
    //energy in the source
    room.find(FIND_SOURCES).forEach(function(source){
        // console.log(source.energy)
        extraEnergy += source.energy;
    });
    
    return extraEnergy;
}