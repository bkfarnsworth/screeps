var util = require('util')

class EnergyConsumerMixin {

   constructor(strategy){
      this.strategy = strategy;
   }

   doWorkOrGatherEnergyAccordingToStrategy(creep, opts){
      if(this.strategy === 'storage'){
         //use the defaults
      }else if(this.strategy === 'spawningSources'){
         Object.assign(opts, {
            takeFromStorage: false
         })
      }else if(this.strategy === 'harvest'){
         Object.assign(opts, {
            takeFromStorage: false,
            takeFromSpawningSources: false
         })
      }

      return util.doWorkOrGatherEnergy(creep, opts);
   }
}

module.exports = EnergyConsumerMixin;