var util = require('util');

module.exports = function () {
    
    console.log("--------- Creep Report -------------");
    
    var status = "complete";
    var bodyPartEnergyMap = util().bodyPartEnergyMap;
    var creepTypes = [
        {
            role: "dedicatedHarvester", 
            bodyParts: [WORK,WORK,WORK,WORK,CARRY,MOVE],
            min: 0,
            priority: 2,
            // stopOperation: true
        },
        {
            role: "dedicatedCarrier", 
            bodyParts: [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
            min: 0,
            priority: 3,
            // stopOperation: true
        },
        {
            role: "dedicatedUpgrader",
            bodyParts: [WORK, WORK, WORK, WORK, WORK, MOVE, CARRY],
            min: 0,
            // stopOperation: true
        },
        {
            role: "otherRoomHarvester",
            bodyParts: [WORK, CARRY, MOVE],
            min: 0,
            // stopOperation: true
        },
        {
            role: "harvester", 
            bodyParts: [WORK,WORK,CARRY,MOVE,MOVE,MOVE],
            min: 0,
            // priority: 2,
            stopOperation: true
        },
        //cheap harvester in case all goes wrong, the spawn can make one more
        {
            role: "harvester", 
            bodyParts: [WORK,CARRY,MOVE],
            min: 2,
            priority: 1,
            stopOperation: true
        },
        {
            role: "upgrader", 
            bodyParts: [WORK,CARRY,MOVE],
            min: 1,
            priority: 1,
            stopOperation: true
        },
        {
            role: "extHarvester", 
            bodyParts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            min: 0,
            // priority: 2,
            // stopOperation: true
        },
        {
            role: "harvestCarrier", 
            bodyParts: [CARRY,MOVE,MOVE,MOVE],
            min: 0,
            priority: 2
        },
        {
            role: "milesHarvester", 
            bodyParts: [WORK,CARRY,MOVE,MOVE],
            min: 0
        },
        {
            role: "builder",
            bodyParts: [WORK,WORK,CARRY, CARRY ,MOVE, MOVE],
            min: 0
        },
        {
            role: "upgrader",
            bodyParts: [WORK, WORK, WORK, WORK, MOVE, CARRY],
            min: 0
        },
        {
            role: "upgradeSupplier",
            bodyParts: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            min: 0
        },
        {
            role: "guard",
            bodyParts: [TOUGH, ATTACK, ATTACK, MOVE, MOVE],
            min: 0
        },
        {
            role: "attacker",
            bodyParts: [TOUGH, RANGED_ATTACK, ATTACK, MOVE],
            min: 0
        },
        {
            role: "repairer",
            bodyParts: [WORK,WORK,CARRY,MOVE],
            min: 0
        },
        {
            role: "gladiator",
            bodyParts: [TOUGH, ATTACK, MOVE, MOVE],
            min: 0
            
        }
    ];
    
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
                return creep.memory.role == creepType.role;
            }
        }

        var creeps = util().myRoom.find(FIND_MY_CREEPS, roleFilterObj);
        
        var otherCreeps = Memory.otherRoomCreeps;
        // creeps = creeps.concat(otherCreeps);
        
        // console.log(creeps.length)
        
        if(creepType.min > 0){
            var timeToDeath = _.min(creeps, 'ticksToLive').ticksToLive;
            console.log(creepType.role + "s (" + energyRequired + " energy): " + creeps.length + "/" + creepType.min + ". Death in " + timeToDeath + " ticks")
        }
        
        if(creeps.length < creepType.min){
            // console.log(creepType.role)
            creepTypesThatNeedSpawning.push(creepType);
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
        Game.spawns.Spawn1.createCreep(creepToSpawn.bodyParts, creepToSpawn.role + Date.now(), {role: creepToSpawn.role});
        if(creepToSpawn.stopOperation){
            status = "incomplete";
        }
    }
    
    //clean up dead creeps from memory
    // util().cleanDeadCreepsFromMemory(Memory.creeps);
    
    console.log('STATUS: ' + status);
    
    return status;
}    