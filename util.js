var DistanceValueCalculator = require('DistanceValueCalculator');
var GetEnergyUtil = require('GetEnergyUtil');

module.exports = {
        milesRoomName: 'E78S47',
        teaSkittlesRoomName: 'E78S46',
        farNorthRoomName: 'E77S44',
        scaryInvaderRoomName: 'E76S45',
        northRoomName: 'E77S46',
        southRoomName: 'E77S47',
        southRoom: Game.rooms['E77S47'],
        northRoom: Game.rooms['E77S46'],
        farNorthRoom: Game.rooms['E77S44'],
        room1: Game.rooms['E57N86'],
        milesUsername: 'Nephite135',
        dcn: 'superHarvester(E77S47)',//debugCreepName
        findMyCreeps: function(filterObj){
            return _.values(Game.creeps).filter(filterObj.filter);
        },
        getAllRooms: function(){
            return [this.room1];
        },
        //like the room.find method but will look in all my rooms
        findInAllRooms: function(constant, opts){
            var result = [];

            this.getAllRooms().forEach(room => {
                result.push(...room.find(constant, opts));
            });
            return result;
        },
        getNoEnergySpot: function(room){
            if(room === this.southRoom){
                return new RoomPosition(36, 31, room);
            }else if(room === this.northRoom){
                return new RoomPosition(1, 23, room);
            }else if(room === this.farNorthRoom){
                return new RoomPosition(23, 35, room);
            }
        },
        getSpawnForRoom: function(roomName){
            if(roomName === this.room1.name){
                return Game.spawns.Spawn1;
            }else if(roomName === this.northRoomName){
                return Game.spawns.Spawn2;
            }else if(roomName === this.farNorthRoomName){
                return Game.spawns.Spawn3;           
            }
        },
        goToRoom: function(roomName, creep){

            if(roomName === creep.room.name){
                return true;
            }

            var route = Game.map.findRoute(creep.room.name, roomName);
            var exit = creep.pos.findClosestByPathUsingCache(route[0].exit);
            var somePosition = new RoomPosition(29, 1, 'E76S46')
            var somePosition2 = new RoomPosition(11, 37, 'E77S45')

            if(creep.room.name === 'E76S46' && !creep.pos.isEqualTo(somePosition)){
                creep.moveToUsingCache(somePosition);
            }else if(creep.room.name === this.scaryInvaderRoomName){

                var ignoreGrids = [
                    COLOR_GREY,
                    COLOR_WHITE
                ];

                var avoidPositions = []
                ignoreGrids.forEach(grid => {
                    this.forEachCellInGrid(grid, cell => {
                        // console.log('cell: ', cell);
                        avoidPositions.push(cell);
                    }, creep);
                });

                creep.moveTo(exit, {
                    avoid: avoidPositions
                });

            }else if(creep.room.name === 'E77S45' && creep.pos.y > somePosition2.y){
                creep.moveTo(somePosition2);
            }else{
                var rCode = creep.moveTo(exit)
                if(rCode === -5 || rCode === -2){
                    if(_.random(0, 1) === 1){
                        creep.move(RIGHT)
                    }else{
                        creep.move(BOTTOM)
                    }
                }
            }

            return false;
        },
        goToAssignedRoom: function(creep){
            var room  = creep.getAssignedRoom()
            if(room){
                return this.goToRoom(room.name, creep);
            }
        },
        printCPU(callback){
            if(callback){callback();}
            console.log('Game.cpu.getUsed(): ', Game.cpu.getUsed());
        },
        printSelfCpu(funcName, func){
            var tempCpu = Game.cpu.getUsed();
            func();
            var selfCpu = Game.cpu.getUsed() - tempCpu;
            console.log('selfCpu: ', selfCpu);
        },
        trackCPU(key, start){
            if(start){
                _.set(Game, `trackedFuncs[${key}]`, {});
                Game.trackedFuncs[key].startCPU = Game.cpu.getUsed();
            }else if(!start){
                Game.trackedFuncs[key].selfCpu = _.round(Game.cpu.getUsed() - Game.trackedFuncs[key].startCPU, 3);
                this.printWithSpacing(key + ': ' + Game.trackedFuncs[key].selfCpu);                
            }
        },
        printWithSpacing(msg){

            var indexOfColon = msg.indexOf(':');
            if(indexOfColon === -1){
                console.log('NEED A COLON');
                return;
            }

            while(msg.indexOf(':') < 20){
                msg = msg.replace(':', ' :');
            }

            console.log(msg);
            // myGlobal.emailReport += (msg + '\n');
        },
        needsEnergy: function(creep, code){
            return creep.carry.energy == 0 || (creep.carry.energy < creep.carryCapacity && code == ERR_NOT_IN_RANGE);
        },
        getClosestStructure: function(creep, filter=this.returnAllFilter, opts={}){

            _.defaults(opts, {
                includeSpawns     : true,
                includeExtensions : true,
                includeStorage    : true,
                includeContainers : true,
                includeLinks      : true,
                includeTowers     : true
            });

            var structuresToInclude = _.compact([
                opts.includeSpawns     ? STRUCTURE_SPAWN     : undefined,
                opts.includeExtensions ? STRUCTURE_EXTENSION : undefined,
                opts.includeStorage    ? STRUCTURE_STORAGE   : undefined,
                opts.includeContainers ? STRUCTURE_CONTAINER : undefined,
                opts.includeLinks      ? STRUCTURE_LINK      : undefined,
                opts.includeTowers     ? STRUCTURE_TOWER     : undefined
            ]);

            return creep.pos.findClosestByPathUsingCache(FIND_STRUCTURES, {
                filter: function(s){
                    return structuresToInclude.includes(s.structureType) && filter(s);
                }
            });
        },
        getClosestDroppedEnergy: function(creep, filter=this.returnAllFilter){

            //HACK BECAUSE FOR SOME REASON IT WAS LETTING ME CALCULATE PATHS TO OUTSIDE MY WALLS
            newFilter = (e) => {
                return filter(e) && e.pos.x !== 1
            }

            return creep.pos.findClosestByPathUsingCache(FIND_DROPPED_ENERGY, {
                filter: newFilter
            });
        },
        getClosestCreep: function(creep, opts={}){

            _.defaults(opts, {
                filter: this.returnAllFilter,
                creepTypes: []
            });

            var closestCreep = creep.pos.findClosestByPathUsingCache(FIND_MY_CREEPS, {
                filter: (c) => {
                    return opts.creepTypes.includes(c.memory.role) && opts.filter(c);    
                }
            });

            return closestCreep;
        },
        getClosestSource: function(creep, filter=this.returnAllFilter){
            return creep.pos.findClosestByPathUsingCache(FIND_SOURCES, {
                filter: filter
            });
        },
        getBestEnergyRecipient: function(creep, opts = {}){

            _.defaults(opts, {
                maxEnergyRatio: 1,
                creepTypes: [],
                allowStructures: true,
                allowStorage: true,
                allowLink: true,
                allowTowers: true
            });

            var closestCreep;
            var closestSource;
            var closestDroppedResource;
            var closestStructure;
            var closestTower;
            var isCorrectRoom = (obj) => { return opts.room ? obj.room === opts.room : true }
            var generalRequirements = (possibility) => {
                var energy = GetEnergyUtil.getCurrentEnergy(possibility);
                var energyCapacity = GetEnergyUtil.getEnergyCapacity(possibility);
                var lacksEnoughEnergyForDepositing = energy < energyCapacity * opts.maxEnergyRatio;
                return isCorrectRoom(possibility) && lacksEnoughEnergyForDepositing;
            }

            //get closest structures
            closestStructure = opts.allowStructures ? this.getClosestStructure(creep, generalRequirements, {
                includeLinks: opts.allowLink,
                includeStorage: opts.allowStorage,
                includeContainers: opts.allowStorage,
                includeTowers: opts.allowTowers
            }) : null;

            //get closest creep
            closestCreep = this.getClosestCreep(creep, {
                filter: generalRequirements,
                creepTypes: opts.creepTypes
            });

            //get the closest tower too, since we do some custom logic for towers
            closestTower = opts.allowStructures && opts.allowTowers ? this.getClosestStructure(creep, generalRequirements, {
                includeTowers: true,
                includeExtensions: false,
                includeContainers: false,
                includeStorage: false,
                includeSpawns: false,
                includeLinks: false
            }) : null;

            var possibilities = _.compact([closestStructure, closestCreep, closestTower]);

            var distanceValuePossibilities = possibilities.map(p => {
                return {
                    target: p,
                    valueFunc: DistanceValueCalculator.giveEnergyValueFunc
                };
            });

            var distanceValueCalculator = new DistanceValueCalculator(this.getPath.bind(this));
            var best = distanceValueCalculator.getBestDistanceValue(creep, distanceValuePossibilities);

            //////// priority rules that override closest
            //make sure tower always stays at at least 700
            if(opts.allowTowers && closestTower && closestTower.energy < 700){
                best = closestTower;
            }

            return best;
        },
        getBestEnergySource: function(creep, opts={}){

            _.defaults(opts, {
                minEnergyRatio: 0,
                takeFromSource: false,//allow them to go harvest on their own
                takeFromStorage: true,
                takeFromContainers: true,
                takeFromExtensions: true,
                takeFromSpawn: true,
                takeFromCreeps: ['carrier']
            });

            // if(creep.room.status === 'incomplete'){
            //     return this.getNoEnergySpot(creep);
            // }

            var closestCreep;
            var closestSource;
            var closestDroppedResource;
            var closestStructure;
            var isCorrectRoom = (obj) => { return opts.room ? obj.room === opts.room : true }
            var generalRequirements = (possibility) => {
                var energy = GetEnergyUtil.getCurrentEnergy(possibility);
                var energyCapacity = GetEnergyUtil.getEnergyCapacity(possibility);
                var hasEnoughEnergyForGathering = energy > energyCapacity * opts.minEnergyRatio;
                return isCorrectRoom(possibility) && hasEnoughEnergyForGathering;
            }

            closestStructure = this.getClosestStructure(creep, generalRequirements, {
                includeStorage: opts.takeFromStorage,
                includeContainers: opts.takeFromContainers,
                includeExtensions: opts.takeFromExtensions,
                includeSpawns: opts.takeFromSpawn,
                includeTowers: false
            });
            closestDroppedResource = this.getClosestDroppedEnergy(creep, generalRequirements);
            closestCreep = this.getClosestCreep(creep, {
                filter: generalRequirements,
                creepTypes: opts.takeFromCreeps
            });
            closestSource = opts.allowHarvesting ? this.getClosestSource(creep, generalRequirements): null;

            var possibilities = _.compact([closestStructure, closestCreep, closestSource, closestDroppedResource]);

            var distanceValuePossibilities = possibilities.map(p => {
                return {
                    target: p,
                    valueFunc: DistanceValueCalculator.fillUpOnEnergyValueFunc
                };
            });

            var distanceValueCalculator = new DistanceValueCalculator(this.getPath.bind(this));
            var best = distanceValueCalculator.getBestDistanceValue(creep, distanceValuePossibilities);

            return best;
        },
        getBestNonSpawningEnergySource(creep, opts={}){
            _.defaults(opts, {
                takeFromStorage: true,
                takeFromContainers: true,
                takeFromSource: false,
                takeFromExtensions: false,
                takeFromSpawn: false,
                takeFromCreeps: ['carrier']
            });

            var bestNonSpawningEnergySource = this.getBestEnergySource(creep, opts);
            return bestNonSpawningEnergySource;
        },
        getEnergyFromBestNonSpawningRoomObject(creep, opts={}){
            var closestEnergySource = this.getBestNonSpawningEnergySource(creep, opts);
            return this.getEnergyFromRoomObject(creep, closestEnergySource);
        },
        getEnergyFromRoomObject(creep, roomObject){
            var errCode;

            if(roomObject instanceof StructureStorage || roomObject instanceof StructureContainer){
                errCode = creep.withdraw(roomObject, RESOURCE_ENERGY);
            }else if(roomObject instanceof Structure){
                errCode = roomObject.transferEnergy(creep);
            }else if(roomObject instanceof Creep){
                errCode = roomObject.transfer(creep, RESOURCE_ENERGY);
            }else if(roomObject instanceof Source){
                errCode = creep.harvest(roomObject);
            }else if(roomObject instanceof Resource){
                errCode = creep.pickup(roomObject);
            }

            if(errCode == ERR_NOT_IN_RANGE) {
                creep.moveToUsingCache(roomObject);              
            }

            return errCode;
        },
        getEnergyFromBestSource: function(creep, opts={}){
            var closestEnergySource = this.getBestEnergySource(creep, opts);
    		return this.getEnergyFromRoomObject(creep, closestEnergySource);
        },
        giveEnergyToBestRecipient: function(creep, opts={}){

            _.defaults(opts, {
                creepTypes: ['builder', 'upgrader', 'repairer'],
                allowStructures: false,
                allowStorage: true,
                allowTowers: true,
                allowLink: true
            });

            var errCode;
            var closestEnergyRecipient = this.getBestEnergyRecipient(creep, opts);

            return this.giveEnergyToRecipient(creep, closestEnergyRecipient);
        },
        findHostiles(room, opts={}){

            _.defaults(opts, {
                usersToIgnore: [this.milesUsername]
            });

            return room.find(FIND_HOSTILE_CREEPS, opts).filter(hostile => {
                return !_.contains(opts.usersToIgnore, hostile.owner.username);
            });
        },
        giveEnergyToRecipient(creep, recipient){
            errCode = creep.transfer(recipient, RESOURCE_ENERGY);

            if(errCode == ERR_NOT_IN_RANGE) {
                creep.moveToUsingCache(recipient);              
            }

            return errCode;
        },
        doWorkOtherwise(creep, opts={}){

            _.defaults(opts, {
                workTarget      : this.throwIfMissing(opts.workTarget, 'workTarget'),
                workFunc        : this.throwIfMissing(opts.workFunc, 'workFunc'),
                otherwiseTarget : this.throwIfMissing(opts.otherwiseTarget, 'otherwiseTarget'),
                otherwiseFunc   : this.throwIfMissing(opts.otherwiseFunc, 'otherwiseFunc'),
                //positive means doing work gains energy, eg harvesters
                //negative means doing work loses energy, eg upgraders
                polarity        : 'positive',
            });

            var distanceValuePossibilities = [
                {
                    target: opts.workTarget,
                    valueFunc: (creep, target) => {
                        if(opts.polarity === 'positive'){
                            return DistanceValueCalculator.fillUpOnEnergyValueFunc(creep, target);
                        }else if(opts.polarity === 'negative'){
                            return DistanceValueCalculator.giveEnergyValueFunc(creep, target);
                        }
                    }
                },
                {
                    target: opts.otherwiseTarget,
                    valueFunc: (creep, target) => {
                        if(opts.polarity === 'positive'){
                            return DistanceValueCalculator.giveEnergyValueFunc(creep, target);
                        }else if(opts.polarity === 'negative'){
                            return DistanceValueCalculator.fillUpOnEnergyValueFunc(creep, target);
                        }
                    }
                }
            ];

            var distanceValueCalculator = new DistanceValueCalculator(this.getPath.bind(this));
            var bestDistanceValue = distanceValueCalculator.getBestDistanceValue(creep, distanceValuePossibilities);

            if(bestDistanceValue === opts.workTarget){
                opts.workFunc();
            }else{
                opts.otherwiseFunc();
            }
        },
        doWorkOrGatherEnergy(creep, opts={}){

            _.defaults(opts, {
                workFunc   : this.throwIfMissing(opts.workFunc, 'workFunc'),
                workTarget : this.throwIfMissing(opts.workTarget, 'workTarget'),
                status     : this.throwIfMissing(opts.status, 'status'),
            });

            var otherwiseFunc;
            var otherwiseTarget;
            if(creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0){
                otherwiseTarget = this.getBestNonSpawningEnergySource(creep);
                otherwiseFunc = this.getEnergyFromRoomObject.bind(this, creep, otherwiseTarget);
            }else if(opts.status === 'complete'){
                otherwiseTarget = this.getBestEnergySource(creep);
                otherwiseFunc = this.getEnergyFromRoomObject.bind(this, creep, otherwiseTarget);
            }else{
                otherwiseTarget = creep.room.find(FIND_SOURCES)[0]
                otherwiseFunc = this.harvest.bind(this, creep, {sourceIndex: 0});
            }

            this.doWorkOtherwise(creep, {
                workTarget    : opts.workTarget,
                workFunc      : opts.workFunc,
                otherwiseFunc,
                otherwiseTarget: otherwiseTarget,
                polarity      : 'negative'
            });
        },
        // doWorkOrDepositEnergy(creep, opts={}){

        //     _.defaults(opts, {
        //         workFunc   : undefined,
        //         workTarget : undefined
        //     });

        //     this.doWorkOtherwise(creep, {
        //         workTarget    : opts.workTarget,
        //         workFunc      : opts.workFunc,
        //         //I don't think that is the method we want
        //         // otherwiseFunc : this.giveEnergyToBestRecipient.bind(this, creep),
        //         polarity      : 'negative'
        //     });
        // },
        // collectEnergyForWork(){
        //     _.defaults(opts, {
        //         harvest: true
        //     });

        //     if(opts.harvest){
        //         //harvest from source
        //     }else{
        //         //get from harveser, then storage if need be
        //     }
        // },

        //the distance value stuff should: 
        // [ ] I should generalize the distance formala futher, so that I can get the distanceValue of any item.  That is how it will find the ‘closest item’ too.  IT would be cool if it also took into account energy sources nearby


        // collectEnergyForSpawning(){

        //     _.defaults(opts, {
        //         harvest: true
        //     });

        //     if(opts.harvest){
        //         //harvest from source
        //     }else{
        //         //pull from storage, containers
        //         //get from harvesters
        //     }
        // },
        getBestRecipientForSpawning(creep){
            return this.getBestEnergyRecipient(creep, {
                allowStructures  : true,
                allowTowers      : false,
                allowStorage     : false,
                allowLink        : false,
                creepTypes       : [] 
            });
        },
        depositEnergyForSpawning(creep){
            return this.giveEnergyToRecipient(creep, this.getBestRecipientForSpawning(creep));
        },
        depositEnergyForWork(creep){
            return this.giveEnergyToBestRecipient(creep, {
                allowStructures  : true,
                allowTowers      : false,//setting to false so harvesters don't walk all the way to the towers for now
                allowStorage     : true,
                allowLink        : true,
                creepTypes       : ['upgrader', 'builder'] 
            });
        },
        harvest(creep, opts){

            _.defaults(opts, {
                sourceIndex: 0,
            });

            var sources = creep.room.find(FIND_SOURCES);
            var errCode = creep.harvest(sources[opts.sourceIndex]);
            if(errCode === ERR_NOT_IN_RANGE || errCode === ERR_NOT_ENOUGH_RESOURCES) {
                creep.moveToUsingCache(sources[opts.sourceIndex]);
            } 
        },
        getCreepsOfType: function(types=[], room){
            return room.find(FIND_MY_CREEPS, {
                filter: (c => {
                    return types.includes(c.memory.role);
                })
            })
        },
        getEnergyFromStorage(creep){
            var storageWithEnergy = this.getClosestStorageWithEnergy(creep)
            if(creep.withdraw(storageWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveToUsingCache(storageWithEnergy)
            }
        },
        getClosestStorageWithEnergy(creep){
            return creep.pos.findClosestByPathUsingCache(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER) 
                    && s.store[RESOURCE_ENERGY] > 0;
                }
            });
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
        bodyPartStringEnumMap: {
            MOVE: MOVE,
            WORK: WORK,
            CARRY: CARRY,
            ATTACK: ATTACK,
            RANGED_ATTACK: RANGED_ATTACK,
            HEAL: HEAL,
            TOUGH: TOUGH,
            CLAIM: CLAIM
        },
        getBodyPartsArray(bodyPartsHash){
            var array = [];
            _.forOwn(bodyPartsHash, (value, key) => {
                for (var i = 0; i < value; i++) {
                    array.push(this.bodyPartStringEnumMap[key]);
                }
            });

            return array;
        },
        convertRatiosToBodyPartArray(opts={}){

            _.defaults(opts, {
                energyToUseForBodyParts    : 0,
                attackPercent              : 0,
                movePercent                : 0,
                carryPercent               : 0,
                rangedAttackPercent        : 0,
                workPercent                : 0,
                healPercent                : 0,
                toughPercent               : 0,
                claimPercent               : 0
            });

            //throw error if not enough energy or something

            //calculate each percent
            //if there is any left over, we are not going to try and do anything special with that energy
            return this.getBodyPartsArray({
                MOVE           : Math.floor((opts.movePercent         * opts.energyToUseForBodyParts) / this.bodyPartEnergyMap['MOVE']),
                WORK           : Math.floor((opts.workPercent         * opts.energyToUseForBodyParts) / this.bodyPartEnergyMap['WORK']),
                CARRY          : Math.floor((opts.carryPercent        * opts.energyToUseForBodyParts) / this.bodyPartEnergyMap['CARRY']),
                ATTACK         : Math.floor((opts.attackPercent       * opts.energyToUseForBodyParts) / this.bodyPartEnergyMap['ATTACK']),
                RANGED_ATTACK  : Math.floor((opts.rangedAttackPercent * opts.energyToUseForBodyParts) / this.bodyPartEnergyMap['RANGED_ATTACK']),
                HEAL           : Math.floor((opts.healPercent         * opts.energyToUseForBodyParts) / this.bodyPartEnergyMap['HEAL']),
                TOUGH          : Math.floor((opts.toughPercent        * opts.energyToUseForBodyParts) / this.bodyPartEnergyMap['TOUGH']),
                CLAIM          : Math.floor((opts.claimPercent        * opts.energyToUseForBodyParts) / this.bodyPartEnergyMap['CLAIM'])
            });
        },
        returnAllFilter: function(){
            return true;
        },
        forEachCellInGrid: function(color, func, creep){

            var flags = this.findInAllRooms(FIND_FLAGS, {
                filter: flag => flag.color === color
            });

            if(creep){
                flags = creep.room.find(FIND_FLAGS, {
                    filter: flag => flag.color === color
                });
            }

            var top = _.min(flags, 'pos.y').pos.y;
            var right = _.max(flags, 'pos.x').pos.x;
            var bottom = _.max(flags, 'pos.y').pos.y;
            var left = _.min(flags, 'pos.x').pos.x;

            // console.log('top: ', top);
            // console.log('right: ', right);
            // console.log('bottom: ', bottom);
            // console.log('left: ', left);

            //for each row
            for (var y = top; y <= bottom; y++) {
                //go through each cell
                for (var x = left; x <= right; x++) {
                    func(new RoomPosition(x, y, flags[0].room.name));
                };
            };
        },
        forEachCellInPath: function(color, func, pathWidth=3){

            if(pathWidth != 3){
                console.log('only pathWidth: 3 is supported right now');
                return;
            }

            //flags
            var flags = this.findInAllRooms(FIND_FLAGS, {
                filter: flag => flag.color === color
            });
            var room = flags[0].room;

            //get path
            //true = walkable, see http://support.screeps.com/hc/en-us/articles/203079011-Room#findPath
            var pathSteps = flags[0].pos.findPathTo(flags[1], {
                ignoreCreeps: true, //Treat squares with creeps as walkable (we want to build the road where the creeps are)
                ignoreDestructibleStructures: false, //We want to draw the path around walls and extensions and stuff
                ignoreRoads: true, //we want to build on the roads we are already have
            }); 

            pathSteps.forEach(step => {
                func(new RoomPosition(step.x, step.y, room.name));
                func(new RoomPosition(step.x+1, step.y, room.name));
                func(new RoomPosition(step.x-1, step.y, room.name));
                func(new RoomPosition(step.x, step.y+1, room.name));
                func(new RoomPosition(step.x, step.y-1, room.name));
                func(new RoomPosition(step.x+1, step.y+1, room.name));
                func(new RoomPosition(step.x-1, step.y-1, room.name));
                func(new RoomPosition(step.x+1, step.y-1, room.name));
                func(new RoomPosition(step.x-1, step.y+1, room.name));
            });
        },
        getPath(start, end, opts={}){
            //schema
            // pathsByStartAndEndIds.startX.startY.endX.endY

            _.defaults(opts, {
                bustCache: false,
                useCache: true
            });


            if(!(start instanceof RoomPosition)){
                start = start.pos;
            }

            if(!(end instanceof RoomPosition)){
                end = end.pos;
            }

            var cachePropertyString = `pathsHash[${start.roomName}][${start.x}][${start.y}][${end.roomName}][${end.x}][${end.y}]`;

            //CLEAR CACHE!!!!!!!!!!!!
            // delete Memory.pathsHash;

            var path;
            if(opts.useCache){
                path = _.get(Memory, cachePropertyString);
                if(!path || opts.bustCache){
                    myGlobal.cacheMisses++;
                    //get the path, here are the different flags you can pass:
                    //http://support.screeps.com/hc/en-us/articles/203079011-Room#findPath 
                    path = start.findPathTo(end, {
                        serialize: true,
                        ignoreCreeps: true
                    });
                    _.set(Memory, cachePropertyString, path);
                }else{
                    myGlobal.cacheHits++;
                }
            }else{
                myGlobal.cacheMisses++;
                path = start.findPathTo(end);
            }

            if(typeof path === 'string'){
                path = Room.deserializePath(path);
            }

            return path;
        },
        runFromInvader(creep){
            var hostiles = this.findHostiles(creep.room);
            var inRange;
            if(hostiles.length){
                inRange = creep.pos.inRangeTo(hostiles[0], 5);
                if(hostiles.length && inRange){
                    creep.moveToUsingCache(creep.room.getSafeAreaFromInvaders());
                }
            }

            return hostiles.length && inRange;
        },
        printObject(obj){
            _.forOwn(obj, function(value, key) {
              console.log(key + ': ' + value);
            });
        },
        getDirections(){
            return [
                TOP,
                TOP_RIGHT,
                RIGHT,
                BOTTOM_RIGHT,
                BOTTOM,
                BOTTOM_LEFT,
                LEFT,
                TOP_LEFT,
            ];
        },
        creepIsAboutToDie(creep, creepType){
            return creep.ticksToLive <= creepType.ticksToSpawn();
        },
        throwIfMissing(prop, propName) {
            if(_.isUndefined(prop)){
                throw new Error('Missing parameter: ' + (propName ? propName : 'No prop name provided'));
            }
        }
}