module.exports = function (creep) {
    if(creep.carry.energy <= 1) {
		if(Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
			creep.moveTo(Game.spawns.Spawn1);				
		}
    }else {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object) {
                //DO WALLS FIRST
                return object.hits < object.hitsMax && object.hits < 1000 && object.structureType === STRUCTURE_WALL;
            }
        });
        if(target) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);    
            }
        }
    }
}