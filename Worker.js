var util = require('util')
var CreepType = require('CreepType');

class Worker {

   constructor(creep, creepOpts={}) {
      this.creep = creep;
      this.creepOpts = creepOpts;
   }

   doWork(){
      var completedWork = false;//a way to know if the creep already did work through this super

      //commenting out the recycle stuff for now, because I'm not sure if it is working right 
      if(!this.creepOpts.condition || util.creepIsAboutToDie(this.creep, this.creepOpts)){
         this.recycle();
         completedWork = true;
         return completedWork;
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

   doIncompleteStatusWork(){
      return this.doWork();
   }

   doAttackStatusWork(){
      return this.doWork();
   }

   recycle(){
      var spawn = util.getSpawnForRoom(this.creep.room.name);
      if(spawn.recycleCreep(this.creep) == ERR_NOT_IN_RANGE) {
         this.creep.moveToUsingCache(spawn);
      }
   }
}

module.exports = Worker;