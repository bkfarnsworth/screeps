var RoomController = require('RoomController');
var util = require('util');

class E77S46RoomController extends RoomController {

	runRoom(opts){
		super.runRoom(opts);
		//custom
	}

	get room(){
		return util().northRoom;
	}

	get spawn(){
		return Game.spawns.Spawn2;
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
            // _.extend(guard(),     {name: 'guard2'}),
            _.extend(harvester(), {
                name: 'harvester2',
                sourceIndex: 1
            }),
            // _.extend(guard(),     {name: 'guard3'}),
            _.extend(harvester(), {name: 'harvester3'}),
            // _.extend(guard(),     {name: 'guard4'}),
            _.extend(harvester(), {
                name: 'harvester4',
                sourceIndex: 1
            }),
            // _.extend(guard(),    {name: 'guard5'}),
            _.extend(upgrader(), {name: 'upgrader1'}),
            _.extend(builder(),  {name: 'builder1'}),
            _.extend(upgrader(), {name: 'upgrader2'}),
            _.extend(builder(),  {name: 'builder2'}),
            _.extend(upgrader(), {name: 'upgrader3'}),
            _.extend(builder(),  {name: 'builder3'}),
        ]

        return opts.map(obj => super.createCreepType(obj));
	}

	runLinks(){
		var fromLink = Game.structures['585dc5f78d7270785de7f890'];
		var toLink1 = Game.structures['585dcc14d79a7fc4614ee0c0'];
		var toLink2 = Game.structures['585dd6639d25db137ae10956'];
		// if(_.random(0, 1) === 1){
				fromLink.transferEnergy(toLink1);
		// }else{
				// fromLink.transferEnergy(toLink2);
		// }
	}
}

module.exports = E77S46RoomController;



