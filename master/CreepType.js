var util = require('util')

function CreepType(opts){
    this.creepTypeId = opts.creepTypeId;
    this.role = opts.role;
    this.bodyParts = opts.bodyParts;
    this.min = opts.min;
    this.priority = opts.priority;
    this.assignedRoom = opts.assignedRoom;
    this.condition = opts.condition;
    this.stopOperation = opts.stopOperation;
    this.name = opts.name;
    return this;
}

CreepType.factory = function(name, type, room, opts={}){

    _.defaults(opts, {
        condition: true,
        stopOperation: false,
    });

    name = name + '(' + room.name + ')';

    var creepType = new CreepType({
        condition: opts.condition,
        stopOperation: opts.stopOperation,
        name: name
    });

    switch(type){
        case 'backUpHarvester':
            creepType.role = 'harvester';
            creepType.bodyParts = [WORK,CARRY,MOVE];
            break;
        case 'superHarvesterTwo': 
            creepType.role = 'harvesterTwo';
            creepType.bodyParts = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
            break;
        case 'guard': 
            creepType.role = 'guard';
            creepType.bodyParts = [MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,TOUGH,TOUGH];
            break;
        case 'demoman': 
            creepType.role = 'demoman';
            creepType.bodyParts = [TOUGH,TOUGH,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK];
            break;
        case 'meleeAttacker': 
            creepType.role = 'meleeAttacker';
            creepType.bodyParts = [MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,TOUGH,TOUGH];
            break;
        case 'harvester': 
            creepType.role = 'harvester';
            creepType.bodyParts = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
            break;
        case 'harvesterTwo': 
            creepType.role = 'harvesterTwo';
            creepType.bodyParts = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
            break;
        case 'carrier': 
            creepType.role = 'carrier';
            creepType.bodyParts = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
            break;
        case 'upgrader': 
            creepType.role = 'upgrader';
            creepType.bodyParts = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
            break;
        case 'builder': 
            creepType.role = 'builder';
            creepType.bodyParts = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
            break;
    }

    return creepType;
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
