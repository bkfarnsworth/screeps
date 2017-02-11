var RoomController = require('RoomController');
var util = require('util');
var Tower = require('Tower');

class E57N86RoomController extends RoomController {

   constructor(){
      super()
      this.attackTarget = this.getAttackTarget();      
   }

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

   getCollectionStrategyForEnergyConsumers(){

      //only take from storage if there is one, and it's above the min threshold or we are under attack
      if(this.storage && (this.storage.store[RESOURCE_ENERGY] > 200000 || this.roomIsUnderAttack())){
         return 'storage';

      //only take from extensions etc if we have all the required creeps
      }else if(this.status === 'complete'){
         return 'spawningSources';

      //otherwise harvest for energy
      }else{
         return 'harvest';
      }
   }

   getHarvesterConfig(creepConfig={}, opts={}){
      // _.defaults(opts, {
      //    percentOfSpawningPotential: 0.6
      // });

      _.defaults(creepConfig, {
         bodyParts: util.getBodyPartsArray({
            WORK: 3,
            MOVE: 3,
            CARRY: 3
         }),
         extraTask: {
            condition: this.thereIsDroppedEnergy(),
            work: this.useHarvesterToGetDroppedEnergy.bind(this)
         }
      });

      return super.getHarvesterConfig(creepConfig, opts);
   }

   getUpgraderConfig(creepConfig={}, opts={}){
      _.defaults(opts, {
         percentOfSpawningPotential: 0.7
      });

      _.defaults(creepConfig, {
         energyCollectionStrategy: this.getCollectionStrategyForEnergyConsumers(),
         extraTask: {
            condition: this.towers.some(t => this.towerNeedsEnergy(t)),
            work: this.useCreepToFillTower.bind(this)
         }
      })

      return super.getUpgraderConfig(creepConfig, opts);
   }

   getRepairerConfig(creepConfig={}, opts={}){
      _.defaults(opts, {
         percentOfSpawningPotential: 0.7
      });

      _.defaults(creepConfig, {
         extraTask: {
            condition: this.towers.some(t => this.towerNeedsEnergy(t)),
            work: this.useCreepToFillTower.bind(this)
         }
      })

      return super.getRepairerConfig(creepConfig, opts);
   }

   getBuilderConfig(creepConfig={}, opts={}){
      _.defaults(opts, {
         percentOfSpawningPotential: 0.7
      });

      return super.getBuilderConfig(creepConfig, opts);
   }

