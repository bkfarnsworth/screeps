var harvester = require('harvester')

module.exports = function (creep) {
	//point these harvesters at the second source
	harvester(creep, {
		sourceIndex: 1, 
		useStorage: false,
		giveToTowers: creep.room.status === 'complete'
	});
}