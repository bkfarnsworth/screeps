var util = require('util');
var chai = require('chai');
var expect = chai.expect;

// http://chaijs.com/api/bdd/
class UnitTester {

   runTests(){
      this.shouldPassSimpleTest();
   }

   shouldPassSimpleTest(){
      expect([1,2,3]).to.deep.equal([1,2,3]);
   }
}

module.exports = UnitTester

// shouldConvertRatiosToBodyPartsArray(){

//    var bodyPartsArray = util().convertRatiosToBodyPartArray({
//       energyToUseForBodyParts    : 600
//       movePercent                : 1/3, 
//       carryPercent               : 1/3,
//       workPercent                : 1/3,
//    });


//    //sort the output
//    //sort the thing I make
//    var expectedArray = [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];

//    this.assertEquals(bodyPartsArray, )

// }
