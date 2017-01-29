var Guard = require('Guard');
var Demoman = require('Demoman');
var util = require('util');
var Harvester = require('Harvester')
var Upgrader = require('Upgrader')
var healer = require('Healer')
var Builder = require('Builder')
var Repairer = require('Repairer')
var Carrier = require('Carrier')
var CreepConfig = require('CreepConfig');
var Worker = require('Worker');
var Tower = require('Tower');
var Miner = require('Miner');
var BodyPartEffectCalculator = require('BodyPartEffectCalculator');

var printQueue = true;

class RoomController {

	constructor(){
		this.defenseManager = new DefenseManager();
		this.bodyPartEffectCalculator = new BodyPartEffectCalculator();
	}

	runRoom(opts={}){

		_.defaults(opts, {
			throttle: false
		});

		console.log();
		console.log('Room: ' + this.room.name);
		
		this.setRoomStatus();
		this.printCreeps();
		this.printEnergy();

		if(!opts.throttle){
			this.spawnCreeps();
			this.activateSafeModeIfNecessary();
			this.runLinks();
			this.runTowers();
			this.runCreeps();
		}
		
		console.log('STATUS: ' + this.status);
		console.log(opts.throttle ? 'throttled' : 'NOT throttled')
	}

	getBackUpHarvesterConfig(creepConfig={}, opts={}){

		_.defaults(opts, {

		});

		return _.defaults(creepConfig, {
			name: 'backUpHarvester',
			role: 'harvester',
			condition: this.getHarvesters().length === 0, 
			stopOperation: true,
			bodyParts: util.getBodyPartsArray({
				WORK: 1,
				MOVE: 1,
				CARRY: 1
			})
		})
	}

