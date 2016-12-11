/*
    TODO:
        
        //unit testing

        //get it to send me a summary everyday of how my creeps did etc.    
        //make it so I put flags on places that should always have construction sites or walls, and auto rebuild them
            //make flag ranges, where everything in the range should have walls, roads, etc
            
            //if there is not any constructed thing there already
            //if there is not a construction site there alredy, 
                put a road site
        
        
        need to make the priority closeness stuff...so that towers don't get starved.


        //start optimizing to not exceed limit 
            //do things in order of importance per tick
            //minimize path finding


        //make harvesters do the 80/20 rule too
        //if there are missing any creeps, make the harvesters take from the storage first to get things going again faster.  then they can refill it.

        //get rid of repairers and set up towers

            //only repair things that need 800
            //attack all evil things
            //capacity is 1000
            //if energy is less than n (900), go fill it first
                //that way there is a lot of energy if it needs to attack

        //start doing dedicated harvesters, etc


    
        //I should make it so it is a ratio I specify rather than specific numbers.  I say, I want 2 parts harvester, 2 parts repair, 2 parts upgrader.  And then it tiers things.  It has one of each as high priortiy, then spirals upwarda and keeps them even in the ratio.  IT'd be cool if it auto decided how powerful to make them too.  Like it keeps trying to spawn more powerful ones until it can't anymore.

        //need to add the 80/20 rule to all creeps.  harvesters too.  now that things are mostly using extensions, they are getting and dropping less energy than they could be

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
var dedicatedCarrier = require('DedicatedCarrier')
var tracker = require('Tracker');
var util = require('util');
var tower = require('Tower');
var ConstructionManager = require('ConstructionManager');

var useTracker = false;
var seeCPU = false;
var debugMode = false;

module.exports.loop = function () {
        
    // var a = new ConstructionManager();
    // console.log('a.name: ', a.name);

    console.log();
    console.log("--------- Creep Report - new tick -------------");

    if(seeCPU){ util().printCPU(() => { console.log('main.js::59 :: '); }); }   

    var status = spawner();
    Game.briansStatus = status;

    for(var structureKey in Game.structures) {
        var structure = Game.structures[structureKey];

        if(structure instanceof StructureTower){

            //towers go fast, so let's throttle them for now
            var random = _.random(0, 7);// 1/8 change the tower will go
            if(random === 1){
                tower(structure);
            }
        }
    }    


	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

        if(seeCPU){
            console.log('creep.memory.role: ', creep.memory.role);
            util().printCPU(() => { console.log('main.js::66 :: ');  });
        }

        //generic creep actions
        if(creep.room.name === util().milesRoomName){
            console.log('MILES ROOM creep.name: ', creep.name);
            util().goToRoom(util.southRoomName, creep);
            continue;
        }
		
	    if(creep.memory.role == 'dedicatedCarrier') {
            dedicatedCarrier(creep);
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