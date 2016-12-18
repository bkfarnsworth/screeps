
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
var throttleRatio = 0.3;//0 - never throttle, 1 - throttle 100%

module.exports.loop = function () {
        
    console.log();
    console.log("--------- Creep Report - new tick -------------");

    if(_.random(1, 10) <= throttleRatio*10){
        console.log('SAVING CPU');
        return;
    }

    if(seeCPU){ util().printCPU(() => { console.log('main.js::59 :: '); }); }   


    spawner();

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
            console.log('CPU used: ' + _.round(Game.cpu.getUsed() - tempCpuUsed, 2));
            tempCpuUsed = Game.cpu.getUsed();
        }
	}
	   
    if(seeCPU){ util().printCPU(() => { console.log('main.js::145 :: '); }); }   


    
    if(seeCPU){ util().printCPU(() => { console.log('main.js::163 :: '); }); }   
}

Creep.prototype.getName = function(){
    return this.name;
}

Creep.prototype.getAssignedRoom = function(){
    return Game.rooms[this.memory.assignedRoom] || util().southRoom;
}

