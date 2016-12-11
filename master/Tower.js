var util = require('util');

module.exports = function (tower) {

    var hostileCreeps = tower.room.find(FIND_HOSTILE_CREEPS);

    var creepsToHeal = tower.room.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            return creep.hits < creep.hitsMax;
        }
    });

    var bestTowerTarget = (struct) => {
        //so we aren't wasting any of the tower's 800 repair
        var hitsBelowThreshold = struct.hits < (struct.hitsMax - 800);
        return hitsBelowThreshold;
    };


    if(hostileCreeps.length){
        tower.attack(hostileCreeps[0]);
    }else if(creepsToHeal.length){
        tower.heal(creepsToHeal[0])
    }else{
        var structures = tower.room.find(FIND_STRUCTURES, {
            filter: bestTowerTarget
        });

        //repair the one with the least
        var lowestHitsStruct = _.min(structures, 'hits');
        tower.repair(lowestHitsStruct);
    }
}
