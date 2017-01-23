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

			//if this source is empty, use the other source if there is one
			if(this._source.energy === 0){
				this._source = sources.find(s => s.id !== this._source.id) || this._source;
			}

			return this._source; 
		}
	}

	doWork(status){
		var creep = this.creep;
		var creepOpts = this.creepOpts;

		if(status === 'complete'){
			if(!super.doWork()){
				this.harvestThenDepositForWorkers();
			}
		}else{
			this.doIncompleteStatusWork();
		}
	}

	doIncompleteStatusWork(){
		var creep = this.creep;
		var creepOpts = this.creepOpts;
		var storage = util.getClosestStorageWithEnergy(this.creep);
		if(storage){
			this.getEnergyFromStorageThenDepositEnergyForSpawning(storage);
		}else{
			this.harvestThenDepositForSpawning();
		}
	}

	harvestThenDepositForWorkers(){
		var creep = this.creep;
		var creepOpts = this.creepOpts;

      var bestEnergyRecipientForSpawning = util.getBestRecipientForSpawning(this.creep);
      var bestEnergyRecipientForWork = util.getBestEnergyRecipient(this.creep);

		if(creep.room.energyAvailable < creep.room.energyCapacityAvailable){
			util.doWorkOtherwise(creep, {
				workTarget    : this.source,
				workFunc      : util.harvest.bind(util, creep, {source: this.source}),
				otherwiseFunc : util.giveEnergyToRecipient.bind(util, creep, bestEnergyRecipientForSpawning),
				otherwiseTarget: bestEnergyRecipientForSpawning,
				polarity      : 'positive'
			});
		}else{
			util.doWorkOtherwise(creep, {
				workTarget    : this.source,
				workFunc      : util.harvest.bind(util, creep, {source: this.source}),
				otherwiseFunc : util.giveEnergyToRecipient.bind(util, creep, bestEnergyRecipientForWork),
				otherwiseTarget: bestEnergyRecipientForWork,
				polarity      : 'positive'
			});
		}
	}

	getEnergyFromStorageThenDepositEnergyForSpawning(storage){
		var creep = this.creep;
      var bestEnergyRecipientForSpawning = util.getBestRecipientForSpawning(this.creep);
      if(bestEnergyRecipientForSpawning){
			util.doWorkOtherwise(creep, {
				workTarget    : storage,
				workFunc      : util.getEnergyFromStorage.bind(util, this.creep),
				otherwiseFunc : util.giveEnergyToRecipient.bind(util, this.creep, bestEnergyRecipientForSpawning),
				otherwiseTarget: bestEnergyRecipientForSpawning,
				polarity      : 'positive'
			});
      }
	}

	harvestThenDepositForSpawning(){

      var bestEnergyRecipientForSpawning = util.getBestRecipientForSpawning(this.creep);

		var creep = this.creep;
		var creepOpts = this.creepOpts;
		util.doWorkOtherwise(creep, {
			workTarget    : this.source,
			workFunc      : util.harvest.bind(util, creep, {source: this.source}),
			otherwiseFunc : util.giveEnergyToRecipient.bind(util, this.creep, bestEnergyRecipientForSpawning),
			otherwiseTarget: bestEnergyRecipientForSpawning,
			polarity      : 'positive'
		});
	}
}

module.exports = Harvester;  