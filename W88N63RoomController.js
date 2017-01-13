var RoomController = require('RoomController');
var util = require('util');
var Tower = require('Tower');

class W88N63RoomController extends RoomController {

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

      var opts = [ 
         _.extend(backUpHarvester(), {name: 'backUpHarvester'}),
         _.extend(harvester(), {
            name: 'harvester1',
            giveToTowers: this.status === 'complete'
         }),
         _.extend(harvester(), {
            name: 'harvester2',
         }),
         _.extend(upgrader(), {
            name: 'upgrader1'
         }),
         _.extend(builder(),  {name: 'builder1'}),
         _.extend(harvester(), {
            name: 'harvester3',
         }),
         _.extend(upgrader(), {
            name: 'upgrader2'
         }),
         _.extend(builder(),  {name: 'builder2'}),
         _.extend(harvester(), {
            name: 'harvester4',
         }),
         _.extend(upgrader(), {
            name: 'upgrader3'
         }),
         _.extend(builder(),  {name: 'builder3'}),
         // _.extend(builder(),  {
         //    name: 'builder1',
         //    bodyParts: [WORK, MOVE, CARRY]
         // }),
         // _.extend(carrier(), {
         //    name: 'carrier1'
         // })
      ]

      return opts.map(obj => super.createCreepType(obj));
   }

   runLinks(){

   }

   runTowers(){
      
   }
}

module.exports = W88N63RoomController;


