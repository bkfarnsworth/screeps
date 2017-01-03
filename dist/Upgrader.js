var util = require('util')
var Worker = require('Worker');

class Upgrader extends Worker {

    constructor(creep, creepOpts){
        super(creep, creepOpts);
    }

    doWork(){
      if(!super.doWork()){
         var creep = this.creep;
         util().gatherEnergyOr(creep, () => {
            var errCode = creep.upgradeController(creep.room.controller)
            if(errCode == ERR_NOT_IN_RANGE) {
               // change to claimController if I want to claim a new one - make sure you have the claim body part
               creep.moveToUsingCache(creep.room.controller);    
            }
         });
      }
	}
}

module.exports = Upgrader;