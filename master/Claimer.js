var util = require('util');

module.exports = function (creep) {

	// 'E77S44'
	util().gatherEnergyOr(creep, () => {

		// if(creep.room.name === 'E76S45'){
			// return
			// var flags = creep.room.find(FIND_FLAGS, {
			//     filter: flag => flag.color === COLOR_WHITE
			// });

			// creep.move(RIGHT)

			// var errCode = creep.moveTo(new RoomPosition(30, 47, 'E76S45'));
			// console.log('ddderrCode: ', errCode);
			// return
		// }

		// return 
		var inRoom = util().goToRoom(util().farNorthRoomName, creep);
		if(!inRoom){ return; }

		var errCode = creep.upgradeController(creep.room.controller)
		if(errCode == ERR_NOT_IN_RANGE) {
			creep.moveToUsingCache(creep.room.controller);    
		}
		
		//if we alrady claimed it, start upgrading it
		// if(errCode !== 0){
		// 	creep.upgradeController(creep.room.controller)
		// }
	}, {allowHarvesting: true});
}