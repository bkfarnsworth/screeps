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

        var recipient = util.getBestEnergyRecipient(creep, {
            allowStructures  : false,
            allowTowers      : false,
            allowStorage     : false,
            allowLink        : false,
            creepTypes       : ['upgrader', 'builder'] 
        }) || util.getBestEnergyRecipient(creep, {
            allowStructures  : true,
            allowTowers      : false,
            allowStorage     : true,
            allowLink        : false,
            creepTypes       : ['upgrader', 'builder'] 
        });



        if(!super.doWork()){

            if(harvesterWithEnergy){
                util.doWorkOtherwise(creep, {
                    workTarget    : harvesterWithEnergy,
                    workFunc      : util.getEnergyFromRoomObject.bind(util, creep, harvesterWithEnergy),
                    otherwiseFunc : util.giveEnergyToRecipient.bind(util, creep, recipient),
                    polarity      : 'positive'
                });
            }else{
                var storage = util.getClosestStorageWithEnergy(this.creep);
                if(storage){
                    util.doWorkOtherwise(this.creep, {
                        workTarget    : storage,
                        workFunc      : util.getEnergyFromStorage.bind(util, this.creep),
                        otherwiseFunc : util.giveEnergyToRecipient.bind(util, creep, recipient),
                        polarity      : 'positive'
                    }); 
                }
            }
        }
    }

    doIncompleteStatusWork(){
        if(!super.doIncompleteStatusWork()){
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
                var harvesterWithEnergy = this.getClosestHarvesterWithEnergy();
                util.doWorkOtherwise(this.creep, {
                    workTarget    : harvesterWithEnergy,
                    workFunc      : util.getEnergyFromRoomObject.bind(util, this.creep, harvesterWithEnergy),
                    otherwiseFunc : util.depositEnergyForSpawning.bind(util, this.creep),
                    polarity      : 'positive'
                });
            }
        }
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