	getHarvesterConfig(creepConfig={}, opts={}){

		_.defaults(opts, {
			percentOfSpawningPotential: 1
		});

		return _.defaults(creepConfig, {
			role: 'harvester',          
			stopOperation: true,
			bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
				percentOfSpawningPotential: opts.percentOfSpawningPotential,
				movePercent  : 1/6,
				carryPercent : 1/6,
				workPercent  : 2/3
			})
		})
	}

	getUpgraderConfig(creepConfig={}, opts={}){
		_.defaults(opts, {
			percentOfSpawningPotential: 1
		});

		return _.defaults(creepConfig, {
			role: 'upgrader',
			bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
				percentOfSpawningPotential: opts.percentOfSpawningPotential,
				movePercent  : 1/3,
				carryPercent : 1/3,
				workPercent  : 1/3
			})
		})
	}

	getRepairerConfig(creepConfig={}, opts={}){
		_.defaults(opts, {
			percentOfSpawningPotential: 1
		});

		return _.defaults(creepConfig, {
			role: 'repairer',
			bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
				percentOfSpawningPotential: opts.percentOfSpawningPotential,
				movePercent  : 1/3,
				carryPercent : 1/3,
				workPercent  : 1/3
			})
		})
	}

	getBuilderConfig(creepConfig={}, opts={}){
		_.defaults(opts, {
			percentOfSpawningPotential: 1
		});

		return _.defaults(creepConfig, {
			role: 'builder',
			condition: this.getMyConstructionSites().length > 0,
			bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
				percentOfSpawningPotential: opts.percentOfSpawningPotential,
				movePercent  : 1/3,
				carryPercent : 1/3,
				workPercent  : 1/3
			})
		})
	}

	getMinerConfig(creepConfig={}, opts={}){
		_.defaults(opts, {
			percentOfSpawningPotential: 1
		});

		var config = _.defaults(creepConfig, {
			role: 'miner',
			source: this.mineralSource,
			terminal: this.terminal, 
			storage: this.storage,
			bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
				percentOfSpawningPotential: opts.percentOfSpawningPotential,
				requiredParts: util.getBodyPartsArray({
					CARRY: 2
				}),
				//good ratio is 6 moves to 18 works
				//but that is 300 move energy to 
				//1800 work energy, so the ratio is
				//3-18
				movePercent  : 1/7,
				workPercent  : 6/7
			})
		})

		return config;
	}

	getCarrierConfig(creepConfig={}, opts={}){
		_.defaults(opts, {
			percentOfSpawningPotential: 1
		});

		return _.defaults(creepConfig, {
			role: 'carrier',
			bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
				percentOfSpawningPotential: opts.percentOfSpawningPotential,
				movePercent  : 0.5,
				carryPercent : 0.5
			})
		})
	}

	getDemomanConfig(creepConfig={}, opts={}){
		_.defaults(opts, {
		});

		return _.defaults(creepConfig, {
			role: 'demoman',
			bodyParts: util.getBodyPartsArray({
				WORK: 4,
				MOVE: 4,
				CARRY: 4
			})
		})
	}

	get room(){
		throw new Error('Must be overwritten')
	}

	get spawn(){
		throw new Error('Must be overwritten')
	}

	get creepConfigs(){
		throw new Error('Must be overwritten')
	}

	get creepConfigsByName(){
	   return _.indexBy(this.creepConfigs, 'name');
	}

	runLinks(){
		throw new Error('Must be overwritten')
	}

	runTowers(){
		this.room.find(FIND_MY_STRUCTURES).forEach(structure => {
			if(structure instanceof StructureTower){
				//towers go fast, so if there are no hostiles let's throttle them for now
				if(this.roomIsUnderAttack() || _.random(1, 3) === 1){
				    Tower(structure);
				}
			}
		});
	}

	setRoomStatus(){
		var spawningEnergyRatio = 1;
		var nextCreepConfigToSpawn = this.getNextCreepConfigToSpawn();
		var isPriorityCreep = nextCreepConfigToSpawn && nextCreepConfigToSpawn.stopOperation;
		var spawningEnergyNotFull = this.getEnergyAvailableForSpawning() < this.getEnergyCapacityForSpawning() * spawningEnergyRatio;

		// if(isPriorityCreep || spawningEnergyNotFull){
		if(isPriorityCreep){
			this.status = 'incomplete';
		}else{
			this.status = 'complete';
		}
	}

	printCreeps(){
		this.creepConfigs.forEach(creepConfig => {
			if(creepConfig.isSpawning()){
				util.printWithSpacing(creepConfig.name + ': Spawning (' + creepConfig.getEnergyRequired() + ')');
			}else if(creepConfig.needsSpawning() && creepConfig.condition){
				util.printWithSpacing(creepConfig.name + ': Queued (' + creepConfig.getEnergyRequired() + ')');
			}else if(!creepConfig.condition){
				util.printWithSpacing(creepConfig.name + ': Condition not met (' + creepConfig.getEnergyRequired() + ')');
			}else if(!creepConfig.needsSpawning()){
				var timeToDeath = creepConfig.getMatchingCreeps()[0].ticksToLive;
				util.printWithSpacing(creepConfig.name + ': ' + timeToDeath + ' (' + creepConfig.getEnergyRequired() + ')');
			}
		});
	}

	getCreeps(opts={}){

		_.defaults(opts, {
			filter: () => true,
			ownerName: 'bkfarns'
		});

		return this.room.find(FIND_CREEPS, {
			filter: function(creep){
				return opts.filter(creep) && creep.owner.username === opts.ownerName;
			}
		});
	}

	getMyCreeps(opts={}){
		return this.getCreeps(opts, {
			ownerName: 'bkfarns'
		});
	}

	getHarvesters(){
		return this.getMyCreeps({
			filter: creep => {
				return _.get(creep, 'memory.role') === 'harvester';
			}
		});
	}

	roomIsUnderAttack(){
		var hostiles = util.findHostiles(this.room);
		return hostiles.length > 0;
	}

	getMyConstructionSites(){
		return this.room.find(FIND_MY_CONSTRUCTION_SITES);
	}

	createCreepConfig(opts={}){
		opts.assignedRoom = this.room.name;

		if(!opts.name.includes(this.room.name)){
			opts.name = opts.name + '(' + this.room.name + ')';
		}
		return new CreepConfig(opts);
	}

	runCreeps(){
		var seeCPU = false;
		var tempCpuUsed = Game.cpu.getUsed();
		this.getMyCreeps().forEach(creep => {
			var creepConfig = this.creepConfigsByName[creep.getBfSimpleName()];
			this.runCreep(creep, creepConfig);
			if(seeCPU){
				console.log('creep.memory.role: ', creep.memory.role);
				console.log('CPU used: ' + _.round(Game.cpu.getUsed() - tempCpuUsed, 2));
				tempCpuUsed = Game.cpu.getUsed();
			}
		});
	}

	runCreep(creep, creepConfig){

		// if(util.runFromInvader(creep)){
		// 	return;
		// }

		var worker = new Worker(creep); 

		if(creep.memory.role == 'carrier') {
			worker = new Carrier(creep, creepConfig);
		}

		if(creep.memory.role == 'harvester') {
			worker = new Harvester(creep, creepConfig);
		}

		if(creep.memory.role == 'upgrader') {
			if(this.roomIsUnderAttack()){
				worker = new Repairer(creep, creepConfig);
			}else{
				worker = new Upgrader(creep, creepConfig);
			}
		}

		if(creep.memory.role == 'repairer') {
			if(this.roomIsUnderAttack()){
				worker = new Repairer(creep, creepConfig);
			}else{
				worker = new Upgrader(creep, creepConfig);
			}
		}

		if(creep.memory.role == 'guard') {
			worker = new Guard(creep, creepConfig);
		}

		if(creep.memory.role == 'demoman') {
			worker = new Demoman(creep, creepConfig);
		}

		if(creep.memory.role == 'builder') {
			worker = new Builder(creep, creepConfig);
		}

		if(creep.memory.role == 'miner') {
			worker = new Miner(creep, creepConfig);
		}		

		worker.doWork(this.status);
	}

	getNextCreepConfigToSpawn(){
		var creepsThatNeedSpawning = this.creepConfigs.filter(creepConfig => creepConfig.needsSpawning());
		//spawn the top priority one, else if spawning, do the next highest one
		var creepToSpawn;
		if(this.spawn.spawning){
				creepToSpawn = creepsThatNeedSpawning[1];
		}else{
				creepToSpawn = creepsThatNeedSpawning[0];
		}
		return creepToSpawn;
	}


	spawnCreeps(){
		var nextCreepConfigToSpawn = this.getNextCreepConfigToSpawn();
		if(nextCreepConfigToSpawn){
			this.spawnCreep(nextCreepConfigToSpawn);
		}
	}

	spawnCreep(creepConfigToSpawn){
		if(creepConfigToSpawn){
			console.log('Next creep to be spawned: ', creepConfigToSpawn.role);
		}else{
			console.log('All Screeps are spawned!');
			return;
		}

		var creepName = creepConfigToSpawn.name;
		var energyRequired = creepConfigToSpawn.getEnergyRequired();
		var memoryOpts = {
			role: creepConfigToSpawn.role,
			assignedRoom: creepConfigToSpawn.assignedRoom
		}

		var assignedSpawn = util.getSpawnForRoom(creepConfigToSpawn.assignedRoom);

		//we already put a default else where
		if(!assignedSpawn){
			assignedSpawn = util.getSpawnForRoom(util.northRoomName);
		}

		//to allow us to Spawn the next creep near the end of the current ones life, we do the A or B version
		var creepNameWithLetter = creepName + 'A';
		var errCode = assignedSpawn.createCreep(creepConfigToSpawn.bodyParts, creepNameWithLetter, memoryOpts);
		if(errCode === ERR_NAME_EXISTS){
			creepNameWithLetter = creepName + 'B';
			assignedSpawn.createCreep(creepConfigToSpawn.bodyParts, creepNameWithLetter, memoryOpts);
		}
	} 

	printEnergy(){
		var totalEnergyAvailable = this.getEnergyAvailableForSpawning();
		var totalEnergyCapacity = this.getEnergyCapacityForSpawning();
		var extraEnergy = this.getExtraEnergy();//extraEnergy is energy that is dropped or in a creep, 
		console.log("TOTAL ENERGY ("+this.room.name+"): " + totalEnergyAvailable + " (+" + extraEnergy + ") / " + totalEnergyCapacity);
	}

	getEnergyAvailableForSpawning(){
		return _.sum(this.getAllSpawningStructures(), 'energy');
	}

	getEnergyCapacityForSpawning(){
		return _.sum(this.getAllSpawningStructures(), 'energyCapacity');
	}

	getAllSpawningStructures(){
		return this.room.find(FIND_MY_STRUCTURES, {
			filter: s => {
				return s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN;
			}
		});
	}

	//opts - see opts for convertRatiosToBodyPartArray
	convertRatiosToBodyPartArrayWithRoomCapactiy(opts={}){

		_.defaults(opts, {
			percentOfSpawningPotential: 0.7
		});

		//I noticed in the docs that there is actually a property to get this; I don't have to calculate it myself
		var spawningPotential = this.getEnergyCapacityForSpawning();

		_.extend(opts, {
			energyToUseForBodyParts: spawningPotential * opts.percentOfSpawningPotential
		});

		return util.convertRatiosToBodyPartArray(opts);
	}

	get towers(){
		return [];
	}

	get mineralSource(){
		return this.room.find(FIND_MINERALS)[0];
	}

	get terminal(){
      return this.room.terminal;
	}

	get storage(){
      return this.room.storage;
	}

	getExtraEnergy(){
		var extraEnergy = 0;
		
		//dropped energy
		this.room.find(FIND_DROPPED_ENERGY).forEach(function(droppedResource){
				extraEnergy += droppedResource.amount;
		});
		
		//energy in creeps
		this.room.find(FIND_MY_CREEPS).forEach(function(creep){
				extraEnergy += creep.carry.energy;
		}) 
		
		//energy in the source
		this.room.find(FIND_SOURCES).forEach(function(source){
				// console.log(source.energy)
				extraEnergy += source.energy;
		});
		
		return extraEnergy;
	}

	activateSafeModeIfNecessary(){
		if(this.spawn.hits < this.spawn.hitsMax){
			Game.notify('ACTIVATING SAFE MODE, SPAWN IS UNDER ATTACK');
			this.room.controller.activateSafeMode();
		}
	}

	getHostiles(){
		return util.findHostiles(this.room);
	}
}

