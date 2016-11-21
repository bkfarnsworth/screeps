module.exports = function (creep) {
    return {
        milesRoom: 'W11S6',
        myRoom: Game.rooms.W11S5,
        harvestOrMoveToSource: function(creep){
            var sources = creep.room.find(FIND_SOURCES);
            var harvestReturnCode = creep.harvest(sources[0]);
            
        	if(creep.carry.energy == 0 || (creep.carry.energy < creep.carryCapacity && harvestReturnCode != ERR_NOT_IN_RANGE)) {
        		if(harvestReturnCode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0])
        		}	
        	}
        },
        needsEnergy: function(creep, code){
            return creep.carry.energy == 0 || (creep.carry.energy < creep.carryCapacity && code == ERR_NOT_IN_RANGE);
        },
        getEnergyFromClosestSource: function(creep){
            
            var closestEnergySource = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure){
                    return (structure.structureType === STRUCTURE_SPAWN && structure.energy > structure.energyCapacity * 2/3) || (structure.structureType === STRUCTURE_EXTENSION && structure.energy === structure.energyCapacity);
                }
            });
            
            var errorCode = closestEnergySource ? closestEnergySource.transferEnergy(creep) : null;
            
            if(errorCode == ERR_NOT_IN_RANGE) {
    			creep.moveTo(closestEnergySource);				
    		}
    		
    		return errorCode;
        },
        minLife: 200,
        renewLevel: 1200,
        creepsAreDying: function(){
            var that = this;
            var dyingCreeps = this.myRoom.find(FIND_MY_CREEPS, {
                filter: function(creep){
                    return that.shouldRenew(creep);
                }
            })  
            
            return dyingCreeps.length;
        },
        shouldRenew: function(creep){
            return creep.ticksToLive < this.minLife || (this.isNextToTarget(creep, Game.spawns.Spawn1) && creep.ticksToLive < this.renewLevel);  
        },
        isNextToTarget: function(creep, target){
            var xDistance = Math.abs(creep.pos.x - target.pos.x);
            var yDistance = Math.abs(creep.pos.y - target.pos.y);
            return (xDistance === 1 || xDistance === 0) && (yDistance === 1 || yDistance === 0)
        },
        bodyPartEnergyMap: {
            MOVE: 50,
            WORK: 100,
            CARRY: 50,
            ATTACK: 80,
            RANGED_ATTACK: 150,
            HEAL: 250,
            TOUGH: 10
        }
    }   
}