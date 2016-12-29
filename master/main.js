myGlobal = {
    cacheHits: 0,
    cacheMisses: 0
};

var Tracker = require('Tracker');
var util = require('util');
var tower = require('Tower');
var ConstructionManager = require('ConstructionManager');
var E77S47RoomController = require('E77S47RoomController')
var E77S46RoomController = require('E77S46RoomController')
var E77S44RoomController = require('E77S44RoomController')

var useTracker = false;
var seeCPU = false;
var debugMode = false;
var throttleRatio = 0;//0 - never throttle, 1 - throttle 100%

module.exports.loop = function () {
 


    console.log();
    console.log("--------- Creep Report - new tick -------------");

    if(_.random(1, 10) <= throttleRatio*10){
        console.log('SAVING CPU');
        return;
    }


    PathFinder.use(false);

    var roomControllers = [
        new E77S44RoomController(),
        new E77S46RoomController(),
        new E77S47RoomController()
    ];

    roomControllers.forEach(rc => {
        rc.runRoom();
    });

    //we could do this even less, but for now throttle it so it only happens on average every 100 ticks
    if(_.random(1, 100) === 1){
        var constructionManager = new ConstructionManager();
        constructionManager.doWork();    
    }   

    //every n ticks, clear the paths hash
    // if(_.random(1, 500) === 1){
        // delete Memory.pathsHash;
    // }

    runTowers();

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

function runTowers(){
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
}

Creep.prototype.getName = function(){
    return this.name;
}

Creep.prototype.getAssignedRoom = function(){
    return Game.rooms[this.memory.assignedRoom] || util().southRoom;
}
    
//REASONS FOR DOING ALL THIS CRAZY CACHING STUFF
//I don't have to provide arbitrary times to clear the cache
//I can compare paths more efficiently
Creep.prototype.moveToUsingCache = function(target){

    var seeCPU = false;
    var tempCpuUsed = Game.cpu.getUsed();   
    var start, end;

    //have to convert to position
    if(!(target instanceof RoomPosition)){
        target = target.pos;
    }

    // delete this.memory._bfMove;

    //get the cached end position if there is one
    var cachedEndPosition, cachedStartPosition;
    if(this.memory._bfMove){
        cachedStartPosition = RoomPosition.create(this.memory._bfMove.start);
        cachedEndPosition   = RoomPosition.create(this.memory._bfMove.end);
    }

    //if there is one, and the target equals that cached position, reuse the cached path
    if(cachedEndPosition && target.isEqualTo(cachedEndPosition)){

        //use the cached start pos to look up a path in the cache
        start = cachedEndPosition;
        end = cachedEndPosition;

    //if the target doesn't match, it means the target has changed and we can no longer use the cached start and end to get a path.  Bust the cache on the creep and look up a new path from the path cache
    }else{

        //use the current position as the start, and the target as the end, and cache them
        start = this.pos;
        end = target;
        this.memory._bfMove = {start, end};
    }

    var path = util().getPath(start, end);
    var validErrCodes = [ERR_NOT_FOUND, ERR_NO_PATH];
    var errCode = this.moveByPath(path);
    var obstacles = path[0] ? this.room.lookAt(path[0].x, path[0].y) : [];
    var creepIsInTheWay = Boolean(obstacles.find(o => o.type === 'creep'));

    //if the path doesn't work for some reason, just calculate it without the cache
    if(_.contains(validErrCodes, errCode) || creepIsInTheWay){
        path = util().getPath(this, target, {useCache: false});
        this.moveByPath(path);
    }

    if(seeCPU){
        console.log('this.name: ', this.name);
        console.log('CPU used: ' + _.round(Game.cpu.getUsed() - tempCpuUsed, 2));
        tempCpuUsed = Game.cpu.getUsed();
    }

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

RoomPosition.create = (opts) => {
    return new RoomPosition(opts.x, opts.y, opts.roomName);
}

// Room.prototype.getSafeAreaFromInvaders = function(){
//     if(this === util().northRoom){
//         return new RoomPosition(6, 24, this.name);
//     }else if(this === util().southRoom){
//         return new RoomPosition(21, 19, this.name);
//     }else{
//         console.log('main.js::172 :: ');
//     }
// }

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