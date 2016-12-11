var util = require('util')

module.exports = function (creep, status, roomToGetEnergyFrom) {

    var inAssignedRoom = util().goToAssignedRoom(creep);
    if(!inAssignedRoom){ return; }
        
    util().doWorkUnlessCloseToSource(creep, function(){
        util().giveEnergyToClosestRecipient(creep, {
            maxEnergyRatio: 0.7,
            allowTowers: false,
            allowStorage: false,
            allowStructures: false
        })
    });
}