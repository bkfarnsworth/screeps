var util = require('util');
var chai = require('chai');
var expect = chai.expect;

// http://chaijs.com/api/bdd/
class UnitTester {

   runTests(){

      console.log('---- TESTS ----');
      
      it('should pass simple test', () => {
         expect(true).to.deep.equal(true);
      });

      it('should pass simple test', () => {
         expect([1,2,3]).to.deep.equal([1,2,3]);
      });

      it('should convert ratios to body parts array', () => {

         var bodyPartsArray = util().convertRatiosToBodyPartArray({
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

   console.log('PASSED');
}

module.exports = UnitTester