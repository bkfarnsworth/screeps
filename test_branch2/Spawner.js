var util = require('util');

module.exports = function () {
    
    var status = "complete";
    var bodyPartEnergyMap = util().bodyPartEnergyMap;

    var numberOfHarvesters = util().myRoom.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            return creep.memory.role == 'harvester';
        }
    });

    if(numberOfHarvesters === 0){
        Game.notify('NO HARVESTERS', 60);
    }

    var creepTypes = [
        {
            creepTypeId: 1,
            role: "dedicatedCarrier", 
            bodyParts: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            min: 4,
            priority: 6,
            // stopOperation: true
        },

        //////////// HARVESTERS
        //cheap harvester in case all goes wrong, the spawn can make one more
        //have two good harvester that stops operation
        //one more that won't stop it
        //1 harvester for the other source

        {
            creepTypeId: 10,
            role: "harvester", 
            bodyParts: [WORK,CARRY,MOVE],
            min: 1,
            priority: 1,
            stopOperation: true,
            condition: numberOfHarvesters === 0
        },
        {
            creepTypeId: 9,
            role: "harvester", 
            bodyParts: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            min: 2,
            priority: 1,
            stopOperation: true
        },
        {
            creepTypeId: 3,
            role: "harvester", 
            bodyParts: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            min: 1,
            priority: 3
        },
        {
            creepTypeId: 4,
            role: "harvesterTwo", 
            bodyParts: [WORK,WORK,WORK,WORK,CARRY,MOVE],
            min: 1,
            priority: 1,
            stopOperation: true
        },

        //////////// UPGRADERS
        // 1 StopOp upgrader
        {
            creepTypeId: 12,
            role: "upgrader", 
            bodyParts: [WORK,CARRY,CARRY,MOVE,MOVE],
            min: 1,
            priority: 2,
            stopOperation: true,
            assignedRoom: util().southRoom
        },
        {
            creepTypeId: 5,
            role: "upgrader", 
            bodyParts: [WORK,CARRY,CARRY,MOVE,MOVE],
            min: 1,
            priority: 2,
            stopOperation: true,
            assignedRoom: util().northRoom
        },
        // //2 normal upgraders
        // {
        //     role: "upgrader", 
        //     bodyParts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
        //     min: 5,
        //     priority: 3
        // },

        //////////// BUILDERS
        //2 normal builders
        {
            creepTypeId: 6,
            role: "builder", 
            bodyParts: [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
            min: 4,
            priority: 4,
            assignedRoom: util().northRoom
        },

        //////////// REPAIRERS
        {
            creepTypeId: 7,
            role: "repairer",
            bodyParts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            priority: 3,
            min: 1,
            stopOperation: true,
            assignedRoom: util().northRoom
        },
        {
            creepTypeId: 8,
            role: "repairer",
            bodyParts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            priority: 3,
            min: 1,
            stopOperation: true,
            assignedRoom: util().southRoom
        }
    ];

    var nextCreepTypeId = _.max(creepTypes, 'creepTypeId').creepTypeId + 1;
    // console.log('nextCreepTypeId: ', nextCreepTypeId);
    
    var creepTypesThatNeedSpawning = [];
    for (var creepType in creepTypes){
        var creepType = creepTypes[creepType];
        // console.log(creepType.role + " " + creepType.min)
        // console.log(creepType.role)
        var energyRequired = 0;
        
        //add up the energy cost
        creepType.bodyParts.forEach(function(bodyPart){
            energyRequired += bodyPartEnergyMap[bodyPart.toString().toUpperCase()];
        });
        
        var roleFilterObj = {
            filter: function(creep) {
                return creep.memory.role == creepType.role 
                && creep.memory.assignedRoom === creepType.assignedRoom
                && creep.memory.creepTypeId === creepType.creepTypeId;
            }
        }

        var creeps = util().myRoom.find(FIND_MY_CREEPS, roleFilterObj);
        creeps = creeps.concat(util().northRoomRoom.find(FIND_MY_CREEPS, roleFilterObj));
        
        var otherCreeps = Memory.otherRoomCreeps;
        // creeps = creeps.concat(otherCreeps);
        
        // console.log(creeps.length)
        
        if(creepType.min > 0){
            var timeToDeath = _.min(creeps, 'ticksToLive').ticksToLive;
            var assignedRoom = creepType.assignedRoom ? ('(' + creepType.assignedRoom + ')') : '';
            console.log(creepType.role + "s " + assignedRoom + " (" + energyRequired + " energy): " + creeps.length + "/" + creepType.min + ". Death in " + timeToDeath + " ticks. ID: " + creepType.creepTypeId )
        }
        
        if(creepType.condition === true || _.isUndefined(creepType.condition)){
            if(creeps.length < creepType.min){
                creepTypesThatNeedSpawning.push(creepType);
                continue;
            }
        }
    }
    
    //Sort the creepTypes by priority so those with a lower priority number get spawned first
    creepTypesThatNeedSpawning.sort(function(creepTypeA, creepTypeB){
        
        if(creepTypeA.priority === undefined){
            creepTypeA.priority = Infinity;
        }
        
        if(creepTypeB.priority === undefined){
            creepTypeB.priority = Infinity;
        }
        
        if(creepTypeA.priority < creepTypeB.priority){
            return -1;
        }else if(creepTypeA.priority > creepTypeB.priority){
            return 1;
        }else{
            return 0;
        }
    });
    
    //DON'T REMOVE THIS! Uncomment this to test out your sort function if you need to.    
    // for (var creepType in creepTypes){
    //     var creepType = creepTypes[creepType]
    //     console.log(creepType.role + " " + creepType.priority  + " " + creepType.min)
    // }
    
    var creepToSpawn = creepTypesThatNeedSpawning[0];
    // console.log(creepToSpawn)
    if (creepToSpawn) {
        var nowString = Date.now().toString();
        var creepName = creepToSpawn.role + nowString.substr(nowString.length - 4);

        console.log('Next creep to be spawned: ', creepToSpawn.role);

        Game.spawns.Spawn1.createCreep(creepToSpawn.bodyParts, creepName, {
            role: creepToSpawn.role,
            assignedRoom: creepToSpawn.assignedRoom,
            creepTypeId: creepToSpawn.creepTypeId
        });
        if(creepToSpawn.stopOperation){
            status = "incomplete";
        }
    }
    
    //clean up dead creeps from memory
    // util().cleanDeadCreepsFromMemory(Memory.creeps);
    
    console.log('STATUS: ' + status);
    
    return status;
}    