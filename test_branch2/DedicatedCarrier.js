var util = require('util')

module.exports = function (creep, status) {
    
    //
    // DEPOSITING
    //
    if(creep.carry.energy > 0){
        
        var targetLocked = false;
        
        if(status === 'complete'){
            if(!targetLocked){ targetLocked = giveToUpgraders(creep); }        
        }
    
        if(!targetLocked){ targetLocked = fillExtension(creep); }
        
        // fillTank
            
        if(!targetLocked){ targetLocked = fillSpawn(creep); }
        
    //
    // GATHERING
    //
    }else{
        var targetLocked = false;
        
        if(!targetLocked){ targetLocked = getDroppedResources(creep); }
        
        if(!targetLocked){ targetLocked = pickUpFromHarvester(creep); }
        
        //this technically does extensions and spawn for now
        if(!targetLocked){ targetLocked = pickUpFromExtension(creep); }
        
        //tank
        
        //spawn
    }
}

function giveToUpgraders(creep){
    var nonFullUpgraders = util().myRoom.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            // console.log( creep.memory.role)
            // console.log('energy' + creep.carry.energy)
            // console.log(creep.carryCapacity)
            return creep.memory.role == 'dedicatedUpgrader' && (creep.carry.energy < creep.carryCapacity);
        }
    });
    
    //do the lowest one firt
    var nonFullUpgrader = _.min(nonFullUpgraders, 'carry.energy');
    
    // console.log(nonFullUpgrader.carry.energy)
    
    if(nonFullUpgrader){
        var transferCode = creep.transfer(nonFullUpgrader, RESOURCE_ENERGY);
    
        // console.log(transferCode)

        if(transferCode == ERR_NOT_IN_RANGE) {
            creep.moveTo(nonFullUpgrader);    
        }
        
        return true;
    }else{
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
    var almostFullHarvesters = Game.rooms.W11S5.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            // console.log('energy' + creep.energy)
            // console.log(creep.energyCapacity)
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
    var errorCode = util().getEnergyFromClosestSource(creep);
    return errorCode !== null ? true : false;
}