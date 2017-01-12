
module.exports = function(config) {

   if(config.cli) {
       config.cli.on('cliSandbox', function(sandbox) {
           sandbox.test = function() {

            //to see everything
            // sandbox.print(config) 

            // sandbox.print(config.common.storage)

               var creep = {
                   name: 'test',
                   x: 23,
                   y: 23,
                   body: [
                     { type: 'carry', hits: 100},
                     { type: 'work', hits: 100},
                     { type: 'move', hits: 100}
                   ],
                   energy: 100,
                   energyCapacity: 100,
                   type: 'creep',
                   room: 'W8N3',
                   user: 'd9a70d66d19daa5',
                   hits: 500,
                   hitsMax: 500,
                   spawning: false,
                   fatigue: 0,
                   notifyWhenAttacked: true
               };

               config.common.storage.db['rooms.objects'].insert(creep);

               sandbox.print('This is the test!');
               return 'Test result';
           };
       });
   }


};






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
				giveToTowers: this.status === 'complete'
			}),
			_.extend(harvester(), {
				name: 'harvester2',
				sourceIndex: 1
			}),
			_.extend(upgrader(), {
				name: 'upgrader1',
				extraTask: {
					condition: this.southTower.energy < this.southTower.energyCapacity,
					work: this.useUpgraderToFillTower.bind(this)
				}
			}),
			_.extend(builder(),  {name: 'builder1'}),
			//TODO: make the builder strong in coordination with how much construction there is to do...or I just manually do it...
			//for now I am making a cheap builder because I just want to build a single wall
			// _.extend(builder(),  {
			// 	name: 'builder1',
			// 	bodyParts: [WORK, MOVE, CARRY]
			// }),
			_.extend(carrier(), {
			   name: 'carrier1'
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


