var util = require('util');

module.exports = function (tower) {


    const maxHits = 3000000;


    var hostileCreeps = util.findHostiles(tower.room)

    var creepsToHeal = tower.room.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            return creep.hits < creep.hitsMax;
        }
    });

    var bestTowerTarget = (struct) => {
        //so we aren't wasting any of the tower's 800 repair
        var hitsBelowStructureMax = struct.hits < struct.hitsMax - 800;
        var hitsBelowSpecifiedMax = struct.hits < maxHits;

        return hitsBelowStructureMax && hitsBelowSpecifiedMax;
    };


    if(creepsToHeal.length){
        tower.heal(creepsToHeal[0])
    } else if(hostileCreeps.length){
        //TODO: when we start getting many towers going at once, we will want this to be closest by range so that towers only attack creeps near the gate they are guarding
        tower.attack(hostileCreeps[0]);
    }else{
        var structures = tower.room.find(FIND_STRUCTURES, {
            filter: bestTowerTarget
        });

        //repair the one with the least
        var lowestHitsStruct = _.min(structures, 'hits');
        tower.repair(lowestHitsStruct);
    }
}
