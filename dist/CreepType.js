var util = require('util')

function CreepType(opts={}){

    _.defaults(opts, {
        condition: true,
        stopOperation: false,
    });
    
    Object.assign(this, opts);

    return this;
}

CreepType.prototype.getMatchingCreeps = function(){

    var roleFilter = (creep) => {
        return creep.memory.role == this.role 
        && creep.memory.assignedRoom === this.assignedRoom
        && creep.name === this.name;
    }

    //cache result
    this._matchingCreeps = this._matchingCreeps || util().findMyCreeps({filter: roleFilter.bind(this)});
    return this._matchingCreeps;
}

// Spawn time = 3 ticks per each body part
CreepType.prototype.ticksToSpawn = function(){
    return this.bodyParts.length * 3;
}

CreepType.prototype.isSpawning = function() {
    return this.getMatchingCreeps().length && this.getMatchingCreeps()[0].spawning;
};

CreepType.prototype.needsSpawning = function() {
    var needsSpawning;

    if(!this.condition){
        needsSpawning = false
    }else{
        var matchingCreeps = this.getMatchingCreeps();
        if(matchingCreeps.length){
            //see if one is about to die
            var creepAboutToDie = matchingCreeps.find(creep => creep.ticksToLive <= this.ticksToSpawn());
            if(creepAboutToDie){
                needsSpawning = true;
            }else{
                needsSpawning = false;
            }
        }else{
            needsSpawning = true;
        }
    }

    return needsSpawning;
};

CreepType.prototype.getEnergyRequired = function() {
    var bodyPartEnergyMap = util().bodyPartEnergyMap;
    return _.sum(this.bodyParts.map(bp => bodyPartEnergyMap[bp.toString().toUpperCase()]));
};

module.exports = CreepType;
