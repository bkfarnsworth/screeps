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

CreepType.prototype.isSpawning = function() {
    return this.getMatchingCreeps().length && this.getMatchingCreeps()[0].spawning;
};

CreepType.prototype.needsSpawning = function() {
    return !this.getMatchingCreeps().length && this.condition;
};

CreepType.prototype.getEnergyRequired = function() {
    var bodyPartEnergyMap = util().bodyPartEnergyMap;
    return _.sum(this.bodyParts.map(bp => bodyPartEnergyMap[bp.toString().toUpperCase()]));
};

module.exports = CreepType;
