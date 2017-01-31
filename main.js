myGlobal = {
    cacheHits: 0,
    cacheMisses: 0,
    emailReport: '',
};

var Tracker = require('Tracker');
var ThrottleService = require('ThrottleService');
var util = require('util');
var ConstructionManager = require('ConstructionManager');
var E57N86RoomController = require('E57N86RoomController');

var UnitTester = require('UnitTester');

var useTracker = false;
var seeCPU = false;
var debugMode = false;

module.exports.loop = function () {
 
    console.log();
    console.log("--------- Creep Report - new tick -------------");

    PathFinder.use(false);

    ThrottleService.adjustThrottleRatio();

    runRooms();

    // runConstructionManager();

    clearPathsHash();

    clearDeadCreepsFromMemory();

    doTracking();

    // sendEmailReport();

    // runTests();
}

function runRooms(){
    var roomControllers = [
        new E57N86RoomController()
    ];

    roomControllers.forEach(rc => {
        //for now, throttle each room (unless it is under attack)
        if(ThrottleService.shouldThrottleRoom() && !rc.roomIsUnderAttack()){
            rc.runRoom({throttle: true});
        }else{
            rc.runRoom({throttle: false});
        }
    });
}

function runConstructionManager(){
    //we could do this even less, but for now throttle it so it only happens on average every 100 ticks
    if(_.random(1, 100) === 1){
        var constructionManager = new ConstructionManager();
        constructionManager.doWork();    
    }   
}

function clearPathsHash(){
    //every n ticks, clear the paths hash
    if(_.random(1, 500) === 1){
        delete Memory.pathsHash;
    }
}

function clearDeadCreepsFromMemory(){
    if(_.random(1, 500) === 1){
        _.forOwn(Memory.creeps, function(creep, creepName) {
            if(!Game.creeps[creepName]){
                delete Memory.creeps[creepName];
            }
        });
    }
}

function doTracking(){
    var tracker = new Tracker();
    tracker.track({
        currentCpu: true,
        averageCpu: true,
        // gclToNextLevel: true,
        averageGcl: true,
        upgradeToNextLevel: true,
        averageUpgrade: true,
        averageSourceDepletionRatio: true,
        // cachePercent: true,
        // averageSecondsPerTick: true,
        throttleRatio: true
    });
}

function sendEmailReport(){
    if(_.isUndefined(Memory.emailReportTicks)){
        Memory.emailReportTicks = 0;
    }

    if(Memory.emailReportTicks >= 600){
        Game.notify(myGlobal.emailReport)
        // console.log('myGlobal.emailReport: ', myGlobal.emailReport);
        Memory.emailReportTicks = 0;
    }else{
        Memory.emailReportTicks++;
    }
}

function runTests(){
    console.log();
    var unitTester = new UnitTester();
    unitTester.runTests();
}





//
//  PROTOTYPE FUNCTIONS
//
//

Creep.prototype.getBfSimpleName = function(){
    var lastChar = this.name[this.name.length - 1];

    if(lastChar === 'A' || lastChar === 'B'){
        return this.name.slice(0, this.name.length - 1);
    }else{
        return this.name;
    }
}

Creep.prototype.getBfFullName = function(){
    return this.name;
}

Creep.prototype.getAssignedRoom = function(){
    return Game.rooms[this.memory.assignedRoom] || util.southRoom;
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

    var path = util.getPath(start, end);
    var validErrCodes = [ERR_NOT_FOUND, ERR_NO_PATH];
    var errCode = this.moveByPath(path);
    var obstacles = path[0] ? this.room.lookAt(path[0].x, path[0].y) : [];
    var creepIsInTheWay = Boolean(obstacles.find(o => o.type === 'creep'));

    //if the path doesn't work for some reason, just calculate it without the cache
    if(_.contains(validErrCodes, errCode) || creepIsInTheWay){
        path = util.getPath(this, target, {useCache: false});
        var code = this.moveByPath(path);

        //if we still can't find the path (like we are stuck or something between creeps)
        //move in random direction until we get unstuck
        if(code === ERR_NOT_FOUND){
            this.moveInRandomDirection();
        }
    }

    if(seeCPU){
        console.log('this.name: ', this.name);
        console.log('CPU used: ' + _.round(Game.cpu.getUsed() - tempCpuUsed, 2));
        tempCpuUsed = Game.cpu.getUsed();
    }

    return errCode;
}

Creep.prototype.moveInRandomDirection = function(){
    var directions = util.getDirections();
    var randomDirection = _.sample(directions)
    return this.move(randomDirection);
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
        var path = util.getPath(this, object);
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
//     if(this === util.northRoom){
//         return new RoomPosition(6, 24, this.name);
//     }else if(this === util.southRoom){
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