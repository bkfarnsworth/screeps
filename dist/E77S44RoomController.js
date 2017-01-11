var RoomController = require('RoomController');
var util = require('util');
var Tower = require('Tower');

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
				}),
				extraTask: {
					condition: this.southTower.energy < this.southTower.energyCapacity,
					work: this.useUpgraderToFillTower.bind(this)
				}
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

	get northLink(){
		return Game.structures['5874cededdf80942544076a0'];
	}

	get southLink(){
		return Game.structures['5874c880661fbca138b07e56'];
	}

	runLinks(){
		this.northLink.transferEnergy(this.southLink);
	}

	get northTower(){
		return Game.structures['586adf0fe12f6a76227687ca'];
	}

	get southTower(){
		return Game.structures['5874967901c13b673dda66e9'];
	}

	runTowers(){

		if(this.roomIsUnderAttack()){
			Tower(this.southTower);
		}

		if(_.random(1, 3) === 1 || this.roomIsUnderAttack()){
			Tower(this.northTower);
		}
	}

	useUpgraderToFillTower(creep){
		util.doWorkOrGatherEnergy(creep, {
			workTarget: this.southTower,
			workFunc: util.giveEnergyToRecipient.bind(util, creep, this.southTower)
		});
	}
}

module.exports = E77S44RoomController;


