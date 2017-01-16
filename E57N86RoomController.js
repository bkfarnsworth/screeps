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

      let backUpHarvester = () => _.clone(this.standardCreepTypes.backUpHarvester);
      let harvester = () => _.clone(this.standardCreepTypes.harvester);
      let guard = () => _.clone(this.standardCreepTypes.guard);
      let builder = () => _.clone(this.standardCreepTypes.builder);
      let upgrader = () => _.clone(this.standardCreepTypes.upgrader);
      let carrier = () => _.clone(this.standardCreepTypes.carrier);
      let repairer = () => _.clone(this.standardCreepTypes.repairer);

      var opts = [ 
         _.extend(backUpHarvester(), {name: 'backUpHarvester'}),
         _.extend(harvester(), {
            name: 'harvester1',
            giveToTowers: this.status === 'complete',
         }),
         _.extend(harvester(), {
            name: 'harvester2',
         }),
         _.extend(harvester(), {
            name: 'harvester3',
         }),
         _.extend(harvester(), {
            name: 'harvester4',
            sourceIndex: 1
         }),
         _.extend(harvester(), {
            name: 'harvester5',
            sourceIndex: 1
         }),
         _.extend(upgrader(), {name: 'upgrader1'}),
         _.extend(builder(),  {name: 'builder1'}),
         _.extend(repairer(), {name: 'repairer1'}),
         _.extend(upgrader(), {name: 'upgrader2' }),
         _.extend(builder(),  {name: 'builder2'}),
         _.extend(upgrader(), {name: 'upgrader3' }),
         _.extend(upgrader(), {name: 'upgrader4' }),
         // _.extend(upgrader(), {name: 'upgrader5' }),
         // _.extend(upgrader(), {name: 'upgrader6' }),
         // _.extend(upgrader(), {name: 'upgrader7' }),
         // _.extend(repairer(), {name: 'repairer2'}),
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

   runLinks(){

   }

   runTowers(){
      
   }
}

module.exports = E57N86RoomController;


