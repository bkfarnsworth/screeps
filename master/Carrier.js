var util = require('util')

module.exports = function (creep, status, roomToGetEnergyFrom) {

    var inAssignedRoom = util().goToAssignedRoom(creep);
    if(!inAssignedRoom){ return; }
        
    util().gatherEnergyOr(creep, function(){
        util().giveEnergyToBestRecipient(creep, {
            maxEnergyRatio: 0.7,
            allowTowers: false,
            allowStorage: false,
            allowStructures: false
        })
    });
}