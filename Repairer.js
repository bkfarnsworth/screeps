var util = require('util');
var Worker = require('Worker');

class Repairer extends Worker {

    constructor(creep, creepOpts){
        super(creep, creepOpts);
    }

    doWork(status){
        var creep = this.creep;

        var target;
        var assignedRoom = creep.memory.assignedRoom || util.northRoomName;
        var assignedRoomRoom = Game.rooms[assignedRoom];
        
        //find the structure with the least hit points, as long as that structure is not at its max
        assignedRoomRoom.find(FIND_STRUCTURES).filter(s => s !== util.getHarvestWall(creep.room)).forEach(function(structure){
            if(!target){
                target = structure;
            }else{
                target = getBetterTarget(target, structure, creep);
            }
        });

        if(target) {

            util.doWorkOrGatherEnergy(creep, {
                status: status,
                workTarget: target,
                workFunc: () => {
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveToUsingCache(target);    
                    }
                }     
            });

        }


    }
}

module.exports = Repairer;

//SHOULD DO WALLS FIRST
function getBetterTarget(currentTarget, structure, creep){

    //if undefined, return the other    
    if(_.isUndefined(currentTarget.hits) || _.isUndefined(currentTarget.hitsMax)){ return structure }
    if(_.isUndefined(structure.hits) || _.isUndefined(structure.hitsMax)){ return currentTarget; }

    //if the one already is (basically) at it's max, do the other
    if(currentTarget.hits > currentTarget.hitsMax - 800){ return structure; }
    if(structure.hits > structure.hitsMax - 800){ return currentTarget; }

    //if the structure has less hits than the currentTarget
    if(structure.hits < currentTarget.hits){ return structure; }

    //if it is equal to the currentTarget we already have, make sure it's closer
    if(structure.hits === currentTarget.hits){
        var closestStructure = creep.pos.findClosestByPathUsingCache(_.compact([currentTarget, structure]));
        return closestStructure;
    }

    return currentTarget;
}