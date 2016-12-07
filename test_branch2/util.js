module.exports = function (creep) {
    return {
        milesRoomName: 'E78S47',
        tamsonsRoom: 'W12S5',
        northRoomName: 'E77S46',
        southRoomName: 'E77S47',
        southRoom: Game.rooms['E77S47'],
        northRoom: Game.rooms['E77S46'],
        findMyCreeps: function(filterObj){
            return this.southRoom.find(FIND_MY_CREEPS, filterObj)
                .concat(this.northRoom.find(FIND_MY_CREEPS, filterObj));
        },
        getSpawnForRoom: function(roomName){
            if(roomName === this.southRoomName){
                return Game.spawns.Spawn1;
            }else if(roomName === this.northRoomName){
                return Game.spawns.Spawn2;
            }else{
                return Game.spawns.Spawn1;
            }
        },
        goToRoom: function(roomName, creep){

            // var debugMode = true;
            if(roomName === this.northRoomName && creep.room !== this.northRoom){
                // console.log('going to north room');
                var exit = FIND_EXIT_TOP;
                creep.moveTo(creep.pos.findClosestByRange(exit));
                return false;
            }else if(roomName === this.southRoomName && creep.room !== this.southRoom){
                if(creep.room.name === this.milesRoomName){
                    console.log('util.js::31 :: ');
                    // console.log('going to south room from miles room');
                    var exit = FIND_EXIT_LEFT;
                    creep.moveTo(creep.pos.findClosestByRange(exit));
                    return false;
                }else if(creep.room.name === this.northRoomName){
                    // console.log('going to north room from south room');
                    var exit = FIND_EXIT_BOTTOM;
                    creep.moveTo(creep.pos.findClosestByRange(exit));
                    return false;
                }
            }else{
                return true;
            }
        },
        goToAssignedRoom: function(creep){
            return this.goToRoom(creep.getAssignedRoom().name, creep);
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
        getClosestEnergySource: function(creep, opts={}){

            _.defaults(opts, {
                minEnergyRatio: 0,
                forGathering: true,
                allowHarvesting: false,
                creepTypes: [],
                allowStructures: true
            });

            var closestCreep;
            var closestSource;
            var closestDroppedResource;
            var closestStructure;
            var isCorrectRoom = (obj) => { return opts.room ? obj.room === opts.room : true }
            var generalRequirements = (possibility) => {

                var currentEnergyKey;
                var potentialEnergyKey;

                if(possibility instanceof StructureStorage){
                    currentEnergyKey = 'store[' + RESOURCE_ENERGY + ']';
                    potentialEnergyKey = 'storeCapacity';
                }else{
                    currentEnergyKey = 'energy';
                    potentialEnergyKey = 'energyCapacity';
                }

                if(opts.forGathering){
                    var hasEnoughEnergyForGathering = _.get(possibility, currentEnergyKey) > (_.get(possibility, potentialEnergyKey) * opts.minEnergyRatio);
                    return  isCorrectRoom(possibility) && hasEnoughEnergyForGathering;
                }else{
                    var lacksEnoughEnergyForDepositing = _.get(possibility, currentEnergyKey) < (_.get(possibility, potentialEnergyKey) * (1 - opts.minEnergyRatio));
                    return isCorrectRoom(possibility) && lacksEnoughEnergyForDepositing;
                }
            }

            //STRUCTURES
            if(opts.allowStructures){
                closestStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: function(structure){
                        return (structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_STORAGE) 
                        && generalRequirements(structure);
                    }
                });
            }


            //DROPPED ENERGY
            if(opts.forGathering){
                closestDroppedResource = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, generalRequirements);
            }

            //CREEPS
            closestCreep = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: function(c){ return opts.creepTypes.includes(c.memory.role) && generalRequirements(c); }
            });

            //HARVESTING
            if(opts.allowHarvesting && forGathering){
                closestSource = creep.pos.findClosestByPath(FIND_SOURCES, generalRequirements);
            }

            var possibilities = _.compact([closestStructure, closestCreep, closestSource, closestDroppedResource]);
            return creep.pos.findClosestByPath(_.compact(possibilities));
        },

        getEnergyFromClosestSource: function(creep, opts={}){

            var creepTypes = Game.status ? ['dedicatedCarrier', 'harvester', 'harvesterTwo'] : ['dedicatedCarrier'];
            var allowStructures = Game.status === 'complete';

            _.defaults(opts, {
                minEnergyRatio: 0,
                allowHarvesting: false,//allow them to go harvet on their own
                allowDedicatedCarrier: false,//allow them to get from a carrier
                allowStructures: allowStructures,
                creepTypes: creepTypes
            });

            var errCode;
            var closestEnergySource = this.getClosestEnergySource(creep, opts);

            //it's a structure
            if(closestEnergySource instanceof Structure){
                errCode = closestEnergySource.transferEnergy(creep);
            }else if(closestEnergySource instanceof Creep){
                errCode = closestEnergySource.transfer(creep);
            }else if(closestEnergySource instanceof Source){
                errCode = creep.harvest(closestEnergySource);
            }else if(closestEnergySource instanceof Resource){
                errCode = creep.pickup(closestEnergySource);
            }

            if(errCode == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnergySource);              
            }

    		return errCode;
        },
        giveEnergyToClosestRecipient: function(creep, opts={}){

            _.defaults(opts, {
                maxEnergyRatio: 0.99,
                creepTypes: ['builder', 'upgrader', 'repairer'],
                allowStructures: false
            });

            var errCode;
            var closestEnergyRecipient = this.getClosestEnergySource(creep, _.extend(opts, {
                forGathering: false,
                minEnergyRatio: 1 - opts.maxEnergyRatio
            }));

            console.log('creep: ', creep);
            console.log('closestEnergyRecipient: ', closestEnergyRecipient);

            if(closestEnergyRecipient){
                errCode = creep.transfer(closestEnergyRecipient, RESOURCE_ENERGY);
            }

            if(errCode == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnergyRecipient);              
            }

            return errCode;
        },
        doWorkUnlessCloseToSource: function(creep, awayFromSourceWork){
            var debugMode = false;
            var closestEnergySource = this.getClosestEnergySource(creep);
            var isCloseToEnergy = false;

            if(closestEnergySource){
                isCloseToEnergy = creep.pos.inRangeTo(closestEnergySource, 5);
            }

            if(isCloseToEnergy){
                if(creep.carry.energy < (creep.carryCapacity * 0.9)){
                    if(debugMode){console.log('gather 1');}
                    this.getEnergyFromClosestSource(creep);
                }else{
                    if(debugMode){console.log('deposit 1');}
                    awayFromSourceWork(creep)
                }
            }else{
                if(creep.carry.energy > (creep.carryCapacity * 0.1)){
                    if(debugMode){console.log('deposit 2');}
                    awayFromSourceWork(creep);
                }else{
                    if(debugMode){console.log('gather 2');}
                    this.getEnergyFromClosestSource(creep);
                }
            }
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