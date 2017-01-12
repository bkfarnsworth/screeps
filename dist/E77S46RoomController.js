var RoomController = require('RoomController');
var util = require('util');
var Tower = require('Tower');

class E77S46RoomController extends RoomController {

	runRoom(opts){
		super.runRoom(opts);
		//custom
	}

	get room(){
		return util.northRoom;
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
            _.extend(harvester(), {
                name: 'harvester1',
                giveToTowers: this.status === 'complete',
                extraTask: {
                    condition: this.southTower.energy < this.southTower.energyCapacity,
                    work: this.useHarvesterToFillTower.bind(this)
                }
            }),
            _.extend(harvester(), {
                name: 'harvester2',
                sourceIndex: 1
            }),
            _.extend(upgrader(), {name: 'upgrader1'}),
            _.extend(builder(),  {name: 'builder1'}),
            _.extend(carrier(), {
               name: 'carrier1'
            })
        ]

        return opts.map(obj => super.createCreepType(obj));
	}

	runLinks(){
		var fromLink = Game.structures['586acc5056099a9c099bd3f0'];
		var toLink1 = Game.structures['585dcc14d79a7fc4614ee0c0'];
		// var toLink2 = Game.structures['585dd6639d25db137ae10956'];
		// if(_.random(0, 1) === 1){
				fromLink.transferEnergy(toLink1);
		// }else{
				// fromLink.transferEnergy(toLink2);
		// }
	}

    get northTower(){
        return Game.structures['586adf917e4601912c3c0388'];
    }

    get southTower(){
        return Game.structures['586ab52db1940ad704a5fbc2'];
    }

    runTowers(){

        //use one of the towers only for attacking
        if(this.roomIsUnderAttack()){
            Tower(this.southTower);
        }

        if(_.random(1, 3) === 1 || this.roomIsUnderAttack()){
            Tower(this.northTower);
        }
    }

    useHarvesterToFillTower(creep){
        util.doWorkOrGatherEnergy(creep, {
            workTarget: this.southTower,
            workFunc: util.giveEnergyToRecipient.bind(util, creep, this.southTower)
        });
    }
}

module.exports = E77S46RoomController;



