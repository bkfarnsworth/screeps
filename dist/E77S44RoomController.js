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
		var opts = [ 
			this.standardCreepTypes.backUpHarvester,
			{ 
				name: 'harvester1',
				role: 'harvester',           
				stopOperation: true,
				bodyParts: util().getBodyPartsArray({
					WORK: 4,
					MOVE: 4,
					CARRY: 4
				}),
				giveToTowers: this.status === 'complete'
			},
			{ 
				name: 'harvester2',
				role: 'harvester',           
				stopOperation: true,
				bodyParts: util().getBodyPartsArray({
					WORK: 4,
					MOVE: 4,
					CARRY: 4
				}),
				sourceIndex: 1
			},
			{ 
				name: 'upgrader1',
				role: 'upgrader',           
				stopOperation: true,
				bodyParts: util().getBodyPartsArray({
					WORK: 4,
					MOVE: 4,
					CARRY: 4
				})
			},
			{ 
				name: 'builder1',
				role: 'builder',            
				condition: this.getMyConstructionSites().length > 0,
				bodyParts: util().getBodyPartsArray({
					WORK: 4,
					MOVE: 4,
					CARRY: 4
				})
			}
		]

		return opts.map(obj => super.createCreepType(obj));
	}

	runLinks(){

	}
}

module.exports = E77S44RoomController;


