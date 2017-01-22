var GetEnergyUtil = require('GetEnergyUtil');

var debugMode = false;

/*
   known limitations:
      The static methods won't take into account neighbors
         I could make this where instead of passing in the best target, we have helpers that just know to get energy, and they pass in all possiblitiies
      It won't take into account if the energy will be done by the time the creep gets there
*/
class DistanceValueCalculator {

   constructor(pathCalculator){
      this.pathCalculator = pathCalculator;
   }

   /*
      pvo (posibilityValueObj) is like 
      {
         target
         valueFunc
      }
   */
   getBestDistanceValue(creep, possibilityValueObjs){

      if(debugMode){
         console.log();
         console.log('Distance Value Report');
         console.log('creep: ', creep);
      }

      var distanceValueObjs = possibilityValueObjs.map(pvo => {
         var distanceValue = this.getDistanceValueForTarget(creep, pvo)
         if(debugMode){
            console.log('pvo.target: ', pvo.target);
            console.log('distanceValue: ', distanceValue);
         }
         return {
            target: pvo.target,
            distanceValue 
         }
      });

      var best = _.max(distanceValueObjs, 'distanceValue');
      return _.get(best, 'target');
   }

   getDistanceValueForTarget(creep, pvo, opts={}){

      _.defaults(opts, {
         otherPossibilities: [],
         alternateStartPvo: undefined,
      });

      var start = opts.alternateStartPvo ? opts.alternateStartPvo.target : creep;

      var distanceToTarget = this.pathCalculator(start, pvo.target).length;
      var valueOfTarget = pvo.valueFunc(creep, pvo.target);

      if(debugMode){
         console.log('distanceToTarget: ', distanceToTarget);
         console.log('valueOfTarget: ', valueOfTarget);
      }

      var baseDistanceValue = valueOfTarget / distanceToTarget;
      var totalDistanceValue = baseDistanceValue;

      opts.otherPossibilities.forEach(op => {
         totalDistanceValue += this.getDistanceValueForTarget(creep, op, {
            alternateStartPos: pvo.target
         });
      });

      return totalDistanceValue;
   }

   static fillUpOnEnergyValueFunc(creep, target){
      //we want to return the amount of energy the target has, up to the amountOfEnergyNeeded
      var targetEnergy = GetEnergyUtil.getCurrentEnergy(target);
      var amountOfEnergyNeeded = creep.carryCapacity - creep.carry.energy;
      return amountOfEnergyNeeded < targetEnergy ? amountOfEnergyNeeded : targetEnergy;
   }

   static giveEnergyValueFunc(creep, target){
      //we want to return the amount of energy the target can actually take
      var targetEnergy = GetEnergyUtil.getCurrentEnergy(target);
      var targetCapacity = GetEnergyUtil.getEnergyCapacity(target);
      var capacityToReceive = targetCapacity - targetEnergy;
      return capacityToReceive < creep.carry.energy ? capacityToReceive : creep.carry.energy;
   }
}

module.exports = DistanceValueCalculator;