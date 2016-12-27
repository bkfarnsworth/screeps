var util = require('util')
var Worker = require('Worker');

class Healer extends Worker{

    constructor(creep, creepOpts={}){
        super(creep, creepOpts);
    }

    doWork(){
        var creep = this.creep;
        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        if(target) {
            if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                creep.moveToUsingCache(target);
            }
        }
    }
}

module.exports = Healer;  