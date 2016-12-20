var util = require('util')

module.exports = function (creep, status) {
    
    
    // console.log('fdsafdsa1')
    
    var upgradeCode;
    if(creep.room.status === 'complete'){
        upgradeCode = creep.upgradeController(creep.room.controller);
    }
    
    // console.log(upgradeCode)
    
	if(creep.room.controller) {
        if(upgradeCode != OK) {
            // console.log('fdsafdsa')
            creep.moveToUsingCache(creep.room.controller);    
        }
	}			
}