var constants = require('Constants');

module.exports = function (creep) {
    
    console.log(constants().milesRoom)
    console.log(creep.room.name)
    
    if(creep.room.name === constants().milesRoom){
        
        var targets = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: function(creep) {
                return creep.pos.x < 9 && creep.pos.y <= 8 
            }
        });
    
        if(targets.length) {
            
            //try a ranged attack first
            // if(creep.getActiveBodyparts(RANGED_ATTACK)){
                
            // }
            // if(creep.rangedAttack(targets[0]) == ERR_NOT_IN_RANGE ) {
    	       // creep.moveTo(targets[0]);		
    	   // }
            
    	    if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE ) {
    	        creep.moveTo(targets[0]);		
    	    }
        }else{
            creep.moveTo(5, 4)
        }
    }else{
        var exit = FIND_EXIT_BOTTOM;
        creep.moveTo(creep.pos.findClosest(exit));
    }
}