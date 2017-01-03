var RoomController = require('RoomController');
var util = require('util');

class E77S44RoomController extends RoomController {

	runRoom(opts){
		super.runRoom(opts);
		//custom
	}

	get room(){
		return util().farNorthRoom;
	}

	get spawn(){
		return Game.spawns.Spawn3;
	}

	get creepTypes(){

		let backUpHarvester = () => _.clone(this.standardCreepTypes.backUpHarvester);
		let harvester = () => _.clone(this.standardCreepTypes.harvester);
		let guard = () => _.clone(this.standardCreepTypes.guard);
		let builder = () => _.clone(this.standardCreepTypes.builder);
		let upgrader = () => _.clone(this.standardCreepTypes.upgrader);
		let carrier = () => _.clone(this.standardCreepTypes.carrier);

		var opts = [ 
			_.extend(backUpHarvester(), {name: 'backUpHarvester'}),
			_.extend(harvester(), {
				name: 'harvester1',
				giveToTowers: this.status === 'complete'
			}),
			_.extend(harvester(), {
				name: 'harvester2',
				sourceIndex: 1
			}),
			_.extend(upgrader(), {name: 'upgrader1'}),
			_.extend(builder(),  {name: 'builder1'})
		]

		return opts.map(obj => super.createCreepType(obj));
	}

	runLinks(){

	}
}

module.exports = E77S44RoomController;


