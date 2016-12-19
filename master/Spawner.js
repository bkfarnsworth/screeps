var util = require('util');
var CreepType = require('CreepType');

module.exports = function () {
        
    var printQueue = true;

    var northConstructionSites = util().northRoom.find(FIND_MY_CONSTRUCTION_SITES);
    var southConstructionSites = util().southRoom.find(FIND_MY_CONSTRUCTION_SITES);

    // if(numberOfHarvesters === 0){
    //     Game.notify('NO HARVESTERS', 60);
    // }


    var northRoomCreepTypes = [
        CreepType.factory('backUpHarvester', 'backUpHarvester', util().northRoom, {condition: getNumberOfHarvesters('north') === 0, stopOperation: true}),
        CreepType.factory('harvester1', 'harvester', util().northRoom, {stopOperation: true}),
        CreepType.factory('harvesterTwo1', 'harvesterTwo', util().northRoom, {stopOperation: true}),
        CreepType.factory('harvester2', 'harvester', util().northRoom, {stopOperation: true}),
        CreepType.factory('harvesterTwo2', 'harvesterTwo', util().northRoom, {stopOperation: true}),
        CreepType.factory('guard1', 'guard', util().northRoom),
        CreepType.factory('upgrader1', 'upgrader', util().northRoom),
        CreepType.factory('builder1', 'builder', util().northRoom, {condition: northConstructionSites.length > 0}),
        CreepType.factory('carrier1', 'carrier', util().northRoom),
        CreepType.factory('upgrader2', 'upgrader', util().northRoom),
        CreepType.factory('builder2', 'builder', util().northRoom, {condition: northConstructionSites.length > 0}),
        CreepType.factory('upgrader2', 'upgrader', util().northRoom),
        CreepType.factory('builder3', 'builder', util().northRoom, {condition: northConstructionSites.length > 0}),
        CreepType.factory('upgrader3', 'upgrader', util().northRoom, {condition: northConstructionSites.length === 0}),
        CreepType.factory('upgrader4', 'upgrader', util().northRoom, {condition: northConstructionSites.length === 0}),
    ]

    var southRoomCreepTypes = [
        CreepType.factory('backUpHarvester', 'backUpHarvester', util().northRoom, {condition: getNumberOfHarvesters('south') === 0, stopOperation: true}),
        CreepType.factory('harvester1', 'harvester', util().southRoom, {stopOperation: true}),
        CreepType.factory('harvester2', 'harvester', util().southRoom, {stopOperation: true}),
        CreepType.factory('harvester3', 'harvester', util().southRoom, {stopOperation: true}),
        CreepType.factory('superHarvesterTwo', 'superHarvesterTwo', util().southRoom, {stopOperation: true}),
        CreepType.factory('guard1', 'guard', util().southRoom),
        CreepType.factory('upgrader1', 'upgrader', util().southRoom),
        CreepType.factory('builder1', 'builder', util().southRoom, {condition: southConstructionSites.length > 0}),
        CreepType.factory('carrier1', 'carrier', util().southRoom),
        CreepType.factory('upgrader2', 'upgrader', util().southRoom),
        CreepType.factory('builder2', 'builder', util().southRoom, {condition: southConstructionSites.length > 0}),
        CreepType.factory('upgrader2', 'upgrader', util().southRoom),
        CreepType.factory('builder3', 'builder', util().southRoom, {condition: southConstructionSites.length > 0}),
        CreepType.factory('upgrader3', 'upgrader', util().southRoom, {condition: southConstructionSites.length === 0}),
        CreepType.factory('upgrader4', 'upgrader', util().southRoom, {condition: southConstructionSites.length === 0}),
    ];



    northRoomCreepTypes.forEach((ct, priority) => {
        ct.assignedRoom = util().northRoomName;
        ct.priority = priority;
    });

    southRoomCreepTypes.forEach((ct, priority) => {
        ct.assignedRoom = util().southRoomName;
        ct.priority = priority;
    });

    [northRoomCreepTypes, southRoomCreepTypes].forEach((room, i) => {
        console.log();
        console.log('Room: ', i === 0 ? 'North Room' : 'South Room');

        var spawn = util().getSpawnForRoom(room[0].assignedRoom);
        var actualRoom = i === 0 ? util().northRoom : util().southRoom;
        var creepsThatNeedSpawning = room.filter(creepType => creepType.needsSpawning());

        //assume it's sorted by priority

        //spawn the top priority one, else if spawning, do the next highest one
        var creepToSpawn;
        if(spawn.spawning){
            creepToSpawn = creepsThatNeedSpawning[1];
        }else{
            creepToSpawn = creepsThatNeedSpawning[0];
        }

        if(creepToSpawn && creepToSpawn.stopOperation){
            actualRoom.status = 'incomplete';
        }else{
            actualRoom.status = 'complete';
        }

        spawnCreep(creepToSpawn);

        if(printQueue){
            room.forEach(creepType => {
                if(creepType.needsSpawning() && creepType.condition){
                    util().printWithSpacing(creepType.role + ': Queued (' + creepType.getEnergyRequired() + ')');
                }else if(!creepType.condition){
                    util().printWithSpacing(creepType.role + ': Condition not met (' + creepType.getEnergyRequired() + ')');
                }else if(!creepType.needsSpawning()){
                    var timeToDeath = creepType.getMatchingCreeps()[0].ticksToLive;
                    util().printWithSpacing(creepType.role + ': ' + timeToDeath + ' (' + creepType.getEnergyRequired() + ')');
                }else{
                    util().printWithSpacing(creepType.role + ': Spawning (' + creepType.getEnergyRequired() + ')');
                }
            });
        }

        console.log('STATUS: ' + actualRoom.status);

        util().printEnergy(actualRoom);
    });

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

function spawnCreep(creepTypeToSpawn){
    if(creepTypeToSpawn){
        console.log('Next creep to be spawned: ', creepTypeToSpawn.role);
    }else{
        console.log('All Screeps are spawned!');
        return;
    }

    var creepName = creepTypeToSpawn.name;
    var energyRequired = creepTypeToSpawn.getEnergyRequired();
    var memoryOpts = {
        role: creepTypeToSpawn.role,
        assignedRoom: creepTypeToSpawn.assignedRoom
    }

    var assignedSpawn = util().getSpawnForRoom(creepTypeToSpawn.assignedRoom);

    var errCode = assignedSpawn.createCreep(creepTypeToSpawn.bodyParts, creepName, memoryOpts);

    if(errCode === ERR_NAME_EXISTS){
        //then delete it from memory
        delete Memory.creeps[creepName];
    }
} 

