module.exports = function (creep) {

    var targets = creep.room.find(FIND_HOSTILE_CREEPS, {
        filter: function(creep){
            return creep.pos.x >= 9 || creep.pos.y > 8
        }
    });
    if(targets.length) {
        if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0])
        }
        //move to a specific position
    }else {
        creep.moveTo(20, 31);
    }
}
