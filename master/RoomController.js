var Guard = require('Guard');
var MeleeAttacker = require('MeleeAttacker');
var Demoman = require('Demoman');
var Claimer = require('Claimer');
var util = require('util');
var Harvester = require('Harvester')
var upgrader = require('Upgrader')
var guard = require('Guard')
var healer = require('Healer')
var builder = require('Builder')
var repairer = require('Repairer')
var carrier = require('Carrier')
var CreepType = require('CreepType');

var printQueue = true;

class RoomController {

	runRoom(){
		this.spawnCreeps();
		this.activateSafeModeIfNecessary();
		this.printEnergy();
		this.runLinks();
		this.runCreeps();
		console.log('STATUS: ' + this.room.status);
	}

	get bodyParts(){
		return {
			//farNorthRoom
			farNorthUpgraderBodyParts     : [WORK,CARRY,MOVE],
			farNorthBuilderBodyParts      : [WORK,CARRY,MOVE],
			farNorthHarvesterBodyParts    : [WORK,CARRY,MOVE],

			//north and south rooms
			backUpHarvesterBodyParts      : [WORK,CARRY,MOVE],
			guardBodyParts                : [MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,TOUGH,TOUGH],
			demomanBodyParts              : [TOUGH,TOUGH,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK],
			meleeAttackerBodyParts        : [MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,TOUGH,TOUGH],
			claimerBodyParts              : [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,HEAL],
			harvesterBodyParts            : [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			superHarvesterTwoBodyParts    : [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			carrierBodyParts              : [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
			upgraderBodyParts             : [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			builderBodyParts              : [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
		};
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

	set status(val){
		this.room.status = val;
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

	getMyConstructionSites(){
		return this.room.find(FIND_MY_CONSTRUCTION_SITES);
	}

	createCreepType(opts={}){
		opts.assignedRoom = this.room.name;
		opts.name = opts.name + '(' + this.room.name + ')';
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

		// if(util().runFromInvader(creep)){
		// 	return;
		// }

		if(creep.memory.role == 'carrier') {
			carrier(creep, creepType);
		}

		if(creep.memory.role == 'harvester') {
			var harvester = new Harvester(creep, creepType);
			harvester.doWork();
		}

		if(creep.memory.role == 'upgrader') {
			upgrader(creep, creepType);
		}

		if(creep.memory.role == 'claimer') {
			Claimer(creep, creepType);
		}

		if(creep.memory.role == 'repairer') {
			repairer(creep, creepType);
		}

		if(creep.memory.role == 'guard') {
			var guard = new Guard(creep, creepType);
			guard.doWork();
		}

		if(creep.memory.role == 'meleeAttacker') {
			var meleeAttacker = new MeleeAttacker(creep, creepType);
			meleeAttacker.doWork();
		}

		if(creep.memory.role == 'demoman') {
			var demoman = new Demoman(creep, creepType);
			demoman.doWork();
		}

		if(creep.memory.role == 'builder') {
			builder(creep, creepType);
		}
	}

	spawnCreeps(){
		console.log();
		console.log('Room: ' + this.room.name);

		var creepsThatNeedSpawning = this.creepTypes.filter(creepType => creepType.needsSpawning());

		//spawn the top priority one, else if spawning, do the next highest one
		var creepToSpawn;
		if(this.spawn.spawning){
				creepToSpawn = creepsThatNeedSpawning[1];
		}else{
				creepToSpawn = creepsThatNeedSpawning[0];
		}

		if(creepToSpawn && creepToSpawn.stopOperation){
				this.status = 'incomplete';
		}else{
				this.status = 'complete';
		}

		if(creepToSpawn){
				this.spawnCreep(creepToSpawn);
		}

		if(printQueue){
			this.creepTypes.forEach(creepType => {
				if(creepType.isSpawning()){
					util().printWithSpacing(creepType.name + ': Spawning (' + creepType.getEnergyRequired() + ')');
				}else if(creepType.needsSpawning() && creepType.condition){
					util().printWithSpacing(creepType.name + ': Queued (' + creepType.getEnergyRequired() + ')');
				}else if(!creepType.condition){
					util().printWithSpacing(creepType.name + ': Condition not met (' + creepType.getEnergyRequired() + ')');
				}else if(!creepType.needsSpawning()){
					var timeToDeath = creepType.getMatchingCreeps()[0].ticksToLive;
					util().printWithSpacing(creepType.name + ': ' + timeToDeath + ' (' + creepType.getEnergyRequired() + ')');
				}
			});
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

		var assignedSpawn = util().getSpawnForRoom(creepTypeToSpawn.assignedRoom);

		//we already put a default else where
		if(!assignedSpawn){
			assignedSpawn = util().getSpawnForRoom(util().northRoomName);
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
		var hostiles = util().findHostiles(this.room, {
				usersToIgnore: [
						util().milesUsername,
						'Invader'
				]
		});

		if(hostiles.length){
			Game.notify('WOULD ACTIVATE SAFE MODE, BUT I COMMENTED IT OUT');
			// this.room.controller.activateSafeMode();
		}
	}
}

module.exports = RoomController;