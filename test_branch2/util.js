module.exports = function (creep) {
    return {
        milesRoom: 'W11S6',
        tamsonsRoom: 'W12S5',
        myRoom: Game.rooms['W69N14'],
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
        getEnergyFromClosestSource: function(creep, minEnergyRatio){
                
            minEnergyRatio = minEnergyRatio || 0;

            var closestEnergySource = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure){

                    return (structure.structureType === STRUCTURE_SPAWN && structure.energy > structure.energyCapacity * minEnergyRatio) || (structure.structureType === STRUCTURE_EXTENSION && structure.energy === structure.energyCapacity);
                }
            });
            
            var errorCode = closestEnergySource ? closestEnergySource.transferEnergy(creep) : null;
                
            if(errorCode == ERR_NOT_IN_RANGE) {
    			creep.moveTo(closestEnergySource);				
    		}
    		
    		return errorCode;
        },
        bodyPartEnergyMap: {
            MOVE: 50,
            WORK: 100,
            CARRY: 50,
            ATTACK: 80,
            RANGED_ATTACK: 150,
            HEAL: 250,
            TOUGH: 10
        },
        cleanDeadCreepsFromMemory: function(memoryVar){
            if(typeof memoryVar !== 'object'){
                _.remove(memoryVar, function(creep){
                    return creep.ticksToLive < 3 || creep.ticksToLive === undefined;
                })
            }else{
                var keys = _.keys(memoryVar);
                
                for(var i = 0; i < keys.length; i++){
                    if(memoryVar[keys[i]].ticksToLive < 3 || memoryVar[keys[i]].ticksToLive === undefined){
                        delete memoryVar[keys[i]];
                    }
                }
            }
        },
        registerOtherRoomCreep: function(creep){
            

            
            // console.log(creep)
            if(!Memory.otherRoomCreeps){
                Memory.otherRoomCreeps = [creep];
            }else{
                
                if(creep.room === this.tamsonsRoom){
                    if(!_.contains(Memory.otherRoomCreeps, creep)){
                        Memory.otherRoomCreeps.push(creep)
                    }   
                }else{
                    _.remove(Memory.otherRoomCreeps, function(c){
                        return creep === c;
                    });
                }
                
                //clean up dead creeps
                this.cleanDeadCreepsFromMemory(Memory.otherRoomCreeps);
            }
        }
    }   
}