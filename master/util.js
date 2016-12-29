module.exports = function (creep) {
    return {
        milesRoomName: 'E78S47',
        teaSkittlesRoomName: 'E78S46',
        farNorthRoomName: 'E77S44',
        scaryInvaderRoomName: 'E76S45',
        northRoomName: 'E77S46',
        southRoomName: 'E77S47',
        southRoom: Game.rooms['E77S47'],
        northRoom: Game.rooms['E77S46'],
        farNorthRoom: Game.rooms['E77S44'],
        milesUsername: 'Nephite135',
        dcn: 'superHarvester(E77S47)',//debugCreepName
        findMyCreeps: function(filterObj){
            return _.values(Game.creeps).filter(filterObj.filter);
        },
        getAllRooms: function(){
            return [this.farNorthRoom, this.northRoom, this.southRoom];
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
            if(roomName === this.southRoomName){
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
            return this.goToRoom(creep.getAssignedRoom().name, creep);
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
        },
        needsEnergy: function(creep, code){
            return creep.carry.energy == 0 || (creep.carry.energy < creep.carryCapacity && code == ERR_NOT_IN_RANGE);
        },
        getClosestEnergyStructure: function(creep, filter=this.returnAllFilter){
            return creep.pos.findClosestByPathUsingCache(FIND_STRUCTURES, {
                filter: function(structure){

                    var isSpawn = structure.structureType === STRUCTURE_SPAWN;
                    var isExtension = structure.structureType === STRUCTURE_EXTENSION;
                    var isStorage = structure.structureType === STRUCTURE_STORAGE;
                    var isContainer = structure.structureType === STRUCTURE_CONTAINER;
                    var isStructure = isSpawn || isExtension || isStorage || isContainer;
                    return isStructure && filter(structure);
                }
            });
        },
        getClosestDroppedEnergy: function(creep, filter=this.returnAllFilter){
            return creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
                filter: filter
            });
        },
        getClosestCreep: function(creep, filter=this.returnAllFilter, opts={}){

            _.defaults(opts, {
                creepTypes: []
            });

            var closestCreep = creep.pos.findClosestByPathUsingCache(FIND_MY_CREEPS, {
                filter: (c) => {
                    return opts.creepTypes.includes(c.memory.role) && filter(c);    
                }
            });

            return closestCreep;
        },
        getClosestSource: function(creep, filter=this.returnAllFilter){
            return creep.pos.findClosestByPathUsingCache(FIND_SOURCES, {
                filter: filter
            });
        },
        getClosestTower: function(creep, filter=this.returnAllFilter){
            return creep.pos.findClosestByPathUsingCache(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return s.structureType === STRUCTURE_TOWER && filter(s);
                }
            });
        },
        getClosestLink: function(creep, filter=this.returnAllFilter){
            return creep.pos.findClosestByPathUsingCache(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return s.structureType === STRUCTURE_LINK && filter(s);
                }
            });
        },
        getBestEnergyRecipient: function(creep, opts = {}){

            _.defaults(opts, {
                maxEnergyRatio: 0.7,
                creepTypes: [],
                allowStructures: true,
                allowStorage: true,
                allowLink: true
            });

            var closestCreep;
            var closestSource;
            var closestDroppedResource;
            var closestStructure;
            var closestTower;
            var isCorrectRoom = (obj) => { return opts.room ? obj.room === opts.room : true }
            var generalRequirements = (possibility) => {

                var currentEnergyKey;
                var potentialEnergyKey;

                if(possibility instanceof StructureStorage || possibility instanceof StructureContainer) {
                    currentEnergyKey = 'store[' + RESOURCE_ENERGY + ']';
                    potentialEnergyKey = 'storeCapacity';
                }else if(possibility instanceof Creep){
                    currentEnergyKey = 'carry[' + RESOURCE_ENERGY + ']';
                    potentialEnergyKey = 'carryCapacity';
                }else{
                    currentEnergyKey = 'energy';
                    potentialEnergyKey = 'energyCapacity';
                }

                var lacksEnoughEnergyForDepositing = _.get(possibility, currentEnergyKey) < _.get(possibility, potentialEnergyKey) * opts.maxEnergyRatio;

                return isCorrectRoom(possibility) && lacksEnoughEnergyForDepositing;
            }

            var structureFilter = (s) => {
                return !opts.allowStorage ? !(s instanceof StructureStorage || s instanceof StructureContainer) && generalRequirements(s) : generalRequirements(s);
            }

            closestStructure = opts.allowStructures ? this.getClosestEnergyStructure(creep, structureFilter) : null;
            closestCreep = this.getClosestCreep(creep, generalRequirements, opts);
            closestTower = opts.allowStructures && opts.allowTowers ? this.getClosestTower(creep, generalRequirements) : null;
            closestLink = opts.allowLink ? this.getClosestLink(creep, generalRequirements) : null;

            var possibilities = _.compact([closestStructure, closestCreep, closestTower, closestLink]);
            var best = creep.pos.findClosestByPathUsingCache(possibilities);


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
                allowHarvesting: false,
                creepTypes: [],
                allowStructures: true
            });

            if(creep.room.status === 'incomplete'){
                return this.getNoEnergySpot(creep);
            }

            var closestCreep;
            var closestSource;
            var closestDroppedResource;
            var closestStructure;
            var isCorrectRoom = (obj) => { return opts.room ? obj.room === opts.room : true }
            var generalRequirements = (possibility) => {

                var currentEnergyKey;
                var potentialEnergyKey;

                if(possibility instanceof StructureStorage || possibility instanceof StructureContainer){
                    currentEnergyKey = 'store[' + RESOURCE_ENERGY + ']';
                    potentialEnergyKey = 'storeCapacity';
                }else if(possibility instanceof Creep){
                    currentEnergyKey = 'carry[' + RESOURCE_ENERGY + ']';
                    potentialEnergyKey = 'carryCapacity';
                }else if(possibility instanceof Resource){
                    //if it's a resource, don't do any calculations
                    return true;
                }else{
                    currentEnergyKey = 'energy';
                    potentialEnergyKey = 'energyCapacity';
                }

                var hasEnoughEnergyForGathering = _.get(possibility, currentEnergyKey) > (_.get(possibility, potentialEnergyKey) * opts.minEnergyRatio);
                return  isCorrectRoom(possibility) && hasEnoughEnergyForGathering;
            }

            closestStructure = opts.allowStructures ? this.getClosestEnergyStructure(creep, generalRequirements) : null;
            closestDroppedResource = this.getClosestDroppedEnergy(creep, generalRequirements);
            closestCreep = this.getClosestCreep(creep, generalRequirements, opts.creepTypes);
            closestSource = opts.allowHarvesting ? this.getClosestSource(creep, generalRequirements): null;
            closestLink = this.getClosestLink(creep, generalRequirements);

            var possibilities = _.compact([closestStructure, closestCreep, closestSource, closestDroppedResource, closestLink]);
            return creep.pos.findClosestByPathUsingCache(possibilities);
        },

        getEnergyFromBestSource: function(creep, opts={}){

            var creepTypes = creep.room.status ? ['carrier', 'harvester'] : ['carrier'];

            _.defaults(opts, {
                minEnergyRatio: 0,
                allowHarvesting: false,//allow them to go harvet on their own
                allowCarrier: false,//allow them to get from a carrier
                allowStructures: creep.room.status === 'complete',
                creepTypes: creepTypes
            });

            var errCode;
            var closestEnergySource = this.getBestEnergySource(creep, opts);

            // console.log('closestEnergySource: ', closestEnergySource);

            if(closestEnergySource instanceof StructureStorage || closestEnergySource instanceof StructureContainer){
                errCode = creep.withdraw(closestEnergySource, RESOURCE_ENERGY);
            }else if(closestEnergySource instanceof Structure){
                errCode = closestEnergySource.transferEnergy(creep);
            }else if(closestEnergySource instanceof Creep){
                errCode = closestEnergySource.transfer(creep);
            }else if(closestEnergySource instanceof Source){
                errCode = creep.harvest(closestEnergySource);
            }else if(closestEnergySource instanceof Resource){
                errCode = creep.pickup(closestEnergySource);
            }

            if(errCode == ERR_NOT_IN_RANGE) {
                creep.moveToUsingCache(closestEnergySource);              
            }

    		return errCode;
        },
        giveEnergyToBestRecipient: function(creep, opts={}){

            _.defaults(opts, {
                creepTypes: ['builder', 'upgrader', 'repairer'],
                allowStructures: false,
                allowStorage: true,
                allowTowers: creep.room.status === 'complete',
                allowLink: creep.room.status === 'complete'
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
        gatherEnergyOr: function(creep, awayFromSourceWork, opts={}){

            var debugMode = false;

            _.defaults(opts, {
                allowHarvesting: false
            });

            var closestEnergySource = this.getBestEnergySource(creep, opts);
            var isCloseToEnergy = false;
            var range = 5;

            if(closestEnergySource){
                isCloseToEnergy = creep.pos.inRangeTo(closestEnergySource, range);
            }

            if(isCloseToEnergy){
                if(creep.carry.energy < (creep.carryCapacity * 0.9)){
                    if(debugMode){console.log('gather 1');}
                    this.getEnergyFromBestSource(creep, opts);
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
                    this.getEnergyFromBestSource(creep, opts);
                }
            }
        },
        depositEnergyOrHarvest(creep, opts={}){

            _.defaults(opts, {
                sourceIndex: 0,
                takeFromStorage: true,
                giveToTowers: false,
                giveToStructures: true,
                giveToStorage: true,
                giveToLink: creep.room.status === 'complete'
            });

            var storageWithEnergy = this.getClosestStorageWithEnergy(creep);
            opts.takeFromStorage = creep.room.status === 'incomplete' && opts.takeFromStorage && storageWithEnergy;
            opts.giveToStorage = creep.room.status === 'complete' && opts.giveToStorage;

            var debugMode = false;
            var closestEnergyRecipient = this.getBestEnergyRecipient(creep, {
                allowStructures: opts.giveToStructures,
                allowTowers: opts.giveToTowers,
                allowStorage:   opts.giveToStorage,
                allowLink: opts.giveToLink,
                maxEnergyRatio: 0.9 
            });
            var source = creep.room.find(FIND_SOURCES)[opts.sourceIndex];
            var recipientIsCloserThanSource = false;

            if(closestEnergyRecipient && source){
                recipientIsCloserThanSource = creep.pos.findClosestByPathUsingCache([closestEnergyRecipient, source]) === closestEnergyRecipient;
            }

            // if(creep.name === 'harvester3(E77S47)'){
            //     console.log('closestEnergyRecipient: ', closestEnergyRecipient);
            //     console.log('source.pos: ', source.pos);
            //     console.log('recipientIsCloserThanSource: ', recipientIsCloserThanSource);
            // }

            if(recipientIsCloserThanSource){
                if(creep.carry.energy > (creep.carryCapacity * 0.1)){
                    if(debugMode){console.log('deposit 2');}
                    this.giveEnergyToRecipient(creep, closestEnergyRecipient);
                }else{
                    if(debugMode){console.log('gather 2');}
                    this.harvestFromSourceOrStorage(creep, opts);
                }
            }else{
                if(creep.carry.energy < (creep.carryCapacity * 0.9)){
                    if(debugMode){console.log('gather 1');}
                    this.harvestFromSourceOrStorage(creep, opts);
                }else{
                    if(debugMode){console.log('deposit 1');}
                    this.giveEnergyToRecipient(creep, closestEnergyRecipient);
                }
            }
        },
        harvestFromSourceOrStorage: function(creep, opts){
            if(opts.takeFromStorage){
                this.getEnergyFromStorage(creep);
            }else{
                this.harvest(creep, opts);
            }
        },
        harvest(creep, opts){
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
        }
    }   
}