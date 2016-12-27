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

        let {
            harvester,
            backUpHarvester,
            guard,
            builder,
            upgrader,
            carrier,
        } = this.standardCreepTypes;
        
        var opts = [
            _.extend(backUpHarvester, {name: 'backUpHarvester'}),
            _.extend(guard,     {name: 'guard1'}),
            _.extend(harvester, {name: 'harvester1'}),
            _.extend(guard,     {name: 'guard2'}),
            _.extend(harvester, {
                name: 'harvester2',
                sourceIndex: 1
            }),
            _.extend(guard,     {name: 'guard3'}),
            _.extend(harvester, {name: 'harvester3'}),
            _.extend(guard,     {name: 'guard4'}),
            _.extend(harvester, {
                name: 'harvester4',
                sourceIndex: 1
            }),
            _.extend(guard,    {name: 'guard5'}),
            _.extend(upgrader, {name: 'upgrader1'}),
            _.extend(builder,  {name: 'builder1'}),
            _.extend(carrier,  {name: 'carrier1'}),
            _.extend(upgrader, {name: 'upgrader2'}),
            _.extend(builder,  {name: 'builder2'}),
            _.extend(upgrader, {name: 'upgrader3'}),
            _.extend(builder,  {name: 'builder3'}),
            _.extend(upgrader, {
                name: 'upgrader4',
                condition: this.getMyConstructionSites().length === 0
            }),
            _.extend(upgrader, {
                name: 'upgrader5',
                condition: this.getMyConstructionSites().length === 0
            }),
            _.extend(upgrader, {
                name: 'upgrader6',
                condition: this.getMyConstructionSites().length === 0
            })
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



