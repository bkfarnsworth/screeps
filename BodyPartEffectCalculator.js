class BodyPartEffectCalculator {

   get bodyPartBaseEffectMap(){
      var map = new Map();
      map.set(HEAL, HEAL_POWER);
      map.set(TOUGH, 1);//kind of faking tough because there is no base power for it
      return map;
   }

   getBoostMultiplier(bodyPart, action){
      return _.get(BOOSTS, `[${bodyPart.type}][${bodyPart.boost}][${action}]`, 1);
   }
      
   /*
      action is the specific action to caculate for
      for example, the bodypart could be work, the action could be repair
   */
   getEffect(bodyPart, action){
      var baseEffect = this.bodyPartBaseEffectMap.get(bodyPart.type);
      var boostMultiplier = this.getBoostMultiplier(bodyPart, action);
      return baseEffect * boostMultiplier; 
   }
}

module.exports = BodyPartEffectCalculator;