class DefenseManager{

	getDefenseStrategy(roomController){

		var debugMode = true;

		var enemyHealRate = this.getEnemyHealRate(roomController);
		var myAttackRate = this.getMyAttackRate(roomController);
		var enemyToughBoost = this.getEnemyToughBoost(roomController);
		var myAdjustedAttackRate = myAttackRate * enemyToughBoost;

		if(debugMode){
			console.log('enemyHealRate: ', enemyHealRate);
			console.log('myAttackRate: ', myAttackRate);
			console.log('enemyToughBoost: ', enemyToughBoost);
			console.log('myAdjustedAttackRate: ', myAdjustedAttackRate);
		}

		if(myAdjustedAttackRate - enemyHealRate > 100){
			if(debugMode){console.log('ATTACK');}
			return 'attack';
		}else{
			if(debugMode){console.log('REPAIR');}
			return 'repair';
		}
	}

	getEnemyHealRate(roomController){

		var enemeyHealPointsPerTick = 0;
		roomController.getHostiles().forEach(h => {
			h.body.filter(bp => bp.type === HEAL && bp.hits > 0).forEach(bp => {
				enemeyHealPointsPerTick += roomController.bodyPartEffectCalculator.getEffect(bp, 'heal');
			});
		});

		return enemeyHealPointsPerTick;
	}

	getMyAttackRate(roomController){
		//for now just towers, but eventually all creeps
		var myAttackPointsPerTick = 0;

		roomController.towers.forEach(t => {
			myAttackPointsPerTick += TOWER_POWER_ATTACK
		});

		return myAttackPointsPerTick;
	}

	getEnemyToughBoost(roomController){

		const nonBoostedMultiplier = 1;		

		//low means they take less damage
		var lowestToughMultiplier = nonBoostedMultiplier;

		_.forEach(roomController.getHostiles(), h => {
			_.forEach(h.body, bp => {
				var toughMultiplier = bp.type === TOUGH ? roomController.bodyPartEffectCalculator.getEffect(bp, 'damage') : nonBoostedMultiplier;
				lowestToughMultiplier = _.min([toughMultiplier, lowestToughMultiplier]);
			});
		})

		return lowestToughMultiplier;
	}
}

module.exports = RoomController;