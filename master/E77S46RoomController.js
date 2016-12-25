var RoomController = require('RoomController');
var util = require('util');

class E77S46RoomController extends RoomController {

	runRoom(){
		super.runRoom();
		//custom
	}

	get room(){
		return util().northRoom;
	}

	get spawn(){
		return Game.spawns.Spawn2;
	}

	get creepTypes(){
        var opts = [
            { 
                name: 'backUpHarvester',    
                role: 'harvester',    
                condition: this.getHarvesters().length === 0,
                stopOperation: true,
                bodyParts: this.bodyParts.backUpHarvesterBodyParts
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
                bodyParts: this.bodyParts.harvesterBodyParts,
                sourceIndex: 1,
                giveToTowers: this.status === 'complete'
            },
            { 
                name: 'harvester3',
                role: 'harvester',          
                stopOperation: true,
                bodyParts: this.bodyParts.harvesterBodyParts
            },
            { 
                name: 'harvester4',
                role: 'harvester',       
                stopOperation: true,
                bodyParts: this.bodyParts.harvesterBodyParts,
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
                name: 'builder3',
                role: 'builder',            
                condition: this.getMyConstructionSites().length > 0,
                bodyParts: this.bodyParts.builderBodyParts
            },
            { 
                name: 'upgrader3',
                role: 'upgrader',           
                condition: this.getMyConstructionSites().length === 0,
                bodyParts: this.bodyParts.upgraderBodyParts
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
            }
        ]

        return opts.map(obj => super.createCreepType(obj));
	}

	runLinks(){
		var fromLink = Game.structures['585dc5f78d7270785de7f890'];
		var toLink1 = Game.structures['585dcc14d79a7fc4614ee0c0'];
		var toLink2 = Game.structures['585dd6639d25db137ae10956'];
		if(_.random(0, 1) === 1){
				fromLink.transferEnergy(toLink1);
		}else{
				fromLink.transferEnergy(toLink2);
		}
	}
}

module.exports = E77S46RoomController;



