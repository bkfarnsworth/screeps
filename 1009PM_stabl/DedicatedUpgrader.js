var util = require('util')

module.exports = function (creep) {
    
    
    // console.log('fdsafdsa1')
    var upgradeCode = creep.upgradeController(creep.room.controller);
    
    // console.log(upgradeCode)
    
	if(creep.room.controller) {
        if(upgradeCode != OK) {
            // console.log('fdsafdsa')
            creep.moveTo(creep.room.controller);    
        }
	}			
}