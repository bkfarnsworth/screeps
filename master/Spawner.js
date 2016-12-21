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
        { name: 'backUpHarvester',    role: 'backUpHarvester',    config: {condition: getNumberOfHarvesters('north') === 0, stopOperation: true}},
        { name: 'harvester1',         role: 'harvester',          config: {stopOperation: true}},
        { name: 'harvesterTwo1',      role: 'harvesterTwo',       config: {stopOperation: true}},
        { name: 'harvester2',         role: 'harvester',          config: {stopOperation: true}},
        { name: 'harvesterTwo2',      role: 'harvesterTwo',       config: {stopOperation: true}},
        { name: 'guard1',             role: 'guard' },
        { name: 'upgrader1',          role: 'upgrader', },
        { name: 'builder1',           role: 'builder',            config: {condition: northConstructionSites.length > 0}},
        { name: 'carrier1',           role: 'carrier', },
        { name: 'upgrader2',          role: 'upgrader', },
        { name: 'builder2',           role: 'builder',            config: {condition: northConstructionSites.length > 0}},
        { name: 'upgrader2',          role: 'upgrader', },
        { name: 'builder3',           role: 'builder',            config: {condition: northConstructionSites.length > 0}},
        { name: 'upgrader3',          role: 'upgrader',           config: {condition: northConstructionSites.length === 0}},
        { name: 'upgrader4',          role: 'upgrader',           config: {condition: northConstructionSites.length === 0}}
    ]

    var southRoomCreepTypes = [ 
        { name: 'backUpHarvester',    role: 'backUpHarvester',    config: {condition: getNumberOfHarvesters('south') === 0, stopOperation: true}},
        { name: 'harvester1',         role: 'harvester',          config: {stopOperation: true}},
        { name: 'harvester2',         role: 'harvester',          config: {stopOperation: true}},
        { name: 'harvester3',         role: 'harvester',          config: {stopOperation: true}},
        { name: 'superHarvesterTwo',  role: 'superHarvesterTwo',  config: {stopOperation: true}},
        { name: 'guard1',             role: 'guard'},
        // { name: 'melee1',          role: 'meleeAttacker'}, 
        { name: 'upgrader1',          role: 'upgrader'},
        { name: 'builder1',           role: 'builder',            config: {condition: southConstructionSites.length > 0}},
        { name: 'carrier1',           role: 'carrier'}, 
        { name: 'upgrader2',          role: 'upgrader'}, 
        { name: 'builder2',           role: 'builder',            config: {condition: southConstructionSites.length > 0}},
        { name: 'upgrader2',          role: 'upgrader'}, 
        { name: 'builder3',           role: 'builder',            config: {condition: southConstructionSites.length > 0}},
        { name: 'upgrader3',          role: 'upgrader',           config: {condition: southConstructionSites.length === 0}},
        { name: 'upgrader4',          role: 'upgrader',           config: {condition: southConstructionSites.length === 0}},
    ];



    northRoomCreepTypes = northRoomCreepTypes.map(ct => {
        var creepType = CreepType.factory(ct.name, ct.role, util().northRoom, ct.config);
        creepType.assignedRoom = util().northRoomName;
        return creepType;
    });

    southRoomCreepTypes = southRoomCreepTypes.map(ct => {
        var creepType = CreepType.factory(ct.name, ct.role, util().southRoom, ct.config);
        creepType.assignedRoom = util().southRoomName;
        return creepType;
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
            room.forEach((creepType, index) => {
                var printedSpawningCreep = false;//just keep track and mark the next highest priority as spawning

                if(creepType.needsSpawning() && creepType.condition){
                    if(spawn.spawning && !printedSpawningCreep){
                        util().printWithSpacing(creepType.role + ': Spawning (' + creepType.getEnergyRequired() + ')');
                    }else{
                        util().printWithSpacing(creepType.role + ': Queued (' + creepType.getEnergyRequired() + ')');
                    }
                }else if(!creepType.condition){
                    util().printWithSpacing(creepType.role + ': Condition not met (' + creepType.getEnergyRequired() + ')');
                }else if(!creepType.needsSpawning()){
                    var timeToDeath = creepType.getMatchingCreeps()[0].ticksToLive;
                    util().printWithSpacing(creepType.role + ': ' + timeToDeath + ' (' + creepType.getEnergyRequired() + ')');
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

