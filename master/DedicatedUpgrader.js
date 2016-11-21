var util = require('util')

module.exports = function (creep, status) {
    
    
    // console.log('fdsafdsa1')
    
    var upgradeCode;
    if(status === 'complete'){
        upgradeCode = creep.upgradeController(creep.room.controller);
    }
    
    // console.log(upgradeCode)
    
	if(creep.room.controller) {
        if(upgradeCode != OK) {
            // console.log('fdsafdsa')
            creep.moveTo(creep.room.controller);    
        }
	}			
}