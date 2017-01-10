var RoomController = require('RoomController');
var util = require('util');

class E77S44RoomController extends RoomController {

	runRoom(opts){
		super.runRoom(opts);
		//custom
	}

	get room(){
		return util.farNorthRoom;
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
				giveToTowers: this.status === 'complete',
				bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
					percentOfSpawningPotential: 0.7,
					movePercent  : 0.1,
					carryPercent : 0.3,
					workPercent  : 0.6
				})
			}),
			_.extend(harvester(), {
				name: 'harvester2',
				sourceIndex: 1,
				bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
					percentOfSpawningPotential: 0.7,
					movePercent  : 0.1,
					carryPercent : 0.3,
					workPercent  : 0.6
				})
			}),
			_.extend(upgrader(), {
				name: 'upgrader1',
				bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
					percentOfSpawningPotential: 0.9,
					movePercent  : 0.2,
					carryPercent : 0.2,
					workPercent  : 0.6
				})
			}),
			//TODO: make the builder strong in coordination with how much construction there is to do...or I just manually do it...
			_.extend(builder(),  {name: 'builder1'}),
			//for now I am making a cheap builder because I just want to build a single wall
			// _.extend(builder(),  {
			// 	name: 'builder1',
			// 	bodyParts: [WORK, MOVE, CARRY]
			// }),
			_.extend(carrier(), {
			    name: 'carrier1',
			    bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
			        percentOfSpawningPotential: 2/5,
			        movePercent  : 0.5,
			        carryPercent : 0.5
			    })
			})
		]

		return opts.map(obj => super.createCreepType(obj));
	}

	runLinks(){

	}
}

module.exports = E77S44RoomController;


