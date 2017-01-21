class DistanceValueCalculator {




   constructor(opts){
      this.creep          = opts.creep;
      this.workTarget     = opts.workTarget;
      this.nonWorkTarget  = opts.nonWorkTarget;
      this.polarity       = opts.polarity;
      this.pathCalculator = opts.pathCalculator;








   }

   get polarityList(){
      return [
         {
            type: StructureController,
            polarity: 'negative'
         },
         {
            type: Source
         }


      ];
   }





   //possible targets = controller, energy sources, sources for harvesters.  you tell us what the possible is, and we will give you the distanceValue of each


   // and make the distance value of each multipled by the distance value of nearby things.
      //so two extensions near each other would be worth 50 * steps + 50 * incremental steps.  because it is not that much more.
      //for now we aren't going to care about prediciting if it will be there when the creeps arrives etc.

   possibilities will be an object like {
      target: something,
      valueFunc: () => {}
   }


   //valueFunc will be 

   //THESE COULD ALSO BE STATIC METHODS ON THIS CLASS

   //say it is a controller, you would provide a method like
   (creep, target) => {
      return creep.carryCapacity
   }


   //one problem with this algorithm is that it doesn't persist the energy needed as it looks at neighbors...known issue

   //for an upgrader and a controller it would be something like
   (creep, target) => {
      var amountOfEnergyNeeded = creep.carryCapacity - creep.carry.energy;


      //we want to return the amount of energy the target has, up to the amountOfEnergyNeeded
      return amountOfEnergyNeeded < target.energy ? amountOfEnergyNeeded : target.energy;
   }





   getBestDisanceValue(creep, possibilities){


      var bestDistanceValue = 0;
      var bestPossibility = possibilities[0];

      possibilities.forEach(p => {
         var distanceValue = this.getDistanceValueForTarget(creep, p);
         if(distanceValue > best){
            bestDistanceValue = distanceValue;
            bestPossibility = p;
         }
      });

      return bestPossibility;
   }


   //so plaority is passed in 

   //so if polarity is positive, it needs to treat source as positive and extensions as negative
   //if pol is negative, it needs to treat extensions as positive and controller as negative

   getDistanceValueForTarget(creep, target, otherPossibilities){
      var distanceToTarget = this.pathCalculator(creep, target);
      var valueOfTarget = this.getValueForTarget(creep, target);

      var bastDistanceValue = valueOfTarget / distanceToTarget;


      //for eacha other
         //get the value of it
         //get the distance from teh target to it
         //get the distance value..if it's really far away then it will be very small, so there is no problem adding them all together

         //so add that to the base, and loop again


      return bastDistanceValue + all other relative distance values;
   }





   getValueForTarget(creep, target){

      controller we need to know how much 

      if(target === negative){
         check creeps carry
      }

      else

         check creeps carryCapacity






   }









   creepShouldWork(){
      return this.getDistanceValueOfWorking() > this.getDistanceValueOfNotWorking();
   }

   getDistanceValueOfWorking(){
      return this.getValueOfWorking() / this.getDistanceToWork();
   }

   getDistanceValueOfNotWorking(){
      return this.getValueOfNotWorking() / this.getDistanceToNonWorkTarget();
   }

   getValueOfWorking(){
      if(this.polarity === 'negative'){
         return this.creep.carry.energy;
      }else if(this.polarity === 'positive'){
         return this.creep.carryCapacity - this.creep.carry.energy
      }
   }

   getValueOfNotWorking(){
      if(this.polarity === 'negative'){
         return this.creep.carryCapacity - this.creep.carry.energy
      }else if(this.polarity === 'positive'){
         return this.creep.carry.energy
      }
   }

   getDistanceToWork(){
      return this.getDistanceToTarget(this.workTarget);
   }

   getDistanceToNonWorkTarget(){
      return this.getDistanceToTarget(this.nonWorkTarget);
   }

   getDistanceToTarget(target){
      return this.pathCalculator(this.creep, target);
   }
}

module.exports = DistanceValueCalculator;