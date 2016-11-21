var util = require('util')


module.exports = function (creep) {
    
    creep.memory.ticksToLive = creep.ticksToLive;
    
    if(creep.memory.upgradeProgress === undefined){
        creep.memory.upgradeProgress = util().myRoom.controller.progress;
    }
    
    if(creep.memory.upgradePointsDuringLife === undefined){
        creep.memory.upgradePointsDuringLife = 0;   
    }
    
    var differenceSinceLastTick = util().myRoom.controller.progress - creep.memory.upgradeProgress;
    creep.memory.upgradePointsDuringLife += differenceSinceLastTick;
    creep.memory.upgradeProgress = util().myRoom.controller.progress;

    console.log("Creep stats: " + creep.memory.role + " " + creep.memory.upgradePointsDuringLife)
    
}