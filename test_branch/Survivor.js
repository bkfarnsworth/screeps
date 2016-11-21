var util = require('util')

module.exports = function (creep) {
    if(Game.spawns.Spawn1.renewCreep(creep) == ERR_NOT_IN_RANGE){
        creep.moveTo(Game.spawns.Spawn1);
    }
}