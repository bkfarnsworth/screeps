var Guard = require('Guard');
var Demoman = require('Demoman');
var util = require('util');
var Harvester = require('Harvester')
var Upgrader = require('Upgrader')
var healer = require('Healer')
var Builder = require('Builder')
var Repairer = require('Repairer')
var Carrier = require('Carrier')
var CreepType = require('CreepType');
var Worker = require('Worker');
var Tower = require('Tower');

var printQueue = true;

class RoomController {

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
			//remember that this isn't getting the 1/3 throttle anymore is the subclass implements it
			this.runTowers();
			this.runCreeps();
		}
		
		console.log('STATUS: ' + this.room.status);
		console.log(opts.throttle ? 'throttled' : 'NOT throttled')
	}

	get standardCreepTypes(){
		return {
			backUpHarvester: {
				name: 'backUpHarvester',
				role: 'harvester',    
				condition: this.getHarvesters().length === 0, 
				stopOperation: true,
				bodyParts: util.getBodyPartsArray({
					WORK: 1,
					MOVE: 1,
					CARRY: 1
				})
			},
			harvester: {
				role: 'harvester',          
				stopOperation: true,
				bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
					percentOfSpawningPotential: 1,
					movePercent  : 1/6,
					carryPercent : 1/6,
					workPercent  : 2/3
				})
			},
			guard: { 
				role: 'guard',          
				stopOperation: true,
				condition: this.roomIsUnderAttack(),
				// bodyParts: util.getBodyPartsArray({
				// 	TOUGH: 3,
				// 	MOVE: 3,
				// 	ATTACK: 3
				// })
			},
			upgrader: {
				role: 'upgrader',
				bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
					percentOfSpawningPotential: 1,
					movePercent  : 1/3,
					carryPercent : 1/3,
					workPercent  : 1/3
				})
			},
			repairer: {
				role: 'repairer',
				bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
					percentOfSpawningPotential: 1,
					movePercent  : 1/3,
					carryPercent : 1/3,
					workPercent  : 1/3
				})
			},
			builder: {
				role: 'builder',            
				condition: this.getMyConstructionSites().length > 0,
				bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
					percentOfSpawningPotential: 1,
					movePercent  : 1/3,
					carryPercent : 1/3,
					workPercent  : 1/3
				})
			},
			carrier: {
				role: 'carrier',
				bodyParts: this.convertRatiosToBodyPartArrayWithRoomCapactiy({
					percentOfSpawningPotential: 1,
					movePercent  : 0.5,
					carryPercent : 0.5
				})
			}
		}
	}

	get room(){
		throw new Error('Must be overwritten')
	}

	get spawn(){
		throw new Error('Must be overwritten')
	}

	get creepTypes(){
		throw new Error('Must be overwritten')
	}

	get creepTypesByName(){
	   return _.indexBy(this.creepTypes, 'name');
	}

	get status(){
		return this.room.status;
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

	set status(val){
		this.room.status = val;
	}

	setRoomStatus(){
		var spawningEnergyRatio = 1;
		var nextCreepTypeToSpawn = this.getNextCreepTypeToSpawn();
		var isPriorityCreep = nextCreepTypeToSpawn && nextCreepTypeToSpawn.stopOperation;
		var spawningEnergyNotFull = this.getEnergyAvailableForSpawning() < this.getEnergyCapacityForSpawning() * spawningEnergyRatio;

		// if(isPriorityCreep || spawningEnergyNotFull){
		if(isPriorityCreep){
			this.status = 'incomplete';
		}else{
			this.status = 'complete';
		}
	}

	printCreeps(){
		this.creepTypes.forEach(creepType => {
			if(creepType.isSpawning()){
				util.printWithSpacing(creepType.name + ': Spawning (' + creepType.getEnergyRequired() + ')');
			}else if(creepType.needsSpawning() && creepType.condition){
				util.printWithSpacing(creepType.name + ': Queued (' + creepType.getEnergyRequired() + ')');
			}else if(!creepType.condition){
				util.printWithSpacing(creepType.name + ': Condition not met (' + creepType.getEnergyRequired() + ')');
			}else if(!creepType.needsSpawning()){
				var timeToDeath = creepType.getMatchingCreeps()[0].ticksToLive;
				util.printWithSpacing(creepType.name + ': ' + timeToDeath + ' (' + creepType.getEnergyRequired() + ')');
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

	createCreepType(opts={}){
		opts.assignedRoom = this.room.name;

		if(!opts.name.includes(this.room.name)){
			opts.name = opts.name + '(' + this.room.name + ')';
		}
		return new CreepType(opts);
	}

	runCreeps(){
		var seeCPU = false;
		var tempCpuUsed = Game.cpu.getUsed();
		this.getMyCreeps().forEach(creep => {
			var creepType = this.creepTypesByName[creep.name];
			this.runCreep(creep, creepType);
			if(seeCPU){
				console.log('creep.memory.role: ', creep.memory.role);
				console.log('CPU used: ' + _.round(Game.cpu.getUsed() - tempCpuUsed, 2));
				tempCpuUsed = Game.cpu.getUsed();
			}
		});
	}

	runCreep(creep, creepType){

		// if(util.runFromInvader(creep)){
		// 	return;
		// }

		var worker = new Worker(creep); 

		if(creep.memory.role == 'carrier') {
			worker = new Carrier(creep, creepType);
		}

		if(creep.memory.role == 'harvester') {
			worker = new Harvester(creep, creepType);
		}

		if(creep.memory.role == 'upgrader') {
			worker = new Upgrader(creep, creepType);
		}

		if(creep.memory.role == 'repairer') {
			worker = new Repairer(creep, creepType);
		}

		if(creep.memory.role == 'guard') {
			worker = new Guard(creep, creepType);
		}

		if(creep.memory.role == 'demoman') {
			worker = new Demoman(creep, creepType);
		}

		if(creep.memory.role == 'builder') {
			worker = new Builder(creep, creepType);
		}


		if(this.status === 'complete'){
			worker.doWork();
		}else if(this.status === 'incomplete'){
			worker.doIncompleteStatusWork();
		}else if(this.status === 'underAttack'){
			worker.doAttackStatusWork();
		}
	}

	getNextCreepTypeToSpawn(){
		var creepsThatNeedSpawning = this.creepTypes.filter(creepType => creepType.needsSpawning());
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
		var nextCreepTypeToSpawn = this.getNextCreepTypeToSpawn();
		if(nextCreepTypeToSpawn){
			this.spawnCreep(nextCreepTypeToSpawn);
		}
	}

	spawnCreep(creepTypeToSpawn){
		if(creepTypeToSpawn){
			console.log('Next creep to be spawned: ', creepTypeToSpawn.role);
		}else{
			console.log('All Screeps are spawned!');
			return;
		}

		var creepName = creepTypeToSpawn.name;
		var energyRequired = creepTypeToSpawn.getEnergyRequired();
		var memoryOpts = {
			role: creepTypeToSpawn.role,
			assignedRoom: creepTypeToSpawn.assignedRoom
		}

		var assignedSpawn = util.getSpawnForRoom(creepTypeToSpawn.assignedRoom);

		//we already put a default else where
		if(!assignedSpawn){
			assignedSpawn = util.getSpawnForRoom(util.northRoomName);
		}

		var errCode = assignedSpawn.createCreep(creepTypeToSpawn.bodyParts, creepName, memoryOpts);

		if(errCode === ERR_NAME_EXISTS){
			//then delete it from memory
			delete Memory.creeps[creepName];
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
}

module.exports = RoomController;