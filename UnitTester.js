var util = require('util');
var chai = require('chai');
var spies = require('chai-spies');
var expect = chai.expect;
var Upgrader = require('Upgrader');

// http://chaijs.com/api/bdd/
class UnitTester {

   runTests(){
      console.log('---- TESTS ----');

      chai.use(spies);

      this.describeConvertRatiosToBodyPartsArray();

      this.describeRoomController();
      this.describeDoWorkBasedOnPositionOtherwise();

      var ptr = true;
      if(ptr){
         //set up infrastructure
         //assume there is an upgrader for now
         this.describeUpgrader();
         // this.describeHarvester();
      }
   }

   /*
      harvester - work if close and !full
      harvester - work if far and 0
      harvester - not work if far and !0
      harvester - not work if close and full
      upgrader  - work if close and !0 
      upgrader  - work if far and full
      upgrader  - not work if far and !full
      upgrader  - not work if close and 0
   */
   describeDoWorkBasedOnPositionOtherwise(){
      it('should make harvester work (if close to work target, energy < capacity)', () => {

         var mockCreep = {
            carry: {
               energy: 99
            },
            carryCapacity: 100
         };

         var workFunc      = () => {};
         var otherwiseFunc = () => {};

         var workSpy       = chai.spy(workFunc);
         var otherwiseSpy  = chai.spy(otherwiseFunc); 

         util.doWorkBasedOnPositionOtherwise(mockCreep, {
            workFunc: workSpy,
            otherwiseFunc: otherwiseSpy,
            polarity: 'positive',
            isNearWorkTarget: true
         });

         expect(workSpy).to.have.been.called();
      });

      it('should make harvester work (if far from work target, energy === 0)', () => {

         var mockCreep = {
            carry: {
               energy: 0
            },
            carryCapacity: 100
         };

         var workFunc      = () => {};
         var otherwiseFunc = () => {};

         var workSpy       = chai.spy(workFunc);
         var otherwiseSpy  = chai.spy(otherwiseFunc); 

         util.doWorkBasedOnPositionOtherwise(mockCreep, {
            workFunc: workSpy,
            otherwiseFunc: otherwiseSpy,
            polarity: 'positive',
            isNearWorkTarget: false
         });

         expect(workSpy).to.have.been.called();
      });

      it('should make harvester deposit (if close to work target, energy === capacity)', () => {

         var mockCreep = {
            carry: {
               energy: 100
            },
            carryCapacity: 100
         };

         var workFunc      = () => {};
         var otherwiseFunc = () => {};

         var workSpy       = chai.spy(workFunc);
         var otherwiseSpy  = chai.spy(otherwiseFunc); 

         util.doWorkBasedOnPositionOtherwise(mockCreep, {
            workFunc: workSpy,
            otherwiseFunc: otherwiseSpy,
            polarity: 'positive',
            isNearWorkTarget: true
         });

         expect(otherwiseSpy).to.have.been.called();
      });

      it('should make harvester deposit (if far from work target, energy > 0)', () => {

         var mockCreep = {
            carry: {
               energy: 1
            },
            carryCapacity: 100
         };

         var workFunc      = () => {};
         var otherwiseFunc = () => {};

         var workSpy       = chai.spy(workFunc);
         var otherwiseSpy  = chai.spy(otherwiseFunc); 

         util.doWorkBasedOnPositionOtherwise(mockCreep, {
            workFunc: workSpy,
            otherwiseFunc: otherwiseSpy,
            polarity: 'positive',
            isNearWorkTarget: false
         });

         expect(otherwiseSpy).to.have.been.called();
      });

      it('should make upgrader work (if close to work target, energy > 0)', () => {

         var mockCreep = {
            carry: {
               energy: 1
            },
            carryCapacity: 100
         };

         var workFunc      = () => {};
         var otherwiseFunc = () => {};

         var workSpy       = chai.spy(workFunc);
         var otherwiseSpy  = chai.spy(otherwiseFunc); 

         util.doWorkBasedOnPositionOtherwise(mockCreep, {
            workFunc: workSpy,
            otherwiseFunc: otherwiseSpy,
            polarity: 'negative',
            isNearWorkTarget: true
         });

         expect(workSpy).to.have.been.called();
      });

      it('should make upgrader work (if far from work target, energy === capacity)', () => {

         var mockCreep = {
            carry: {
               energy: 100
            },
            carryCapacity: 100
         };

         var workFunc      = () => {};
         var otherwiseFunc = () => {};

         var workSpy       = chai.spy(workFunc);
         var otherwiseSpy  = chai.spy(otherwiseFunc); 

         util.doWorkBasedOnPositionOtherwise(mockCreep, {
            workFunc: workSpy,
            otherwiseFunc: otherwiseSpy,
            polarity: 'negative',
            isNearWorkTarget: false
         });

         expect(workSpy).to.have.been.called();
      });

      it('should make upgrader gather energy (if close to work target, energy === 0)', () => {

         var mockCreep = {
            carry: {
               energy: 0
            },
            carryCapacity: 100
         };

         var workFunc      = () => {};
         var otherwiseFunc = () => {};

         var workSpy       = chai.spy(workFunc);
         var otherwiseSpy  = chai.spy(otherwiseFunc); 

         util.doWorkBasedOnPositionOtherwise(mockCreep, {
            workFunc: workSpy,
            otherwiseFunc: otherwiseSpy,
            polarity: 'negative',
            isNearWorkTarget: true
         });

         expect(otherwiseSpy).to.have.been.called();
      });

      it('should make upgrader gather energy (if far from work target, energy !== capacity)', () => {

         var mockCreep = {
            carry: {
               energy: 99
            },
            carryCapacity: 100
         };

         var workFunc      = () => {};
         var otherwiseFunc = () => {};

         var workSpy       = chai.spy(workFunc);
         var otherwiseSpy  = chai.spy(otherwiseFunc); 

         util.doWorkBasedOnPositionOtherwise(mockCreep, {
            workFunc: workSpy,
            otherwiseFunc: otherwiseSpy,
            polarity: 'negative',
            isNearWorkTarget: false
         });

         expect(otherwiseSpy).to.have.been.called();
      });
   }

