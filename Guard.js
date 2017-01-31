var util = require('util');
var Worker = require('Worker');

class Guard extends Worker{

	constructor(creep, creepOpts){
		super(creep, creepOpts);
		this.attackTarget = creepOpts.attackTarget;
	}

	doWork(){

		console.log('Guard.js::13 :: ');

		var creep = this.creep;

		console.log('this.attackTarget: ', this.attackTarget);

		if(creep.attack(this.attackTarget) == ERR_NOT_IN_RANGE) {
			creep.moveToUsingCache(this.attackTarget);
		}
	}
}

module.exports = Guard;