var util = require('util')
var Worker = require('Worker');

class Carrier extends Worker {

    constructor(creep, creepOpts){
        super(creep, creepOpts);
    }

    doWork(){
        var creep = this.creep;
        util().gatherEnergyOr(creep, function(){
            util().giveEnergyToBestRecipient(creep, {
                maxEnergyRatio: 0.7,
                allowTowers: false,
                allowStorage: false,
                allowStructures: false
            })
        });
    }
}

module.exports = Carrier;