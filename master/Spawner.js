var util = require('util');

module.exports = function () {
        
    var printQueue = true;

    var status = "complete";

    var northConstructionSites = util().northRoom.find(FIND_MY_CONSTRUCTION_SITES);
    var southConstructionSites = util().southRoom.find(FIND_MY_CONSTRUCTION_SITES);

    // if(numberOfHarvesters === 0){
    //     Game.notify('NO HARVESTERS', 60);
    // }

    var northRoomCreepTypes = [
        getCreepType('backUpHarvester', {condition: getNumberOfHarvesters('north') === 0, stopOperation: true}),
        getCreepType('harvester', {stopOperation: true}),
        getCreepType('harvesterTwo', {stopOperation: true}),
        getCreepType('harvester', {stopOperation: true}),
        getCreepType('harvesterTwo', {stopOperation: true}),
        getCreepType('upgrader'),
        getCreepType('builder', {condition: northConstructionSites.length > 0}),
        getCreepType('carrier'),
        getCreepType('upgrader'),
        getCreepType('builder', {condition: northConstructionSites.length > 0}),
        getCreepType('carrier'),
        getCreepType('upgrader'),
        getCreepType('builder', {condition: northConstructionSites.length > 0}),
        getCreepType('carrier'),
    ]

    var southRoomCreepTypes = [
        getCreepType('backUpHarvester', {condition: getNumberOfHarvesters('south') === 0, stopOperation: true}),
        getCreepType('harvester', {stopOperation: true}),
        getCreepType('harvester', {stopOperation: true}),
        getCreepType('harvesterTwo', {stopOperation: true}),
        getCreepType('harvester', {stopOperation: true}),
        getCreepType('upgrader'),
        getCreepType('builder', {condition: southConstructionSites.length > 0}),
        getCreepType('carrier'),
        getCreepType('upgrader'),
        getCreepType('builder', {condition: southConstructionSites.length > 0}),
        getCreepType('carrier'),
        getCreepType('upgrader'),
        getCreepType('builder', {condition: southConstructionSites.length > 0}),
        getCreepType('carrier'),
    ];


    northRoomCreepTypes.forEach((ct, priority) => {
        ct.assignedRoom = util().northRoomName;
        ct.priority = priority;
    });

    southRoomCreepTypes.forEach((ct, priority) => {
        ct.assignedRoom = util().southRoomName;
        ct.priority = priority;
    });

    var creepToSpawn;
    [northRoomCreepTypes, southRoomCreepTypes].forEach((room, i) => {
        console.log();
        console.log('Room: ', i === 0 ? 'North Room' : 'South Room');

        room.forEach(creepType => {
            var roleFilterObj = {
                filter: function(creep) {
                    return creep.memory.role == creepType.role 
                    && creep.memory.assignedRoom === creepType.assignedRoom
                    && creep.memory.priority === creepType.priority;
                }
            }

            var creeps = util().findInAllRooms(FIND_MY_CREEPS, roleFilterObj);

            if(!creeps.length && creepType.condition){
                if(!creepToSpawn || creepType.priority < creepToSpawn.priority){
                    creepToSpawn = creepType;
                }
                if(creepType.stopOperation){
                    status = 'incomplete';
                }
            }

            if(printQueue){
                if(!creeps.length && creepType.condition){
                    util().printWithSpacing(creepType.role + ': Queued (' + creepType.getEnergyRequired() + ')');
                }else if(!creeps.length){
                    util().printWithSpacing(creepType.role + ': Condition not met (' + creepType.getEnergyRequired() + ')');
                }else if(creeps.length){
                    var timeToDeath = creeps[0].ticksToLive;
                    util().printWithSpacing(creepType.role + ': ' + timeToDeath + ' (' + creepType.getEnergyRequired() + ')');
                }
            }
        });
    });

    spawnCreep(creepToSpawn);

    console.log('STATUS: ' + status);
    
    return status;
}   

function getNumberOfHarvesters(roomDirection){
    var room;
    if(roomDirection === 'north'){
        room = util().northRoom;
    }else if(roomDirection === 'south'){
        room = util().southRoom;
    }

    return room.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            return creep.memory.role == 'harvester';
        }
    }).length;
}

function getCreepType(type, opts={}){

    _.defaults(opts, {
        condition: true,
        stopOperation: false
    });

    var creepType = new CreepType({
        condition: opts.condition,
        stopOperation: opts.stopOperation
    });

    switch(type){
        case 'backUpHarvester':
            creepType.role = 'harvester';
            creepType.bodyParts = [WORK,CARRY,MOVE];
            break;
        case 'harvester': 
            creepType.role = 'harvester';
            creepType.bodyParts = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
            break;
        case 'harvesterTwo': 
            creepType.role = 'harvesterTwo';
            creepType.bodyParts = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
            break;
        case 'carrier': 
            creepType.role = 'carrier';
            creepType.bodyParts = [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
            break;
        case 'upgrader': 
            creepType.role = 'upgrader';
            creepType.bodyParts = [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
            break;
        case 'builder': 
            creepType.role = 'builder';
            creepType.bodyParts = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
            break;
    }

    return creepType;
}

function spawnCreep(creepTypeToSpawn){
    console.log('Next creep to be spawned: ', creepTypeToSpawn.role);
    var nowString = Date.now().toString();
    var creepName = creepTypeToSpawn.role + nowString.substr(nowString.length - 4);
    var energyRequired = creepTypeToSpawn.getEnergyRequired();
    var memoryOpts = {
        role: creepTypeToSpawn.role,
        assignedRoom: creepTypeToSpawn.assignedRoom,
        priority: creepTypeToSpawn.priority
    }

    var assignedSpawn = util().getSpawnForRoom(creepTypeToSpawn.assignedRoom);

    var errCode = assignedSpawn.createCreep(creepTypeToSpawn.bodyParts, creepName, memoryOpts);
        
    if(errCode === ERR_NOT_ENOUGH_ENERGY){
        errCode = Game.spawns.Spawn1.createCreep(creepTypeToSpawn.bodyParts, creepName, memoryOpts);
    }

    if(errCode === ERR_NOT_ENOUGH_ENERGY){
        errCode = Game.spawns.Spawn2.createCreep(creepTypeToSpawn.bodyParts, creepName, memoryOpts);
    }
} 

function CreepType(opts){
    this.creepTypeId = opts.creepTypeId;
    this.role = opts.role;
    this.bodyParts = opts.bodyParts;
    this.min = opts.min;
    this.priority = opts.priority;
    this.assignedRoom = opts.assignedRoom;
    this.condition = opts.condition;
    this.stopOperation = opts.stopOperation;
    return this;
}

CreepType.prototype.getEnergyRequired = function() {
    var bodyPartEnergyMap = util().bodyPartEnergyMap;
    return _.sum(this.bodyParts.map(bp => bodyPartEnergyMap[bp.toString().toUpperCase()]));
};
