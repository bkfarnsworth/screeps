var util = require('util');

module.exports = function (tower, defenseStrategy) {

    if(defenseStrategy === 'attack'){
        var hostileCreeps = util.findHostiles(tower.room);
        tower.attack(hostileCreeps[0]);
    }else if(defenseStrategy === 'repair'){
        repair(tower);
    }else if(defenseStrategy === 'none'){
        repair(tower);
    }
}

function repair(tower){

    const maxHits = 3000000;

    var bestTowerTarget = (struct) => {
        //so we aren't wasting any of the tower's 800 repair
        var hitsBelowStructureMax = struct.hits < struct.hitsMax - 800;
        var hitsBelowSpecifiedMax = struct.hits < maxHits;

        return hitsBelowStructureMax && hitsBelowSpecifiedMax;
    };

    var structures = tower.room.find(FIND_STRUCTURES, {
        filter: bestTowerTarget
    });

    //repair the one with the least
    var lowestHitsStruct = _.min(structures, 'hits');
    tower.repair(lowestHitsStruct);
}

// function heal(){
//     //not going to worry about healing for now    
//     // var creepsToHeal = tower.room.find(FIND_MY_CREEPS, {
//     //     filter: function(creep) {
//     //         return creep.hits < creep.hitsMax;
//     //     }
//     // });
//     // tower.heal(creepsToHeal[0])
// }


