var util = require('util')

module.exports = function (creep, opts={}) {

    _.defaults(opts, {
        sourceIndex: 0,
        takeFromStorage: false,
        giveToTowers: false
    });

    var inAssignedRoom = util().goToAssignedRoom(creep);
    if(!inAssignedRoom){ return; }

    util().depositEnergyOrHarvest(creep, opts);
}

