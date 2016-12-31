var RoomController = require('RoomController');
var util = require('util');

class E77S47RoomController extends RoomController {

	runRoom(opts){
		super.runRoom(opts);
		//custom
	}

	get room(){
		return util().southRoom;
	}

	get spawn(){
		return Game.spawns.Spawn1;
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
			// _.extend(guard(),     {name: 'guard1'}),
			_.extend(harvester(), {name: 'harvester1'}),
			_.extend(harvester(), {
				name: 'harvester2',
				sourceIndex: 1,
				giveToTowers: this.status === 'complete'
			}),
			_.extend(upgrader(), {name: 'upgrader1'}),
			_.extend(builder(),  {name: 'builder1'}),
		]

		return opts.map(obj => super.createCreepType(obj));
	}

	runLinks(){
		var westLink = Game.structures['585b6ab33962b71d57030d66'];
		var eastLink = Game.structures['585b75504b207b74496d64b5'];
		var southLink = Game.structures['585cc390713f5c3c7a62662b'];
		// if(_.random(0, 1) === 1){
		    westLink.transferEnergy(eastLink);
		// }else{
		    // westLink.transferEnergy(southLink);
		// }
	}
}

module.exports = E77S47RoomController;