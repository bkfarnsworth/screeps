
const INITIAL_THROTTLE_POINT = 0.4;
const ADJUSTMENT_FREQUENCY = 50;//adjust every 10 ticks; this value is highly dependent on the decay rate for the averageCPUPerTick calculation
const ADJUSTMENT_VALUE = 0.01;
const MAX_THROTTLE = 1;
const MIN_THROTTLE = 0;

class ThrottleService {

   static shouldThrottleRoom(){
      return _.random(1, 100) > Memory.throttleRatio * 100
   }

   static adjustThrottleRatio(){

      if(_.isUndefined(Memory.throttleRatio)){
         Memory.throttleRatio = INITIAL_THROTTLE_POINT;
      }

      if(_.random(1, ADJUSTMENT_FREQUENCY) === 1){
         console.log('adjusting');
         if(Memory.averageCPUPerTick > Game.cpu.limit){
            Memory.throttleRatio += ADJUSTMENT_VALUE;
         }else if(Memory.averageCPUPerTick < Game.cpu.limit){
            Memory.throttleRatio -= ADJUSTMENT_VALUE;
         }
      }else{
         console.log('not adjusting');
      }

      //cap between min, max
      if(Memory.throttleRatio < MIN_THROTTLE){
         Memory.throttleRatio = MIN_THROTTLE;
      }else if(Memory.throttleRatio > MAX_THROTTLE){
         Memory.throttleRatio = MAX_THROTTLE;
      }
   }
}

module.exports = ThrottleService;