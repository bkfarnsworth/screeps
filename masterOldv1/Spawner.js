module.exports = function () {
    
    console.log("--------- Creep Report -------------")
    
    var status = "complete";
    var creepTypes = [
        {
            role: "harvester", 
            bodyParts: [WORK,CARRY,MOVE,MOVE],
            min: 4
        },
        {
            role: "extHarvester", 
            bodyParts: [WORK,CARRY,MOVE,MOVE],
            min: 4
        },
        {
            role: "milesHarvester", 
            bodyParts: [WORK,CARRY,MOVE,MOVE],
            min: 0
        },
        {
            role: "builder",
            bodyParts: [WORK,WORK,CARRY, CARRY ,MOVE],
            min: 0
        },
        {
            role: "upgrader",
            bodyParts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            min: 4
        },
        {
            role: "guard",
            bodyParts: [TOUGH, ATTACK, ATTACK, MOVE, MOVE],
            min: 2
        },
        {
            role: "attacker",
            bodyParts: [TOUGH, RANGED_ATTACK, ATTACK, MOVE],
            min: 0
        },
        {
            role: "repairer",
            bodyParts: [WORK,WORK,CARRY,MOVE],
            min: 2
        },
        {
            role: "gladiator",
            bodyParts: [TOUGH, ATTACK, MOVE, MOVE],
            min: 0
            
        }
    ].reverse();
    
    for (var creepType in creepTypes){
        var creepType = creepTypes[creepType];
        
        var NumOfCreeps = Game.rooms.W11S5.find(FIND_MY_CREEPS, {
            filter: function(creep) {
                return creep.memory.role == creepType.role;
            }
        }).length;
        console.log(creepType.role + "s: " + NumOfCreeps)
        
        if(NumOfCreeps < creepType.min){
            
            if(creepType.role == 'harvester' || creepType.role == 'extHarvester'){
                status = "incomplete";
            }
            
            Game.spawns.Spawn1.createCreep(creepType.bodyParts, creepType.role + Date.now(), {role: creepType.role});
        }
    }
    
    return status;
}    