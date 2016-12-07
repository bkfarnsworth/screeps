var util = require('util');

module.exports = function () {
    
    var status = "complete";

    var numberOfHarvesters = util().southRoom.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            return creep.memory.role == 'harvester';
        }
    }).length;

    var northConstructionSites = util().northRoom.find(FIND_MY_CONSTRUCTION_SITES);
    var southConstructionSites = util().southRoom.find(FIND_MY_CONSTRUCTION_SITES);

    if(numberOfHarvesters === 0){
        Game.notify('NO HARVESTERS', 60);
    }

    var creepTypes = [
        // new CreepType({
        //     creepTypeId: 1,
        //     role: "dedicatedCarrier", 
        //     bodyParts: [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
        //     min: 2,
        //     priority: 6,
        //     assignedRoom: util().southRoomName
        //     // stopOperation: true
        // }),
        new CreepType({
            creepTypeId: 1,
            role: "dedicatedCarrier", 
            bodyParts: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            min: 3,
            priority: 6,
            assignedRoom: util().northRoomName
            // stopOperation: true
        }),

        //////////// HARVESTERS
        //cheap harvester in case all goes wrong, the spawn can make one more
        //have two good harvester that stops operation
        //one more that won't stop it
        //1 harvester for the other source

        new CreepType({
            creepTypeId: 10,
            role: "harvester", 
            bodyParts: [WORK,CARRY,MOVE],
            min: 1,
            priority: 1,
            stopOperation: true,
            condition: numberOfHarvesters === 0
        }),

        new CreepType({
            creepTypeId: 30,
            role: "harvester", 
            bodyParts: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            min: 2,
            priority: 1,
            stopOperation: true,
            assignedRoom: util().southRoomName
        }),
        new CreepType({
            creepTypeId: 9,
            role: "harvester", 
            bodyParts: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            min: 2,
            priority: 1,
            stopOperation: true,
            assignedRoom: util().northRoomName
        }),

        //lower priority
        new CreepType({
            creepTypeId: 3,
            role: "harvester", 
            bodyParts: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            min: 1,
            priority: 3,
            assignedRoom: util().northRoomName,
        }),
        new CreepType({
            creepTypeId: 3,
            role: "harvester", 
            bodyParts: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            min: 1,
            priority: 3,
            assignedRoom: util().southRoomName,
        }),


        new CreepType({
            creepTypeId: 4,
            role: "harvesterTwo", 
            bodyParts: [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
            min: 1,
            priority: 1,
            assignedRoom: util().southRoomName,
            stopOperation: true
        }),
        new CreepType({
            creepTypeId: 4,
            role: "harvesterTwo", 
            bodyParts: [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
            min: 2,
            priority: 1,
            assignedRoom: util().northRoomName,
            stopOperation: true
        }),

        //////////// UPGRADERS
        // 1 StopOp upgrader
        new CreepType({
            creepTypeId: 12,
            role: "upgrader", 
            bodyParts: [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
            min: 2,
            priority: 2,
            stopOperation: true,
            assignedRoom: util().southRoomName
        }),
        new CreepType({
            creepTypeId: 5,
            role: "upgrader", 
            bodyParts: [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
            min: 5,
            priority: 2,
            stopOperation: true,
            assignedRoom: util().northRoomName
        }),
        //TODO: I really do not need this ID thing.  I just compare on all the attributes.  If they are exactly the same, then they are the same thing!
        //less high priority upgraders
        new CreepType({
            creepTypeId: 13,
            role: "upgrader", 
            bodyParts: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            min: 2,
            priority: 7,
            assignedRoom: util().northRoomName
        }),
        // //2 normal upgraders
        // new CreepType({
        //     role: "upgrader", 
        //     bodyParts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
        //     min: 5,
        //     priority: 3
        // }),

        //////////// BUILDERS
        //2 normal builders
        new CreepType({
            creepTypeId: 6,
            role: "builder", 
            bodyParts: [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
            min: 1,
            priority: 8,
            assignedRoom: util().northRoomName,
            condition: northConstructionSites.length > 0
        }),
        new CreepType({
            creepTypeId: 20,
            role: "builder", 
            bodyParts: [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
            min: 1,
            priority: 8,
            assignedRoom: util().southRoomName,
            condition: southConstructionSites.length > 0
        }),

        //////////// REPAIRERS
        new CreepType({
            creepTypeId: 7,
            role: "repairer",
            bodyParts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            priority: 3,
            min: 2,
            stopOperation: true,
            assignedRoom: util().northRoomName
        }),
        new CreepType({
            creepTypeId: 8,
            role: "repairer",
            bodyParts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            priority: 3,
            min: 2,
            stopOperation: true,
            assignedRoom: util().southRoomName
        }),

        // new CreepType({
        //     creepTypeId: 40,
        //     role: "attacker",
        //     bodyParts: [RANGED_ATTACK, ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE],
        //     priority: 2,
        //     min: 3,
        //     stopOperation: true,
        //     assignedRoom: util().southRoomName
        // })
    ];

    var nextCreepTypeId = _.max(creepTypes, 'creepTypeId').creepTypeId + 1;
    // console.log('nextCreepTypeId: ', nextCreepTypeId);
    
    var creepTypesThatNeedSpawning = [];
    for (var creepType in creepTypes){
        var creepType = creepTypes[creepType];
        // console.log(creepType.role + " " + creepType.min)
        // console.log(creepType.role)

        
        var roleFilterObj = {
            filter: function(creep) {
                return creep.memory.role == creepType.role 
                && creep.memory.assignedRoom === creepType.assignedRoom
                && creep.memory.creepTypeId === creepType.creepTypeId;
            }
        }

        var creeps = util().southRoom.find(FIND_MY_CREEPS, roleFilterObj);
        creeps = creeps.concat(util().northRoom.find(FIND_MY_CREEPS, roleFilterObj));
        
        var otherCreeps = Memory.otherRoomCreeps;
        // creeps = creeps.concat(otherCreeps);
        
        // console.log(creeps.length)
        
        if(creepType.min > 0){
            var timeToDeath = _.min(creeps, 'ticksToLive').ticksToLive;
            var assignedRoom = creepType.assignedRoom ? ('(' + creepType.assignedRoom + ')') : '';
            console.log(creepType.role + "s " + assignedRoom + " (" + creepType.getEnergyRequired() + " energy): " + creeps.length + "/" + creepType.min + ". Death in " + timeToDeath + " ticks. ID: " + creepType.creepTypeId )
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
    if (creepToSpawn) {
        spawnCreep(creepToSpawn);
        if(creepToSpawn.stopOperation){
            status = "incomplete";
        }
    }
    
    //clean up dead creeps from memory
    // util().cleanDeadCreepsFromMemory(Memory.creeps);
    
    console.log('STATUS: ' + status);
    
    return status;
}   

function spawnCreep(creepTypeToSpawn){
    console.log('Next creep to be spawned: ', creepTypeToSpawn.role);

    var nowString = Date.now().toString();
    var creepName = creepTypeToSpawn.role + nowString.substr(nowString.length - 4);
    var energyRequired = creepTypeToSpawn.getEnergyRequired();
    var memoryOpts = {
        role: creepTypeToSpawn.role,
        assignedRoom: creepTypeToSpawn.assignedRoom,
        creepTypeId: creepTypeToSpawn.creepTypeId
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
