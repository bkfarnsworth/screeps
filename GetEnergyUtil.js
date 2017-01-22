class GetEnergyUtil {
   static getCurrentEnergy(target){
      let currentEnergy;

      if(target instanceof StructureStorage || target instanceof StructureContainer){
         currentEnergy = 'store[' + RESOURCE_ENERGY + ']';
      }else if(target instanceof Creep){
         currentEnergy = 'carry[' + RESOURCE_ENERGY + ']';
      }else if(target instanceof Resource){
         currentEnergy = 'amount';
      }else{
         currentEnergy = 'energy';
      }

      return _.get(target, currentEnergy);
   }

   static getEnergyCapacity(target){
      let energyCapacity;

      if(target instanceof StructureStorage || target instanceof StructureContainer){
         energyCapacity = 'storeCapacity';
      }else if(target instanceof Creep){
         energyCapacity = 'carryCapacity';
      }else if(target instanceof Resource){
         energyCapacity = 'amount';//for dropped resources, it's always 100% of what it is
      }else{
         energyCapacity = 'energyCapacity';
      }

      return _.get(target, energyCapacity);
   }
}

module.exports = GetEnergyUtil;