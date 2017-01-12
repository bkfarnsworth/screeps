var RoomController = require('RoomController');
var util = require('util');
var Tower = require('Tower');

class E77S47RoomController extends RoomController {

	runRoom(opts){
		super.runRoom(opts);
		//custom
	}

	get room(){
		return util.southRoom;
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
			_.extend(upgrader(), {
				name: 'upgrader1',
				extraTask: {
					condition: this.westTower.energy < this.westTower.energyCapacity,
					work: this.useUpgraderToFillTower.bind(this)
				}
			}),
			_.extend(builder(),  {
				name: 'builder1',
				// extraTask: {
				// 	condition: this.eastTower.energy < 700,
				// 	work: this.useBuilderToFillTower.bind(this)
				// }
			}),
			_.extend(carrier(), {
			   name: 'carrier1'
			})
		]

		return opts.map(obj => super.createCreepType(obj));
	}

	get eastLink(){
		return Game.structures['585b6ab33962b71d57030d66'];
	}

	get centerLink(){
		return Game.structures['5874aaf932070d0273cd8c0e'];
	}

	get westLink(){
		return Game.structures['585b75504b207b74496d64b5'];
	}

	runLinks(){
		this.centerLink.transferEnergy(this.westLink);
		this.eastLink.transferEnergy(this.westLink);
	}

	get eastTower(){
		return Game.structures['5874798a95b1c94623b2aa90'];
	}

	get westTower(){
		return Game.structures['586ac10a8eb8754a62fc8d2f'];
	}

	runTowers(){

		//use the eastTower only for attacking
		if(this.roomIsUnderAttack()){
			Tower(this.westTower);
		}

		if(_.random(1, 3) === 1 || this.roomIsUnderAttack()){
			Tower(this.eastTower);
		}
	}

	useUpgraderToFillTower(creep){
		util.doWorkOrGatherEnergy(creep, {
			workTarget: this.westTower,
			workFunc: util.giveEnergyToRecipient.bind(util, creep, this.westTower)
		});
	}

	// useBuilderToFillTower(creep){
	// 	util.doWorkOrGatherEnergy(creep, {
	// 		workTarget: this.eastTower,
	// 		workFunc: util.giveEnergyToRecipient.bind(util, creep, this.eastTower)
	// 	});
	// }
}

module.exports = E77S47RoomController;