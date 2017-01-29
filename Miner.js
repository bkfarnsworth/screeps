var util = require('util');
var Worker = require('Worker');

class Miner extends Worker {

   constructor(creep, creepOpts={}){
      super(creep, creepOpts);

      this.source = creepOpts.source;
      this.terminal = creepOpts.terminal;
      this.storage = creepOpts.storage;
   }

   doWork(){
      this.mineFromSourceOrDeposit();
   }

   get targetForDeposit(){
      if(_.sum(this.terminal.store) < this.terminal.storeCapacity){
         return this.terminal;
      }else{
         return this.storage;
      }
   }

   get mineralType(){
      return this.source.mineralType;
   }

   get mineralAmount(){
      return this.source.mineralAmount;
   }

   mineFromSourceOrDeposit(){
      var creep = this.creep;

      var lessThanCapacity = creep.carry[this.mineralType] < creep.carryCapacity || !(this.mineralType in creep.carry);

      if(lessThanCapacity && this.mineralAmount > 0){
         util.harvest(creep, {
            source: this.source
         });
      }else{
         util.giveToRecipient(creep, this.targetForDeposit, this.mineralType);
      }
   }
}

module.exports = Miner;