var util = require('util')

function CreepConfig(opts={}){

    _.defaults(opts, {
        condition: true,
        stopOperation: false,
    });
    
    Object.assign(this, opts);

    return this;
}

CreepConfig.prototype.getMatchingCreeps = function(){

    var roleFilter = (creep) => {
        return creep.memory.role == this.role 
        && creep.memory.assignedRoom === this.assignedRoom
        && creep.getBfSimpleName() === this.name;
    }

    //cache result
    this._matchingCreeps = this._matchingCreeps || util.findMyCreeps({filter: roleFilter.bind(this)});
    return this._matchingCreeps;
}

// Spawn time = 3 ticks per each body part
CreepConfig.prototype.ticksToSpawn = function(){
    return this.bodyParts.length * 3;
}

CreepConfig.prototype.isSpawning = function() {
    return this.getMatchingCreeps().length && this.getMatchingCreeps()[0].spawning;
};

CreepConfig.prototype.needsSpawning = function() {
    var needsSpawning;

    if(!this.condition){
        needsSpawning = false
    }else{
        var matchingCreeps = this.getMatchingCreeps();
        if(matchingCreeps.length){
            //see if one is about to die
            var creepAboutToDie = matchingCreeps.find(creep => util.creepIsAboutToDie(creep, this));
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

CreepConfig.prototype.getEnergyRequired = function() {
    return util.getCostForBodyPartArray(this.bodyParts);
};

module.exports = CreepConfig;
