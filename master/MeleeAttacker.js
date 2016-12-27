var util = require('util');
var Worker = require('Worker');

class MeleeAttacker extends Worker{

	constructor(creep, roomToAttack){
		super(creep)
		this.roomToAttack = roomToAttack;
	}

	doWork(){
		var creep = this.creep;

		//go to room x, some position
		var pos = new RoomPosition(5, 26, util().milesRoomName);
		creep.moveToUsingCache(pos);

		//print out the hostile creeps, try it with and without miles too
		var hostiles = util().findHostiles(creep.room)

		console.log('PRINTING HOSTILES');
		hostiles.forEach(h => {
			util().printObject(h);
		});
	}
}

module.exports = MeleeAttacker