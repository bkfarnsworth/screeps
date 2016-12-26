var RoomController = require('RoomController');
var util = require('util');

class E77S44RoomController extends RoomController {

	runRoom(){
		super.runRoom();
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
			{ 
				name: 'backUpHarvester',
				role: 'harvester',    
				condition: this.getHarvesters().length === 0, 
				stopOperation: true,
				bodyParts: this.bodyParts.backUpHarvesterBodyParts,
			},
			{ 
				name: 'harvester1',
				role: 'harvester',           
				stopOperation: true,
				bodyParts: this.bodyParts.farNorthHarvesterBodyParts,
				giveToTowers: this.status === 'complete'
			},
			{ 
				name: 'harvester2',
				role: 'harvester',           
				stopOperation: true,
				bodyParts: this.bodyParts.farNorthHarvesterBodyParts,
				sourceIndex: 1
			},
			{ 
				name: 'harvester3',
				role: 'harvester',           
				stopOperation: true,
				bodyParts: this.bodyParts.farNorthHarvesterBodyParts,
				giveToTowers: this.status === 'complete'
			},
			{ 
				name: 'harvester4',
				role: 'harvester',           
				stopOperation: true,
				bodyParts: this.bodyParts.farNorthHarvesterBodyParts,
				sourceIndex: 1
			},
			{ 
				name: 'upgrader1',
				role: 'upgrader',           
				stopOperation: true,
				bodyParts: this.bodyParts.farNorthUpgraderBodyParts
			},
			{ 
				name: 'upgrader2',
				role: 'upgrader',           
				bodyParts: this.bodyParts.farNorthUpgraderBodyParts
			},
			{ 
				name: 'upgrader3',
				role: 'upgrader',           
				bodyParts: this.bodyParts.farNorthUpgraderBodyParts
			},
			{ 
				name: 'builder1',
				role: 'builder',            
				condition: this.getMyConstructionSites().length > 0,
				bodyParts: this.bodyParts.farNorthBuilderBodyParts
			},
			{ 
				name: 'builder2',
				role: 'builder',            
				condition: this.getMyConstructionSites().length > 0,
				bodyParts: this.bodyParts.farNorthBuilderBodyParts
			}
		]

		return opts.map(obj => super.createCreepType(obj));
	}

	runLinks(){

	}
}

module.exports = E77S44RoomController;


