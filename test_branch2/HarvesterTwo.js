var harvester = require('harvester')

module.exports = function (creep) {
	//point these harvesters at the second source
	harvester(creep, 1);
}