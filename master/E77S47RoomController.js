var RoomController = require('RoomController');
var util = require('util');

class E77S47RoomController extends RoomController {

	runRoom(){
		super.runRoom();
		//custom
	}

	get room(){
		return util().southRoom;
	}

	get spawn(){
		return Game.spawns.Spawn1;
	}

	get creepTypes(){
		var opts = [ 
			{ 
				name: 'backUpHarvester',
				role: 'harvester',    
				condition: this.getHarvesters().length === 0, 
				stopOperation: true,
				bodyParts: this.bodyParts.backUpHarvesterBodyParts,
				harvestSource: ''
			},
			{ 
				name: 'harvester1',
				role: 'harvester',          
				stopOperation: true,
				bodyParts: this.bodyParts.harvesterBodyParts
			},
			{ 
				name: 'harvester2',
				role: 'harvester',          
				stopOperation: true,
				bodyParts: this.bodyParts.harvesterBodyParts
			},
			{ 
				name: 'harvester3',
				role: 'harvester',          
				stopOperation: true,
				bodyParts: this.bodyParts.harvesterBodyParts
			},
			{ 
				name: 'superHarvester',
				role: 'harvester',  
				stopOperation: true,
				bodyParts: this.bodyParts.superHarvesterTwoBodyParts,
				sourceIndex: 1,
				giveToTowers: this.status === 'complete'
			},
			{ 
				name: 'upgrader1',
				role: 'upgrader',
				bodyParts: this.bodyParts.upgraderBodyParts
			},
			{ 
				name: 'builder1',
				role: 'builder',            
				condition: this.getMyConstructionSites().length > 0,
				bodyParts: this.bodyParts.builderBodyParts
			},
			{ 
				name: 'carrier1',
				role: 'carrier',
				bodyParts: this.bodyParts.carrierBodyParts
			},    
			{ 
				name: 'upgrader2',
				role: 'upgrader',
				bodyParts: this.bodyParts.upgraderBodyParts
			},
			{ 
				name: 'builder2',
				role: 'builder',            
				condition: this.getMyConstructionSites().length > 0,
				bodyParts: this.bodyParts.builderBodyParts
			},
			{ 
				name: 'upgrader3',
				role: 'upgrader',
				bodyParts: this.bodyParts.upgraderBodyParts
			},
			{ 
				name: 'builder3',
				role: 'builder',            
				condition: this.getMyConstructionSites().length > 0,
				bodyParts: this.bodyParts.builderBodyParts
			},
			{ 
				name: 'upgrader4',
				role: 'upgrader',           
				condition: this.getMyConstructionSites().length === 0,
				bodyParts: this.bodyParts.upgraderBodyParts
			},
			{ 
				name: 'upgrader5',
				role: 'upgrader',           
				condition: this.getMyConstructionSites().length === 0,
				bodyParts: this.bodyParts.upgraderBodyParts
			},
			{ 
				name: 'upgrader6',
				role: 'upgrader',           
				condition: this.getMyConstructionSites().length === 0,
				bodyParts: this.bodyParts.upgraderBodyParts
			}
		]

		return opts.map(obj => super.createCreepType(obj));
	}

	runLinks(){
		var westLink = Game.structures['585b6ab33962b71d57030d66'];
		var eastLink = Game.structures['585b75504b207b74496d64b5'];
		var southLink = Game.structures['585cc390713f5c3c7a62662b'];
		if(_.random(0, 1) === 1){
		    westLink.transferEnergy(eastLink);
		}else{
		    westLink.transferEnergy(southLink);
		}
	}
}

module.exports = E77S47RoomController;