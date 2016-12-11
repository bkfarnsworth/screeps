module.exports = function (creep) {
    

    
    if(creep.room.name === constants().milesRoom){
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if(targets.length) {
            
            //try a ranged attack first
            // if(creep.getActiveBodyparts(RANGED_ATTACK)){
                
            // }
            // if(creep.rangedAttack(targets[0]) == ERR_NOT_IN_RANGE ) {
    	       // creep.moveTo(targets[0]);		
    	   // }
            
    	   // if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE ) {
    	       // creep.moveTo(targets[0]);		
    	   // }
        }
    }else{
        // var exit = FIND_EXIT_BOTTOM;
        // creep.moveTo(creep.pos.findClosest(exit));
         creep.moveTo(10, 42)
        
    }
}