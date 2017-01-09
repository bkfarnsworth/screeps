var util = require('util')
var Worker = require('Worker');

class Carrier extends Worker {

    constructor(creep, creepOpts){
        super(creep, creepOpts);
    }

    doWork(){
        var creep = this.creep;
        var creepOpts = this.creepOpts;
        var util = util();
        var energySource = this.getClosestHarvesterWithEnergy();

        if(!super.doWork()){
            util().doWorkOtherwise(creep, {
                workTarget    : energySource,
                workFunc      : util.getEnergyFromRoomObject.bind(util, creep, energySource),
                otherwiseFunc : util.depositEnergyForWork.bind(util, creep),
                polarity      : 'positive'
            });
        }
    }

    doIncompleteStatusWork(){
        if(!super.doIncompleteStatusWork()){
            var util = util();
            var storage = util.getClosestStorageWithEnergy(this.creep);

            //get energy from storage if there IS energy in storage.  other wise we just need to get energy from harvesters
            if(storage){
                util().doWorkOtherwise(creep, {
                    workTarget    : storage,
                    workFunc      : util.getEnergyFromStorage.bind(util, this.creep),
                    otherwiseFunc : util.depositEnergyForSpawning.bind(util, this.creep),
                    polarity      : 'positive'
                });
            }else{
                util().doWorkOtherwise(creep, {
                    workTarget    : this.source,
                    workFunc      : util.harvest.bind(util, creep, creepOpts),
                    otherwiseFunc : util.depositEnergyForSpawning.bind(util, this.creep),
                    polarity      : 'positive'
                });
            }
        }
    }

    getClosestHarvesterWithEnergy(){
        var harvestersWithEnergy = util().getCreepsOfType(['harvester'], this.creep.room).filter(h => {
            //I could make this a ratio to avoid having creeps go to a marginally closer one that 
            //has very little energy
            //but I get the reverse problem which is skipping a very close creep that has a little bit of energy
            //I feel like eventually I will want a function that takes into account distance and the amount of energy the creep has or something
            return h.energy > 0;
        });

        return this.creep.pos.findClosestByPathUsingCache(harvestersWithEnergy);
    }
}

module.exports = Carrier;