var util = require('util');

module.exports = function (tower) {

    var hostileCreeps = util().findHostiles(tower.room)

    var creepsToHeal = tower.room.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            return creep.hits < creep.hitsMax;
        }
    });

    var bestTowerTarget = (struct) => {
        //so we aren't wasting any of the tower's 800 repair
        var hitsBelowStructureMax = struct.hits < struct.hitsMax - 800;
        var hitsBelowSpecifiedMax = struct.hits < 2000000;

        return hitsBelowStructureMax && hitsBelowSpecifiedMax;
    };


    //if one invader, the tower can handle that
    if(hostileCreeps.length === 1){
        tower.attack(hostileCreeps[0]);

    }else if(creepsToHeal.length){
        tower.heal(creepsToHeal[0])

    //if more than 1 invader, just set the tower healing the walls, becasue you might not be able to kill them
    }else if(hostileCreeps.length === 0 || hostileCreeps.length > 1){
        var structures = tower.room.find(FIND_STRUCTURES, {
            filter: bestTowerTarget
        });

        //repair the one with the least
        var lowestHitsStruct = _.min(structures, 'hits');
        tower.repair(lowestHitsStruct);
    }
}
