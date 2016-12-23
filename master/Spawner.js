var util = require('util');
var CreepType = require('CreepType');

module.exports = function () {
        
    var printQueue = true;

    var farNorthConstructionSites = util().farNorthRoom.find(FIND_MY_CONSTRUCTION_SITES);
    var northConstructionSites = util().northRoom.find(FIND_MY_CONSTRUCTION_SITES);
    var southConstructionSites = util().southRoom.find(FIND_MY_CONSTRUCTION_SITES);

    // if(numberOfHarvesters === 0){
    //     Game.notify('NO HARVESTERS', 60);
    // }

    //farNorthRoom
    var farNorthUpgraderBodyParts     = [WORK,CARRY,MOVE];
    var farNorthBuilderBodyParts      = [WORK,CARRY,MOVE];
    var farNorthHarvesterBodyParts      = [WORK,CARRY,MOVE];

    //north and south rooms
    var backUpHarvesterBodyParts      = [WORK,CARRY,MOVE];
    var guardBodyParts                = [MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,TOUGH,TOUGH];
    var demomanBodyParts              = [TOUGH,TOUGH,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK];
    var meleeAttackerBodyParts        = [MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,TOUGH,TOUGH];
    var claimerBodyParts              = [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,HEAL];
    var harvesterBodyParts            = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
    var harvesterTwoBodyParts         = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
    var superHarvesterTwoBodyParts    = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
    var carrierBodyParts              = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    var upgraderBodyParts             = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
    var builderBodyParts              = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];

    var farNorthRoom = {
        room: util().farNorthRoom,
        creepTypes: [ 
            { 
                name: 'harvester1',
                role: 'harvester',           
                stopOperation: true,
                bodyParts: farNorthHarvesterBodyParts
            },
            { 
                name: 'upgrader1',
                role: 'upgrader',           
                stopOperation: true,
                bodyParts: farNorthUpgraderBodyParts
            },
            { 
                name: 'builder1',
                role: 'builder',            
                condition: farNorthConstructionSites.length > 0,
                bodyParts: farNorthBuilderBodyParts
            }
        ]
    };

    var northRoom = {
        room: util().northRoom,
        creepTypes: [
            { 
                name: 'backUpHarvester',    
                role: 'harvester',    
                condition: getNumberOfHarvesters('north') === 0,
                stopOperation: true,
                bodyParts: backUpHarvesterBodyParts
            },
            { 
                name: 'harvester1',
                role: 'harvester',          
                stopOperation: true,
                bodyParts: harvesterBodyParts
            },
            { 
                name: 'harvesterTwo1',
                role: 'harvesterTwo',       
                stopOperation: true,
                bodyParts: harvesterBodyParts
            },
            { 
                name: 'harvester2',
                role: 'harvester',          
                stopOperation: true,
                bodyParts: harvesterBodyParts
            },
            { 
                name: 'harvesterTwo2',
                role: 'harvesterTwo',       
                stopOperation: true,
                bodyParts: harvesterTwoBodyParts
            },
            { 
                name: 'upgrader1',
                role: 'upgrader',
                bodyParts: upgraderBodyParts
            },
            { 
                name: 'builder1',
                role: 'builder',            
                condition: northConstructionSites.length > 0,
                bodyParts: builderBodyParts
            },
            { 
                name: 'carrier1',
                role: 'carrier', 
                bodyParts: carrierBodyParts
            },
            { 
                name: 'upgrader2',
                role: 'upgrader', 
                bodyParts: upgraderBodyParts
            },
            { 
                name: 'builder2',
                role: 'builder',            
                condition: northConstructionSites.length > 0,
                bodyParts: builderBodyParts
            },
            { 
                name: 'builder3',
                role: 'builder',            
                condition: northConstructionSites.length > 0,
                bodyParts: builderBodyParts
            },
            { 
                name: 'upgrader3',
                role: 'upgrader',           
                condition: northConstructionSites.length === 0,
                bodyParts: upgraderBodyParts
            },
            { 
                name: 'upgrader4',
                role: 'upgrader',           
                condition: northConstructionSites.length === 0,
                bodyParts: upgraderBodyParts
            },
            { 
                name: 'upgrader5',
                role: 'upgrader',           
                condition: northConstructionSites.length === 0,
                bodyParts: upgraderBodyParts
            }
        ]
    }

    var southRoom = {
        room: util().southRoom,
        creepTypes: [ 
            { 
                name: 'backUpHarvester',
                role: 'harvester',    
                condition: getNumberOfHarvesters('south') === 0, 
                stopOperation: true,
                bodyParts: backUpHarvesterBodyParts
            },
            { 
                name: 'harvester1',
                role: 'harvester',          
                stopOperation: true,
                bodyParts: harvesterBodyParts
            },
            { 
                name: 'harvester2',
                role: 'harvester',          
                stopOperation: true,
                bodyParts: harvesterBodyParts
            },
            { 
                name: 'harvester3',
                role: 'harvester',          
                stopOperation: true,
                bodyParts: harvesterBodyParts
            },
            { 
                name: 'superHarvesterTwo',
                role: 'harvesterTwo',  
                stopOperation: true,
                bodyParts: superHarvesterTwoBodyParts
            },
            { 
                name: 'upgrader1',
                role: 'upgrader',
                bodyParts: upgraderBodyParts
            },
            { 
                name: 'builder1',
                role: 'builder',            
                condition: southConstructionSites.length > 0,
                bodyParts: builderBodyParts
            },
            { 
                name: 'carrier1',
                role: 'carrier',
                bodyParts: carrierBodyParts
            },    
            { 
                name: 'upgrader2',
                role: 'upgrader',
                bodyParts: upgraderBodyParts
            },
            { 
                name: 'builder2',
                role: 'builder',            
                condition: southConstructionSites.length > 0,
                bodyParts: builderBodyParts
            },
            { 
                name: 'upgrader3',
                role: 'upgrader',
                bodyParts: upgraderBodyParts
            },
            { 
                name: 'builder3',
                role: 'builder',            
                condition: southConstructionSites.length > 0,
                bodyParts: builderBodyParts
            },
            { 
                name: 'upgrader4',
                role: 'upgrader',           
                condition: southConstructionSites.length === 0,
                bodyParts: upgraderBodyParts
            },
            { 
                name: 'upgrader5',
                role: 'upgrader',           
                condition: southConstructionSites.length === 0,
                bodyParts: upgraderBodyParts
            },
            { 
                name: 'upgrader6',
                role: 'upgrader',           
                condition: southConstructionSites.length === 0,
                bodyParts: upgraderBodyParts
            }
        ]
    };

    [farNorthRoom, northRoom, southRoom].forEach(roomSchema => {
        console.log();
        console.log('Room: ' + roomSchema.room.name);

        roomSchema.creepTypes = roomSchema.creepTypes.map(ct => {
            ct.assignedRoom = roomSchema.room.name;
            ct.name = ct.name + '(' + roomSchema.room.name + ')';
            return new CreepType(ct);
        });

        var spawn = util().getSpawnForRoom(roomSchema.room.name);
        var creepsThatNeedSpawning = roomSchema.creepTypes.filter(creepType => creepType.needsSpawning());

        //assume it's sorted by priority

        //spawn the top priority one, else if spawning, do the next highest one
        var creepToSpawn;
        if(spawn.spawning){
            creepToSpawn = creepsThatNeedSpawning[1];
        }else{
            creepToSpawn = creepsThatNeedSpawning[0];
        }

        if(creepToSpawn && creepToSpawn.stopOperation){
            roomSchema.room.status = 'incomplete';
        }else{
            roomSchema.room.status = 'complete';
        }

        if(creepToSpawn){
            spawnCreep(creepToSpawn);
        }

        if(printQueue){
            roomSchema.creepTypes.forEach(creepType => {
                if(creepType.isSpawning()){
                    util().printWithSpacing(creepType.name + ': Spawning (' + creepType.getEnergyRequired() + ')');
                }else if(creepType.needsSpawning() && creepType.condition){
                    util().printWithSpacing(creepType.name + ': Queued (' + creepType.getEnergyRequired() + ')');
                }else if(!creepType.condition){
                    util().printWithSpacing(creepType.name + ': Condition not met (' + creepType.getEnergyRequired() + ')');
                }else if(!creepType.needsSpawning()){
                    var timeToDeath = creepType.getMatchingCreeps()[0].ticksToLive;
                    util().printWithSpacing(creepType.name + ': ' + timeToDeath + ' (' + creepType.getEnergyRequired() + ')');
                }
            });
        }

        console.log('STATUS: ' + roomSchema.room.status);

        util().printEnergy(roomSchema.room);
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

    if(!creepTypeToSpawn.role){
        console.log('Spawner.js::336 :: ');
    }

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

    //we already put a default else where
    if(!assignedSpawn){
        assignedSpawn = util().getSpawnForRoom(util().northRoomName);
    }

    var errCode = assignedSpawn.createCreep(creepTypeToSpawn.bodyParts, creepName, memoryOpts);


    console.log('creepName: ', creepName);

    console.log('errCode: ', errCode);

    if(errCode === ERR_NAME_EXISTS){
        //then delete it from memory
        delete Memory.creeps[creepName];
    }
} 

