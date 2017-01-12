var util = require('util');
var Worker = require('Worker');

class Demoman extends Worker{

	constructor(creep, creepOpts){
		super(creep, creepOpts);
		this.targetRoomName = util.milesRoomName;

		//list of targets
		var wallPoint = new RoomPosition(7, 5, this.targetRoomName);
		// var wallPoint = new RoomPosition(27, 47, this.targetRoomName);
		var tower = new RoomPosition(31, 29, this.targetRoomName);

		this.targets = [
			wallPoint,
			tower
		];
	}

	doWork(){ 
		var creep = this.creep;
		if(creep.room.name !== this.targetRoomName){
			util.goToRoom(this.targetRoomName, creep);
		}else{
			this.goToAndDismantleTarget();
		}
	}

	goToAndDismantleTarget(){
		var creep = this.creep;
		for (var i = 0; i < this.targets.length; i++) {
			var exists = this.dismantleTargetIfExists(this.targets[i], creep);
			if(exists){ break; }
		};
	}

	dismantleTargetIfExists(target, creep){
		var structToDismantle = target.lookFor(LOOK_STRUCTURES)[0];
		if(structToDismantle){
			var errCode = creep.dismantle(structToDismantle);
			if(errCode === ERR_NOT_IN_RANGE){
				creep.moveToUsingCache(target);
			}
			return true
		}else{
			return false;
		}
	}
}

module.exports = Demoman;