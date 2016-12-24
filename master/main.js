myGlobal = {
    cacheHits: 0,
    cacheMisses: 0
};

var harvester = require('harvester')
var harvesterTwo = require('HarvesterTwo')
var upgrader = require('Upgrader')
var dedicatedUpgrader = require('DedicatedUpgrader')
var guard = require('Guard')
var healer = require('Healer')
var builder = require('Builder')
var spawner = require('Spawner')
var repairer = require('Repairer')
var dedicatedHarvester = require('DedicatedHarvester')
var carrier = require('Carrier')
var Tracker = require('Tracker');
var util = require('util');
var tower = require('Tower');
var Guard = require('Guard');
var ConstructionManager = require('ConstructionManager');
var MeleeAttacker = require('MeleeAttacker');
var Demoman = require('Demoman');
var Claimer = require('Claimer');

var useTracker = false;
var seeCPU = false;
var debugMode = false;
var throttleRatio = 0;//0 - never throttle, 1 - throttle 100%


module.exports.loop = function () {


    PathFinder.use(false);
        
    console.log();
    console.log("--------- Creep Report - new tick -------------");


    // if(_.random(1, 10) <= throttleRatio*10){
    //     console.log('SAVING CPU');
    //     return;
    // }

    if(seeCPU){ util().printCPU(() => { console.log('main.js::59 :: '); }); }   


    spawner();

    //we could do this even less, but for now throttle it so it only happens on average every 100 ticks
    if(_.random(1, 100) === 1){
        var constructionManager = new ConstructionManager();
        constructionManager.doWork();    
    }   

    //every n ticks, clear the paths hash
    if(_.random(1, 500) === 1){
        delete Memory.pathsHash;
    }

    //ROOMS
    //for each room, activate safe mode if someone comes in, except Invaders
    util().getAllRooms().forEach(room => {
        var hostiles = util().findHostiles(room, {
            usersToIgnore: [
                util().milesUsername,
                'Invader'
            ]
        });

        if(hostiles.length){
            Game.notify('ACTIVATING SAFE MODE');
            room.controller.activateSafeMode();
        }
    });

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

    //LINKS
    var westLink = Game.structures['585b6ab33962b71d57030d66'];
    var eastLink = Game.structures['585b75504b207b74496d64b5'];
    var southLink = Game.structures['585cc390713f5c3c7a62662b'];
    if(_.random(0, 1) === 1){
        westLink.transferEnergy(eastLink);
    }else{
        westLink.transferEnergy(southLink);
    }

    //NORTH ROOM LINKS
    var fromLink = Game.structures['585dc5f78d7270785de7f890'];
    var toLink1 = Game.structures['585dcc14d79a7fc4614ee0c0'];
    var toLink2 = Game.structures['585dd6639d25db137ae10956'];
    if(_.random(0, 1) === 1){
        fromLink.transferEnergy(toLink1);
    }else{
        fromLink.transferEnergy(toLink2);
    }


    //CREEPS
    var tempCpuUsed = Game.cpu.getUsed();
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

        //generic creep actions
        // if(creep.room.name === util().milesRoomName){
        //     console.log('MILES ROOM creep.name: ', creep.name);
        //     util().goToRoom(util.southRoomName, creep);
        //     continue;
        // }

        if(util().runFromInvader(creep)){
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

        if(creep.memory.role == 'claimer') {
            Claimer(creep);
        }

        if(creep.memory.role == 'repairer') {
	        repairer(creep);
        }

        if(creep.memory.role == 'guard') {
            var guard = new Guard(creep);
            guard.doWork();
        }

        if(creep.memory.role == 'meleeAttacker') {
            var meleeAttacker = new MeleeAttacker(creep);
            meleeAttacker.doWork();
        }

        if(creep.memory.role == 'demoman') {
            var demoman = new Demoman(creep);
            demoman.doWork();
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
	   
    var tracker = new Tracker();
    tracker.track({
        currentCpu: true,
        averageCpu: true,
        gclToNextLevel: true,
        averageGcl: true,
        upgradeToNextLevel: true,
        averageUpgrade: true,
        averageSourceDepletionRatio: true,
        cachePercent: true,
        averageSecondsPerTick: true
    });
}

Creep.prototype.getName = function(){
    return this.name;
}

Creep.prototype.getAssignedRoom = function(){
    return Game.rooms[this.memory.assignedRoom] || util().southRoom;
}

Creep.prototype.moveToUsingCache = function(target){

    var validErrCodes = [ERR_NOT_FOUND, ERR_NO_PATH];
    var path = util().getPath(this, target);
    var errCode = this.moveByPath(path);
    var obstacles = path[0] ? this.room.lookAt(path[0].x, path[0].y) : [];
    var creepIsInTheWay = Boolean(obstacles.find(o => o.type === 'creep'));

    //if the path doesn't work for some reason, just calculate it without the cache
    if(_.contains(validErrCodes, errCode) || creepIsInTheWay){
        path = util().getPath(this, target, {useCache: false});
        this.moveByPath(path);
    }

    // if(this.name === 'harvester3(E77S47)'){
    //  console.log('this: ', this);
    //  // console.log('path[0]: ', path[0]);
    //  util().printObject(path[0]);   
    //  // console.log('Room.deserializePath(path): ', Room.deserializePath(path).length);
    //  console.log('target: ', target);
    //  console.log('target.energy: ', target.energy);
    //  console.log('target.pos: ', target.pos);
    //  console.log('errCode: ', errCode);
    //  console.log('target.id: ', target.id);
    // }

    return errCode;
}

RoomPosition.prototype.findClosestByPathUsingCache = function(typeOrArray, opts={}){

    var bufferAmount = 0;

    //take care of two method types
    var objects;
    var type;
    if(_.isArray(typeOrArray)){
        objects = typeOrArray;
    }else{
        type = typeOrArray;
        objects = this.getRoom().find(typeOrArray, opts);
    }

    var objectPathPairs = [];
    objects.forEach(object => {
        var path = util().getPath(this, object);
        objectPathPairs.push({
            object: object,
            path: path
        });
    });

    if(objectPathPairs.length){

        //the thing that happens is this:
        //it will find that A is equal to B.  But sometimes A will be the "closest" and sometimes B will be the "closest"
        //if we always return the first alphabetically in those cases, it will be deterministic

        //get the closest
        var min = _.min(objectPathPairs, 'path.length');

        //gather the ones that are within 3 steps of each other
        var closeToMin = objectPathPairs.filter(opp => opp.path.length - min.path.length <= bufferAmount);

        //if they are that close, just pick the first one (BY ALPHABETICAL ORDER), so we deterministically always pick the same one
        var possibleTargets = closeToMin
        _.sortBy(possibleTargets, 'id');

        return possibleTargets[0].object;
    }else{
        return null;
    }
}

RoomPosition.prototype.getRoom = function(){
    return Game.rooms[this.roomName];
}

Room.prototype.getSafeAreaFromInvaders = function(){
    if(this === util().northRoom){
        return new RoomPosition(6, 24, this.name);
    }else if(this === util().southRoom){
        return new RoomPosition(21, 19, this.name);
    }
}

Source.prototype.getFriendlyName = function(){
    switch(this.id){
        case '5836b91a8b8b9619519f334c':
            return 'South - Right Side'
        case '5836b91a8b8b9619519f334b':
            return 'South - Left Side'
        case '5836b91a8b8b9619519f3347':
            return 'North - North Side'
        case '5836b91a8b8b9619519f3346':
            return 'North - South Side'
        case '5836b91a8b8b9619519f333f':
            return 'Far North - North Side'
        case '5836b91a8b8b9619519f3340':
            return 'Far North - South Side'
    }
}