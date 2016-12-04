module.exports = function (creep) {
    return {
        milesRoom: 'W11S6',
        tamsonsRoom: 'W12S5',
        northRoom: 'E77S46',
        southRoom: 'E77S47',
        myRoom: Game.rooms['E77S47'],
        northRoomRoom: Game.rooms['E77S46'],
        findMyCreeps: function(filterObj){
            return this.myRoom.find(FIND_MY_CREEPS, filterObj)
                .concat(this.northRoomRoom.find(FIND_MY_CREEPS, filterObj));
        },
        harvestOrMoveToSource: function(creep){
            var sources = creep.room.find(FIND_SOURCES);
            var harvestReturnCode = creep.harvest(sources[0]);
            
        	if(creep.carry.energy == 0 || (creep.carry.energy < creep.carryCapacity && harvestReturnCode != ERR_NOT_IN_RANGE)) {
        		if(harvestReturnCode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0])
        		}	
        	}
        },
        printCPU(callback){
            if(callback){callback();}
            console.log('Game.cpu.getUsed(): ', Game.cpu.getUsed());
        },
        needsEnergy: function(creep, code){
            return creep.carry.energy == 0 || (creep.carry.energy < creep.carryCapacity && code == ERR_NOT_IN_RANGE);
        },
        getClosestEnergySource: function(creep, minEnergyRatio, spawn2){

            spawn2 = _.isUndefined(spawn2) ? true : spawn2;

            return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure){
                    return (spawn2 || structure.name !== 'Spawn2') && (structure.structureType === STRUCTURE_SPAWN && structure.energy > structure.energyCapacity * minEnergyRatio) || (structure.structureType === STRUCTURE_EXTENSION && structure.energy === structure.energyCapacity);
                }
            });
        },

        //need to change this to be a config object
        getEnergyFromClosestSource: function(creep, minEnergyRatio, allowHarvesting, allowDedicatedCarrier, spawn2){
                
            minEnergyRatio = minEnergyRatio || 0;
            allowHarvesting = _.isUndefined(allowHarvesting) ? false : allowHarvesting;
            allowDedicatedCarrier = _.isUndefined(allowDedicatedCarrier) ? false : allowDedicatedCarrier;

            var closestEnergySource = this.getClosestEnergySource(creep, minEnergyRatio, spawn2);
            var closestDedicatedCarrier = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(c){
                    return c.memory.role === 'dedicatedCarrier';
                }
            })

            var errorCode;
            if(allowDedicatedCarrier){
                if(closestEnergySource && closestDedicatedCarrier && creep.pos.getRangeTo(closestEnergySource) > creep.pos.getRangeTo(closestDedicatedCarrier)){
                    errorCode = creep.moveTo(closestDedicatedCarrier);
                }else if(closestEnergySource){
                    errorCode = closestEnergySource ? closestEnergySource.transferEnergy(creep) : null;
                }else if(closestDedicatedCarrier){
                    errorCode = creep.moveTo(closestDedicatedCarrier);
                }
            }else{
                errorCode = closestEnergySource ? closestEnergySource.transferEnergy(creep) : null;
            }


            if(errorCode == ERR_NOT_IN_RANGE) {
    			creep.moveTo(closestEnergySource);				
    		}

            //if there is no structure, go harvest
            if(!closestEnergySource && allowHarvesting){
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[1]);
                }
            }else if(!closestEnergySource && !allowHarvesting){
                //go to the other room
                var exit;
                if(creep.room === this.myRoom){
                     exit = FIND_EXIT_TOP;
                     creep.moveTo(creep.pos.findClosestByRange(exit));
                 }else{
                     exit = FIND_EXIT_BOTTOM;
                     creep.moveTo(creep.pos.findClosestByRange(exit));
                 }
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
            TOUGH: 10,
            CLAIM: 600
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