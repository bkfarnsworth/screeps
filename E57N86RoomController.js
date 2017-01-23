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

   getHarvesterConfig(creepConfig={}, opts={}){
      _.defaults(opts, {
         percentOfSpawningPotential: 0.7
      });

      _.defaults(creepConfig, {
         extraTask: {
            condition: this.thereIsDroppedEnergy(),
            work: this.useHarvesterToGetDroppedEnergy.bind(this)
         }
      });

      return super.getHarvesterConfig(creepConfig, opts);
   }

   getUpgraderConfig(creepConfig={}, opts={}){
      _.defaults(opts, {
      });

      _.defaults(creepConfig, {
         //EVEN THOUGH THE CREEPS ARE MORE EFFECIENT AT REPAIRING, WE WANT TO REPAIR AS MANY POINTS AS WE CAN PER TICK
         extraTask: {
            condition: this.towerNeedsEnergy(this.tower1) || this.towerNeedsEnergy(this.tower2),
            work: this.useCreepToFillTower.bind(this)
         }
      })

      return super.getUpgraderConfig(creepConfig, opts);
   }

   getRepairerConfig(creepConfig={}, opts={}){
      _.defaults(opts, {
      });

      _.defaults(creepConfig, {
         extraTask: {
            condition: this.towerNeedsEnergy(this.tower1) || this.towerNeedsEnergy(this.tower2),
            work: this.useCreepToFillTower.bind(this)
         }
      })

      return super.getRepairerConfig(creepConfig, opts);
   }

   get creepConfigs(){

      var creepConfigs = [ 
         this.getBackUpHarvesterConfig({name: 'backUpHarvester'}),
         this.getHarvesterConfig({
            name: 'harvester1'
         }),
         this.getHarvesterConfig({
            name: 'harvester2'
         }),
         this.getHarvesterConfig({
            name: 'harvester3',
            sourceIndex: 1
         }),
         this.getUpgraderConfig({name: 'upgrader1'}),
         this.getUpgraderConfig({name: 'upgrader2'}),
         this.getRepairerConfig({
            name: 'repairer1',
            condition: this.roomIsUnderAttack()
         }),
         this.getRepairerConfig({
            name: 'repairer2',
            condition: this.roomIsUnderAttack()
         }),
         this.getDemomanConfig({name: 'demoman1'}),
         this.getBuilderConfig({name: 'builder1'}),
         this.getBuilderConfig({name: 'builder2'}),
         //cheap builder
         // this.getBuilderConfig(builder(),  {
         //    name: 'builder1',
         //    bodyParts: [WORK, MOVE, CARRY]
         // }),
      ]

      return creepConfigs.map(obj => super.createCreepConfig(obj));
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


