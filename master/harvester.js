var util = require('util')

module.exports = function (creep, sourceIndex, useStorage=true, giveToTowers=false) {

    sourceIndex = _.isUndefined(sourceIndex) ? 0 : sourceIndex;//default to 0

    var inAssignedRoom = util().goToAssignedRoom(creep);
    if(!inAssignedRoom){ return; }

    var storageWithEnergy = getStorageWithEnergy(creep);

	if(creep.carry.energy < creep.carryCapacity) {

        //if we are in a good state, (or maybe we aren't but there's no energy stored up), then harvest
        if(Game.briansStatus === 'complete' || !useStorage || !storageWithEnergy){
            var sources = creep.room.find(FIND_SOURCES);
            var errCode = creep.harvest(sources[sourceIndex]);
            if(errCode === ERR_NOT_IN_RANGE || errCode === ERR_NOT_ENOUGH_RESOURCES) {
                creep.moveTo(sources[sourceIndex], {
                    reusePath: false
                });
            }  

        //else get it from storage to get going faster          
        }else if(useStorage){
            if(creep.withdraw(storageWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(storageWithEnergy)
            }
        }
					
	}else {

        if(Game.briansStatus === 'complete' || !useStorage || !storageWithEnergy){
            util().giveEnergyToClosestRecipient(creep, {
                allowStructures: true,
                allowTowers: giveToTowers
            });
        }else if(useStorage){
            util().giveEnergyToClosestRecipient(creep, {
                allowStructures: true,
                allowStorage: false,
                allowTowers: giveToTowers
            });
        }
	}
}

function getStorageWithEnergy(creep){
    var storages = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
            return s.structureType === STRUCTURE_STORAGE
        }
    });

    // console.log('storages: ', storages);

    if(storages.length && storages[0].store[RESOURCE_ENERGY] > 0){
        return storages[0];
    }else{
        return null;
    }
}