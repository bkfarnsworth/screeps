var harvester = require('harvester')
var upgrader = require('Upgrader')
var guard = require('Guard')
var healer = require('Healer')
var builder = require('Builder')
var spawner = require('Spawner')
var attacker = require('Attacker')
var repairer = require('Repairer')
var milesHarvester = require('milesHarvester')
var gladiator = require('Gladiator');
var extHarvester = require('ExtHarvester')

module.exports.loop = function () {
    
    var status = spawner()
    
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

		if(creep.memory.role == 'harvester') {
			harvester(creep);
		}
		
		if(creep.memory.role == 'extHarvester') {
			extHarvester(creep);
		}
		
        if(creep.memory.role == 'upgrader') {
        	if(status == 'complete'){
        	    upgrader(creep);
        	}
        }
        
        if(creep.memory.role == 'guard') {
            guard(creep);
        }
        
        if(creep.memory.role == 'healer') {
            healer(creep);
        }
        
        if(creep.memory.role == 'attacker') {
            attacker(creep);
        }
        
        if(creep.memory.role == 'gladiator') {
            gladiator(creep);
        }
        
        if(creep.memory.role == 'milesHarvester') {
            milesHarvester(creep);
        }
        
        if(creep.memory.role == 'repairer') {
            if(status == 'complete'){
		        repairer(creep);
		    }
        }
        
		if(creep.memory.role == 'builder') {
		  //  if(status == 'complete'){
		        builder(creep);
		  //  }
		}
	}
}