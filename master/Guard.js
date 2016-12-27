var util = require('util');
var Worker = require('Worker');

class Guard extends Worker{

	constructor(creep, creepOpts){
		super(creep, creepOpts);
	}

	doWork(){
		var creep = this.creep;
		var targets = util().findHostiles(creep);
		var closestTarget = creep.pos.findClosestByPathUsingCache(targets);

		if(closestTarget) {

			if(this.attack(closestTarget) == ERR_NOT_IN_RANGE) {
				creep.moveToUsingCache(closestTarget);
			}

		//move to a specific position
		}else {
			//have roomcontroller pass in a location
		}
	}

	attack(target){
		var creep = this.creep;
		var body = creep.body;
		var canRangeAttack = _.any(body, part => part.type === RANGED_ATTACK && part.hits > 0);
		if(canRangeAttack){
			return creep.rangedAttack(target);
		}else{
			return creep.attack(target);
		}
	}
}

module.exports = Guard;