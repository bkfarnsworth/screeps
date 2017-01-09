var util = require('util');
var chai = require('chai');
var expect = chai.expect;

// http://chaijs.com/api/bdd/
class UnitTester {

   runTests(){
      console.log('---- TESTS ----');

      describeConvertRatiosToBodyPartsArray();
      describeUpgrader();
      describeHarvester();
      describeRoomController();
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
      it('should get energy from storage if there is energy', () => {
         //if there is an upgrader, start keeping track of it
         //if it doesn't upgrade in 1500 ticks, fail the test.
         //could do less ticks too.  
      });

      it('should upgrade the controller if it has enough energy', () => {

      });
   }

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
   try {
      test();
   } catch (e) {
      console.log('FAILED - ' + testMsg);
      console.log('e: ', e);
      return;
   }

   console.log('Passed - ' + testMsg);
}

module.exports = UnitTester