   get creepConfigs(){

      var creepConfigs = [ 
         this.getBackUpHarvesterConfig({name: 'backUpHarvester'}),
         this.getHarvesterConfig({
            name: 'harvester1',
            source: this.westEnergySource
         }),
         this.getHarvesterConfig({
            name: 'harvester2',
            source: this.westEnergySource
         }),
         this.getHarvesterConfig({
            name: 'harvester3',
            source: this.eastEnergySource
         }),
         this.getHarvesterConfig({
            name: 'harvester4',
            source: this.eastEnergySource,
            // extraTask: {
            //    condition: true,
            //    work: this.useHarvesterToFillTerminal.bind(this)
            // }
         }),
         this.getGuardConfig({
            name: 'guard1',
            attackTarget: this.attackTarget
         }),
         this.getGuardConfig({
            name: 'guard2',
            attackTarget: this.attackTarget
         }),
         this.getGuardConfig({
            name: 'guard3',
            attackTarget: this.attackTarget
         }),
         this.getMinerConfig({
            name: 'miner1'
         }),
         this.getUpgraderConfig({name: 'upgrader1'}),
         this.getGuardConfig({
            name: 'guard4',
            attackTarget: this.attackTarget
         }),
         //only spawn the extra upgrader if we are getting too much extra energy
         this.getUpgraderConfig({
            name: 'upgrader2',
            condition: this.storage.store[RESOURCE_ENERGY] > 300000
         }),
         this.getGuardConfig({
            name: 'guard5',
            attackTarget: this.attackTarget
         }),
         this.getGuardConfig({
            name: 'guard6',
            attackTarget: this.attackTarget
         }),
         // this.getRepairerConfig({
         //    name: 'repairer1',
         //    condition: this.roomIsUnderAttack()
         // }),
         // this.getRepairerConfig({
         //    name: 'repairer2',
         //    condition: this.roomIsUnderAttack()
         // }),
         this.getDemomanConfig({
            name: 'demoman1',
            condition: Boolean(util.getHarvestWall(this.room))
         }),
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

   get westEnergySource(){
      return Game.getObjectById('5873bda811e3e4361b4d9938');
   }

   get eastEnergySource(){
      return Game.getObjectById('5873bda811e3e4361b4d9939');
   }

   get tower1(){
      return Game.structures['587db205bc1d5f961f75421c'];
   }

   get tower2(){
      return Game.structures['5883ccf09d596dcc20aca8fe'];
   }

   get tower3(){
      return Game.structures['589e6c4a9238d58107c5c563'];
   }

   get towers(){
      return [this.tower1, this.tower2, this.tower3];
   }

   towerNeedsEnergy(tower){
      return tower.energy < tower.energyCapacity * 0.7;
   }

   runTowers(){

      var defenseStrategy = 'none';
      if(this.roomIsUnderAttack()){
         var healRateTooHigh = this.enemyHealRateIsTooHigh();
         if(healRateTooHigh){
            defenseStrategy = 'repair';
         }else if(!healRateTooHigh && this.attackersInPosition()){
            defenseStrategy = 'attack';
         }
      }

      this.towers.forEach(tower => Tower(tower, defenseStrategy, this.attackTarget));
   }

   attackersInPosition(){
      return this.getGuards().every(guard => {
         console.log('guard: ', guard);
         return guard.pos.inRangeTo(this.attackTarget, 3)
      });
   }

   getAttackTarget(){
      //to find an ememy, start at the middle tile and go to the edges
      var middleTile = new RoomPosition(1, 31, this.room.name);

      //get all hostiles
      var hostiles = this.getHostiles();
      hostiles.sort((h1, h2) => {

         //sort first by x position - so creeps that have broken through the wall
         if(h1.pos.x > h2.pos.x){
            return 1
         }else if(h1.pos.x < h2.pos.x){
            return -1
         }else if(h1.pos.x === h2.pos.x){

            //then sort by distance from the middle tile
            var h1Range = h1.pos.getRangeTo(middleTile);
            var h2Range = h2.pos.getRangeTo(middleTile);
            if(h1Range < h2Range){
               return 1;
            }else if(h1Range > h2Range){
               return -1
            }else if(h1Range === h2Range){

               //then finally is still a tie, return the one with the higher y value to be deterministic
               if(h1.pos.y > h2.pos.y){
                  return 1
               }else if(h1.pos.y < h2.pos.y){
                  return -1
               }else{
                  return 0;
               }
            }
         }
      });

      return hostiles[0];
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

   useHarvesterToFillTerminal(creep){
      util.doWorkOtherwise(creep, {
         workTarget: this.southLink,
         workFunc: util.getEnergyFromRoomObject.bind(util, creep, this.southLink),
         otherwiseTarget: this.terminal,
         otherwiseFunc: util.giveEnergyToRecipient.bind(util, creep, this.terminal),
         polarity: 'positive'
      })
   }

   get westLink(){
      return Game.structures['5883e591435d078c5a036fd1'];
   }

   get centralLink(){
      return Game.structures['5883d0e3443baf673cd0d1d3'];
   }

   get eastLink(){
      return Game.structures['589e7498e4822f7f2c8cdb4e'];
   }

   get southLink(){
      return Game.structures['589e72d6dd2566f05a55c82d'];
   }

   runLinks(){
      if(this.southLink.energy < this.southLink.energyCapacity - 100){
         this.runLink(this.centralLink, this.southLink);
         this.runLink(this.eastLink, this.southLink);   
      }else if(this.westLink.energy < this.westLink.energyCapacity - 100){
         this.runLink(this.centralLink, this.westLink);
         this.runLink(this.eastLink, this.westLink);   
      }
   }

   runLink(fromLink, toLink){
      //transfer whatever is smaller - the energy in the fromLink, or the remaining energy capacity of the toLink
      var energyToTransfer = Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy);
      return fromLink.transferEnergy(toLink, energyToTransfer);
   }
}

module.exports = E57N86RoomController;


