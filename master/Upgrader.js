var util = require('util');

module.exports = function (creep) {

	var inAssignedRoom = util().goToAssignedRoom(creep);
// 
	// console.log('creep: ', creep);
	// console.log('inAssignedRoom: ', inAssignedRoom);

	if(!inAssignedRoom){ return; }


	
	util().gatherEnergyOr(creep, () => {
		var errCode = creep.upgradeController(creep.room.controller)
		if(errCode == ERR_NOT_IN_RANGE) {
				// change to claimController if I want to claim a new one - make sure you have the claim body part

				// console.log('moving to controller');

				creep.moveToUsingCache(creep.room.controller);    
		}
	}, {allowHarvesting: true});
}