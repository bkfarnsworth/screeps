var util = require('util');

module.exports = function (creep) {

    var inAssignedRoom = util().goToAssignedRoom(creep);
    if(!inAssignedRoom){ return; }

    console.log('creep: ', creep);

    util().doWorkUnlessCloseToSource(creep, ()=>{
        var target;
        var assignedRoom = creep.memory.assignedRoom || util().northRoomName;
        var assignedRoomRoom = Game.rooms[assignedRoom];
        
        //find the structure with the least hit points, as long as that structure is not at its max
        assignedRoomRoom.find(FIND_STRUCTURES).forEach(function(structure){
            if(!target){
                target = structure;
            }else{
                target = getBetterTarget(target, structure, creep);
            }
        });

        if(target) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);    
            }
        }
    });
}
    
//SHOULD DO WALLS FIRST
function getBetterTarget(currentTarget, structure, creep){

    //if undefined, return the other    
    if(_.isUndefined(currentTarget.hits) || _.isUndefined(currentTarget.hitsMax)){ return structure }
    if(_.isUndefined(structure.hits) || _.isUndefined(structure.hitsMax)){ return currentTarget; }

    //if the one already is (basically) at it's max, do the other
    if(currentTarget.hits > currentTarget.hitsMax * 0.95){ return structure; }
    if(structure.hits > structure.hitsMax * 0.95){ return currentTarget; }

    //if the structure has less hits than the currentTarget
    if(structure.hits < currentTarget.hits){ return structure; }

    //if it is equal to the currentTarget we already have, make sure it's closer
    if(structure.hits === currentTarget.hits){
        var closestStructure = creep.pos.findClosestByPath(_.compact([currentTarget, structure]));
        return closestStructure;
    }

    return currentTarget;
}