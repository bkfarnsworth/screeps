var util = require('util')

module.exports = function (creep, status) {

    var debugMode = false;
    
    var sources = getSources(creep);
    var isCloseToSource = _.any(sources.map(function(source){
        return creep.pos.inRangeTo(source, 5);
    }));

    if(debugMode){
        console.log('creep.name: ', creep.name);
        console.log('sources: ', sources);
        console.log('isCloseToSource: ', isCloseToSource);
    }

    if(isCloseToSource){
        if(creep.carry.energy < (creep.carryCapacity * 0.9)){
            if(debugMode){console.log('gather 1');}
            if(status === 'complete'){
                if(debugMode){console.log('gather');}
                gather(creep);
            }
        }else{
            if(debugMode){console.log('deposit 1');}
            deposit(creep)
        }
    }else{
        if(creep.carry.energy > (creep.carryCapacity * 0.1)){
            if(debugMode){console.log('deposit 2');}
            deposit(creep);
        }else{
            if(debugMode){console.log('gather 2');}
            gather(creep);
        }
    }
}

function gather(creep){
    var targetLocked = false;
    
    if(!targetLocked){ targetLocked = getDroppedResources(creep); }
        
    //this is for dedicatedharvester
    // if(!targetLocked){ targetLocked = pickUpFromHarvester(creep); }
    
    //this technically does extensions and spawn for now
    if(!targetLocked){ targetLocked = pickUpFromExtension(creep); }
    
    //tank
    
    //spawn
}

function deposit(creep){
    var targetLocked = false;
    
    // if(status === 'complete'){
    //     if(!targetLocked){ targetLocked = giveToUpgraders(creep); }        
    // }

    if(!targetLocked){ targetLocked = giveToCreeps(creep); }        
    
    // if(!targetLocked){ targetLocked = fillExtension(creep); }
    
    // fillTank
        
    // if(!targetLocked){ targetLocked = fillSpawn(creep); }
}

function getSources(creep){
    var sources = [];
    // sources.push(creep.pos.findClosestByRange(FIND_DROPPED_ENERGY));
    sources.push(util().getClosestEnergySource(creep, 0, false));
    return _.compact(sources);
}

function giveToCreeps(creep){
    //TODO: should balance this with the closest one
    //TODO: for now only in the north room
    
    // var nonFullBuilder = _.min(nonFullBuilders, 'carry.energy');
    var creepTypes = ['builder', 'upgrader', 'repairer'];
    var closestNonFullCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function(creep) {
            return _.contains(creepTypes, creep.memory.role) && (creep.carry.energy < creep.carryCapacity * 0.7) && creep.memory.assignedRoom === util().northRoom;
        }
    });
    
    if(closestNonFullCreep){
        var transferCode = creep.transfer(closestNonFullCreep, RESOURCE_ENERGY);
    
        if(transferCode == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestNonFullCreep);    
        }
        
        return true;
    }else{

        //we need to go into the next room
        if(creep.room.name === util().southRoom){
            var exit = FIND_EXIT_TOP;
            creep.moveTo(creep.pos.findClosestByRange(exit));    
        }

        return false;
    }
}

function fillExtension(creep){
    
    var closestNonFullExtension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function(structure) {
            return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;
        }
    });
    
    if(closestNonFullExtension){
        if(creep.transfer(closestNonFullExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(closestNonFullExtension);
		}
		
		return true;
    }else{
        return false;
    }
}

function fillSpawn(creep){
    if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
		creep.moveTo(Game.spawns.Spawn1);
	}
	
	return true;
}

function getDroppedResources(creep){
    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if(target) {
        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    }else{
        return false;
    }
}

function pickUpFromHarvester(creep){
    var almostFullHarvesters = util().myRoom.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            return creep.memory.role == 'dedicatedHarvester' && creep.carry.energy > creep.carryCapacity * 3/4;
        }
    });
    
    if(almostFullHarvesters.length){
        creep.moveTo(almostFullHarvesters[0]);        
        return true;
    }else{
        return false;
    }
    
}

function pickUpFromExtension(creep){
    var errorCode = util().getEnergyFromClosestSource(creep, 0, false, false, false);
    return errorCode !== null ? true : false;
}