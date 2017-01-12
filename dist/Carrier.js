var util = require('util')
var Worker = require('Worker');

class Carrier extends Worker {

    constructor(creep, creepOpts={}){

        _.defaults(creepOpts, {

        });

        super(creep, creepOpts);
    }

    doWork(){
        var creep = this.creep;
        var creepOpts = this.creepOpts;
        var harvesterWithEnergy = this.getClosestHarvesterWithEnergy();

        //in priority order
        var targets = [
            'creep',
            'tower',
            'storage',
        ];

        var lockedTarget;
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            switch (target) {
                case 'creep':
                    lockedTarget = util.getBestEnergyRecipient(creep, {
                        allowStructures  : false,
                        allowTowers      : false,
                        allowStorage     : false,
                        allowLink        : false,
                        creepTypes       : ['upgrader', 'builder'] 
                    });
                    break;
                case 'tower':
                    lockedTarget = util.getBestEnergyRecipient(creep, {
                        allowStructures  : true,
                        allowTowers      : true,
                        allowStorage     : false,
                        allowLink        : false,
                        creepTypes       : [] 
                    });
                    break;
                case 'storage':
                    util.getBestEnergyRecipient(creep, {
                        allowStructures  : true,
                        allowTowers      : false,
                        allowStorage     : true,
                        allowLink        : false,
                        creepTypes       : [] 
                    });
                    break;
            }

            if(lockedTarget){
                break;
            }
        }

        if(!super.doWork()){

            if(harvesterWithEnergy){
                util.doWorkOtherwise(creep, {
                    workTarget    : harvesterWithEnergy,
                    workFunc      : util.getEnergyFromRoomObject.bind(util, creep, harvesterWithEnergy),
                    otherwiseFunc : util.giveEnergyToRecipient.bind(util, creep, lockedTarget),
                    polarity      : 'positive'
                });
            }else{
                var storage = util.getClosestStorageWithEnergy(this.creep);
                if(storage){
                    util.doWorkOtherwise(this.creep, {
                        workTarget    : storage,
                        workFunc      : util.getEnergyFromStorage.bind(util, this.creep),
                        otherwiseFunc : util.giveEnergyToRecipient.bind(util, creep, lockedTarget),
                        polarity      : 'positive'
                    }); 
                }
            }
        }
    }

    doIncompleteStatusWork(){
        var harvesterToCollectFrom = this.getClosestHarvesterWithEnergy() || this.getClosestHarvester();
        // if(!super.doIncompleteStatusWork()){
            var storage = util.getClosestStorageWithEnergy(this.creep);

            //get energy from storage if there IS energy in storage.  other wise we just need to get energy from harvesters
            if(storage){
                util.doWorkOtherwise(this.creep, {
                    workTarget    : storage,
                    workFunc      : util.getEnergyFromStorage.bind(util, this.creep),
                    otherwiseFunc : util.depositEnergyForSpawning.bind(util, this.creep),
                    polarity      : 'positive'
                });
            }else{
                util.doWorkOtherwise(this.creep, {
                    workTarget    : harvesterToCollectFrom,
                    workFunc      : util.getEnergyFromRoomObject.bind(util, this.creep, harvesterToCollectFrom),
                    otherwiseFunc : util.depositEnergyForSpawning.bind(util, this.creep),
                    polarity      : 'positive'
                });
            }
        // }    
    }

    getClosestHarvester(){
        return this.creep.pos.findClosestByPathUsingCache(util.getCreepsOfType(['harvester'], this.creep.room));
    }

    getClosestHarvesterWithEnergy(){
        var harvestersWithEnergy = util.getCreepsOfType(['harvester'], this.creep.room).filter(h => {

            //I could make this a ratio to avoid having creeps go to a marginally closer one that 
            //has very little energy
            //but I get the reverse problem which is skipping a very close creep that has a little bit of energy
            //I feel like eventually I will want a function that takes into account distance and the amount of energy the creep has or something
            return h.carry.energy > h.carryCapacity * 0.7;
        });

        return this.creep.pos.findClosestByPathUsingCache(harvestersWithEnergy);
    }
}

module.exports = Carrier;