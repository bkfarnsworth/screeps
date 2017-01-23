var util = require('util')
var CreepConfig = require('CreepConfig');

class Worker {

   constructor(creep, creepOpts={}) {
      this.creep = creep;
      this.creepOpts = creepOpts;
   }

   doWork(status){
      var completedWork = false;//a way to know if the creep already did work through this super

      //commenting out recycle for now, because repairers will become upgraders
      // if(!this.creepOpts.condition || util.creepIsAboutToDie(this.creep, this.creepOpts)){
      //    this.recycle();
      //    completedWork = true;
      //    return completedWork;
      // }

      if(!this.creep){
         return false
      }

      var inAssignedRoom = util.goToAssignedRoom(this.creep);
      if(!inAssignedRoom){ 
         completedWork = true;
         return completedWork; 
      }

      if(this.creepOpts.extraTask && this.creepOpts.extraTask.condition){
         this.creepOpts.extraTask.work(this.creep);    
         completedWork = true;
         return completedWork;
      }

      return completedWork;
   }

   recycle(){
      var spawn = util.getSpawnForRoom(this.creep.room.name);
      if(spawn.recycleCreep(this.creep) == ERR_NOT_IN_RANGE) {
         this.creep.moveToUsingCache(spawn);
      }
   }
}

module.exports = Worker;