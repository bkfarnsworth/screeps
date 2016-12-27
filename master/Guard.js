var util = require('util');
var Worker = require('Worker');

class Guard extends Worker{

	constructor(creep, creepOpts){
		super(creep, creepOpts);
	}

	doWork(){
		var creep = this.creep;
		var targets = creep.getAssignedRoom().find(FIND_HOSTILE_CREEPS);

		if(targets.length) {
		    if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
		        creep.moveToUsingCache(targets[0])
		    }
		
		//move to a specific position
		}else {

			if(creep.getAssignedRoom() === util().northRoom){
		  		creep.moveToUsingCache(new RoomPosition(2, 10, creep.getAssignedRoom().name));
			}else{
		  		creep.moveToUsingCache(new RoomPosition(13, 11, creep.getAssignedRoom().name));
			}
		}
	}
}

module.exports = Guard