   describeConvertRatiosToBodyPartsArray(){

      it('should say that true is true', () => {
         expect(true).to.deep.equal(true);
      });

      it('should say an array is the same as the same array', () => {
         expect([1,2,3]).to.deep.equal([1,2,3]);
      });

      it('should convert move, carry, and work to the right bodyPartsArray', () => {
         var bodyPartsArray = util.convertRatiosToBodyPartArray({
            energyToUseForBodyParts    : 600,
            movePercent                : 1/3, 
            carryPercent               : 1/3,
            workPercent                : 1/3,
         });

         var expectedArray = [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
         expectedArray.sort();
         bodyPartsArray.sort();
         expect(bodyPartsArray).to.deep.equal(expectedArray);
      });

      it('should convert attack, ranged_attack, heal, and tough to bodyPartsArray', () => {
         var bodyPartsArray = util.convertRatiosToBodyPartArray({
            energyToUseForBodyParts    : 800,
            attackPercent              : 1/4, 
            rangedAttackPercent        : 1/4,
            healPercent                : 1/4,
            toughPercent               : 1/4,
         });

         var expectedArray = [
            ATTACK, ATTACK,
            RANGED_ATTACK,
            //no HEAL because there wasn't enough
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH
            ];

         expectedArray.sort();
         bodyPartsArray.sort();
         expect(bodyPartsArray).to.deep.equal(expectedArray);
      });

      it('should create an array with one claim part', () => {
         var bodyPartsArray = util.convertRatiosToBodyPartArray({
            energyToUseForBodyParts     : 1000,
            claimPercent                : 6/10, 
            movePercent                 : 2/10,
            carryPercent                : 2/10,
         });

         var expectedArray = [CLAIM,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
         expectedArray.sort();
         bodyPartsArray.sort();
         expect(bodyPartsArray).to.deep.equal(expectedArray);
      });

      it('should create an array with 5 claim parts', () => {
         var bodyPartsArray = util.convertRatiosToBodyPartArray({
            energyToUseForBodyParts     : 6000,
            claimPercent                : 1/2,
            movePercent                 : 1/4,
            carryPercent                : 1/4,
         });

         var expectedArray = [
            CLAIM,CLAIM,CLAIM,CLAIM,CLAIM,
            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE
         ];
         expectedArray.sort();
         bodyPartsArray.sort();
         expect(bodyPartsArray).to.deep.equal(expectedArray);
      });

      it('should create body parts array with small amount of energy', () => {
         var bodyPartsArray = util.convertRatiosToBodyPartArray({
            energyToUseForBodyParts     : 75,
            workPercent                 : 1/3,
            movePercent                 : 1/3,
            carryPercent                : 1/3,
         });

         var expectedArray = [];
         expectedArray.sort();
         bodyPartsArray.sort();
         expect(bodyPartsArray).to.deep.equal(expectedArray);
      });

      it('should create body parts array with large amount of energy', () => {
         var bodyPartsArray = util.convertRatiosToBodyPartArray({
            energyToUseForBodyParts     : 10000,//1250 each
            attackPercent               : 1/8,//15 parts
            movePercent                 : 1/8,//25
            carryPercent                : 1/8,//25
            rangedAttackPercent         : 1/8,//8
            workPercent                 : 1/8,//12
            healPercent                 : 1/8,//5
            toughPercent                : 1/8,//125
            claimPercent                : 1/8,//2
         });

         var expectedArray = [
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, 
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            CARRY, CARRY, CARRY, CARRY, CARRY,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, 
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, 
            WORK, WORK, 
            HEAL, HEAL, HEAL, HEAL, HEAL, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            CLAIM, CLAIM
         ];
         expectedArray.sort();
         bodyPartsArray.sort();
         expect(bodyPartsArray).to.deep.equal(expectedArray);
      });

   }

   describeUpgrader(){
      it('should upgrade the controller if it has enough energy', () => {
         var room = Game.rooms.W8N3
         var upgrader = room.find(FIND_MY_CREEPS)[0];
         var storage = room.storage;
         var controller = room.controller;

        //  var pathToStorage = room.findPath(upgrader, storage);
        //  var pathFromStorageToController = room.findPath(storage, controller);

         //2 to transfer energy and * 2 for fatigue
         // Memory.tickLimit = (pathToStorage.length + pathFromStorageToController.length) * 2 + 2;
         //hard coding for now
         var tickLimit = 120;

         if(_.isUndefined(_.get(Memory, 'testTimer.upgraderTest'))){
            _.set(Memory, 'testTimer.upgraderTest', 0)
         }else{
            Memory.testTimer.upgraderTest++;
         }

         var worker = new Upgrader(upgrader, {
            role: 'upgrader',
            assignedRoom: 'W8N3',
            bodyParts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
            name: upgrader.name
         });

         worker.doWork();

         if(Memory.testTimer.upgraderTest > tickLimit || controller.progress >= 1){
            delete Memory.testTimer.upgraderTest;
            expect(controller.progress).to.be.at.least(1);
            return 'DONE';
         }

         return 'WAITING';
      })
   }

   // getTicksToCompletePaths(paths, creep){
   //    return _.sum(paths, 'length') + ;
   // }

   describeHarvester(){
      it('should harvest energy if it needs energy', () => {

      });

      it('should fill the extensions first', () => {

      });

      it('should fill storage after extensions are full', () => {

      });      
   }

   describeRoomController(){
      it('should spawn a builder if there is a construction site', () => {

      });
   }
}

function it(testMsg, test){
   var status
   try {
      status = test();
   } catch (e) {
      console.log('FAILED - ' + testMsg);
      console.log('e: ', e);
      return;
   }

   if(status === 'WAITING'){
      console.log('WAITING - ' + testMsg);
   }else{
      console.log('Passed - ' + testMsg);
   }
}

module.exports = UnitTester