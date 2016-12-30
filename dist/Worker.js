var util = require('util')

class Worker {

   constructor(creep, creepOpts={}){
      this.creep = creep;
      this.creepOpts = creepOpts;
   }

   doWork(){
      var inAssignedRoom = util().goToAssignedRoom(this.creep);
      if(!inAssignedRoom){ return; }
   }

   doIncompleteStatusWork(){
      return this.doWork();
   }

   doAttackStatusWork(){
      return this.doWork();
   }
}

module.exports = Worker;