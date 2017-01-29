var util = require('util');

class Miner extends Worker {

   constructor(creep, creepOpts={}){
      super(creep, creepOpts);

      this.target = creepOpts.target;
      this.terminal = creepOpts.terminal;
      this.storage = creepOpts.storage;
   }

   doWork(){
      this.mineFromTargetOrDeposit();
   }

   mineFromTargetOrDeposit(){

      

      
      util.doWorkOtherwise(this.creep, {
         workTarget    : this.target,
         workFunc      : util.harvest.bind(util, creep, {source: this.source}),
         otherwiseFunc : util.giveEnergyToRecipient.bind(util, creep, bestEnergyRecipientForWork),
         otherwiseTarget: bestEnergyRecipientForWork,
         polarity      : 'positive'
      });
   }


}

module.exports = Miner;