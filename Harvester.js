var util = require('util')
var Worker = require('Worker');

class Harvester extends Worker{

	constructor(creep, creepOpts={}){

		super(creep, creepOpts);

		_.defaults(this.creepOpts, {
			sourceIndex: 0,
		});
	}

	get source(){
		if(this._source){
			return this._source;
		}else{
			var sources = this.creep.room.find(FIND_SOURCES);
			this._source = sources[this.creepOpts.sourceIndex];
			return this._source; 
		}
	}

	doWork(status){
		var creep = this.creep;
		var creepOpts = this.creepOpts;

		if(status === 'complete'){
			if(!super.doWork()){

				var depositFunc;

				if(creep.room.energyAvailable < creep.room.energyCapacityAvailable){
					depositFunc = util.giveEnergyToBestRecipient.bind(util, creep, {
						allowStructures  : true,
						allowTowers      : false,
						allowStorage     : false,
						allowLink        : false,
						creepTypes       : [] 
					});
				}else{
					depositFunc = util.depositEnergyForWork.bind(util, creep)
				}

				util.doWorkOtherwise(creep, {
					workTarget    : this.source,
					workFunc      : util.harvest.bind(util, creep, creepOpts),
					otherwiseFunc : depositFunc,
					polarity      : 'positive'
				});
			}
		}else{
			this.doIncompleteStatusWork();
		}

	}

	doIncompleteStatusWork(){
		var creep = this.creep;
		var creepOpts = this.creepOpts;
		// if(!super.doIncompleteStatusWork()){
			//get energy from storage if there IS energy in storage.  other wise we just need to harvest
			var storage = util.getClosestStorageWithEnergy(this.creep);

			if(storage){
				util.doWorkOtherwise(creep, {
					workTarget    : storage,
					workFunc      : util.getEnergyFromStorage.bind(util, this.creep),
					otherwiseFunc : util.depositEnergyForSpawning.bind(util, this.creep),
					polarity      : 'positive'
				});
			}else{
				util.doWorkOtherwise(creep, {
					workTarget    : this.source,
					workFunc      : util.harvest.bind(util, creep, creepOpts),
					otherwiseFunc : util.depositEnergyForSpawning.bind(util, this.creep),
					polarity      : 'positive'
				});
			}
		// }
	}
}

module.exports = Harvester;  