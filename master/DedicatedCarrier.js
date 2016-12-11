var util = require('util')

var debugMode = false;

module.exports = function (creep, status, roomToGetEnergyFrom) {

    var inAssignedRoom = util().goToAssignedRoom(creep);
    if(!inAssignedRoom){ return; }
    
    if(debugMode){
        console.log('creep.name: ', creep.name);
        console.log('sources: ', sources);
        console.log('isCloseToSource: ', isCloseToSource);
    }

    util().doWorkUnlessCloseToSource(creep, function(){
        util().giveEnergyToClosestRecipient(creep, {
            maxEnergyRatio: 0.7
        })
    });
}