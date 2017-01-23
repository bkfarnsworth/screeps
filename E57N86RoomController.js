var RoomController = require('RoomController');
var util = require('util');
var Tower = require('Tower');

class E57N86RoomController extends RoomController {

   runRoom(opts){
      super.runRoom(opts);
      //custom
   }

   get room(){
      return util.room1;
   }

   get spawn(){
      return Game.spawns.Spawn1;
   }

   get creepTypes(){

      //I'm not sure why this are all anon functions, but I think I had to for some reason
      let backUpHarvester = () => _.clone(this.standardCreepTypes.backUpHarvester);
      let guard = () => _.clone(this.standardCreepTypes.guard);
      let builder = () => _.clone(this.standardCreepTypes.builder);
      let carrier = () => _.clone(this.standardCreepTypes.carrier);
      let demoman = () => _.clone(this.standardCreepTypes.demoman);

      let harvester = () => {
         var clone = _.clone(this.standardCreepTypes.harvester);
         return _.extend(clone, {
            extraTask: {
               condition: this.thereIsDroppedEnergy(),
               work: this.useHarvesterToGetDroppedEnergy.bind(this)
            }
         });
      }

      //EVEN THOUGH THE CREEPS ARE MORE EFFECIENT AT REPAIRING, WE WANT TO REPAIR AS MANY POINTS AS WE CAN PER TICK
      let upgrader = () => {
         var clone = _.clone(this.standardCreepTypes.upgrader);
         return _.extend(clone, {
            extraTask: {
               condition: this.towerNeedsEnergy(this.tower1) || this.towerNeedsEnergy(this.tower2),
               work: this.useCreepToFillTower.bind(this)
            }
         });
      }

      let repairer = () => {
         var clone = _.clone(this.standardCreepTypes.repairer);
         return _.extend(clone, {
            extraTask: {
               condition: this.towerNeedsEnergy(this.tower1) || this.towerNeedsEnergy(this.tower2),
               work: this.useCreepToFillTower.bind(this)
            }
         });
      }

      var opts = [ 
         _.extend(backUpHarvester(), {name: 'backUpHarvester'}),
         _.extend(harvester(), {
            name: 'harvester1'
         }),
         _.extend(harvester(), {
            name: 'harvester2',
            sourceIndex: 1
         }),
         _.extend(harvester(), {
            name: 'harvester3',
            sourceIndex: 1
         }),
         _.extend(upgrader(), {name: 'upgrader1'}),
         _.extend(builder(),  {name: 'builder1'}),
         _.extend(demoman(),  {name: 'demoman1'}),
         _.extend(repairer(), {
            name: 'repairer1',
            condition: this.roomIsUnderAttack()
         }),
         // _.extend(upgrader(), {name: 'upgrader2' }),
         // _.extend(builder(),  {name: 'builder2'}),
         // _.extend(upgrader(), {name: 'upgrader3' }),
         // _.extend(upgrader(), {name: 'upgrader4' }),

         //for now, instead of attackers, let's just strengthen the wall a ton if we are under attack
         _.extend(repairer(), {
            name: 'repairer2',
            condition: this.roomIsUnderAttack()
         }),


         // _.extend(carrier(), {
         //    name: 'carrier1'
         // })

         //cheap builder
         // _.extend(builder(),  {
         //    name: 'builder1',
         //    bodyParts: [WORK, MOVE, CARRY]
         // }),
      ]

      return opts.map(obj => super.createCreepType(obj));
   }

   get tower1(){
      return Game.structures['587db205bc1d5f961f75421c'];
   }

   get tower2(){
      return Game.structures['5883ccf09d596dcc20aca8fe'];
   }

   get towers(){
      return [this.tower1, this.tower2];
   }

   towerNeedsEnergy(tower){
      return tower.energy < tower.energyCapacity * 0.7;
   }

   runTowers(){

      var defenseStrategy = 'none';
      if(this.roomIsUnderAttack()){
         defenseStrategy = this.defenseManager.getDefenseStrategy(this);
      }

      this.towers.forEach(tower => Tower(tower, defenseStrategy));
   }

   useCreepToFillTower(creep){
      var towerWithLeast = _.min(this.towers, 'energy');
      util.doWorkOrGatherEnergy(creep, {
         status: this.status,
         workTarget: towerWithLeast,
         workFunc: util.giveEnergyToRecipient.bind(util, creep, towerWithLeast)
      });
   }

   thereIsDroppedEnergy(){
      return Boolean(this.room.find(FIND_DROPPED_ENERGY).filter(e => e.amount > 200 && e.pos.x !== 1).length);
   }

   useHarvesterToGetDroppedEnergy(creep){
      var energy = this.room.find(FIND_DROPPED_ENERGY).filter(e => e.amount > 200 && e.pos.x !== 1)[0];
      var bestEnergyRecipient = util.getBestEnergyRecipient(creep);

      util.doWorkOtherwise(creep, {
         workTarget: energy,
         workFunc: util.getEnergyFromRoomObject.bind(util, creep, energy),
         otherwiseTarget: bestEnergyRecipient,
         otherwiseFunc: util.giveEnergyToRecipient.bind(util, creep, bestEnergyRecipient),
         polarity: 'positive'
      })
   }

   get westLink(){
      return Game.structures['5883e591435d078c5a036fd1'];
   }

   get centralLink(){
      return Game.structures['5883d0e3443baf673cd0d1d3'];
   }

   runLinks(){
      this.centralLink.transferEnergy(this.westLink);
   }
}

module.exports = E57N86RoomController;


