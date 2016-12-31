var util = require('util');
// var jasmine = require('jasmine')


// util().printObject(this)

class UnitTester {

   runTests(){

      // this.shouldConvertRatiosToBodyPartsArray():
      this.shouldPassSimpleTest();


   }

   shouldPassSimpleTest(){
      this.expectArraysToBeEqual([1,2], [3,2,1]);
   }


   /////////TEST UTILITIES
   expectToBeEqual(actual, expected){
      if(Array.isArray(expected)){
         return expectArraysToBeEqual(actual, expected);
      }
   }

   expectArraysToBeEqual(actual, expected){

      if(actual.length !== expected.length){
         return console.log('FAIL') ;
      }

      //sort them
      actual.sort();
      expected.sort();

      for (var i = 0; i < expected.length; i++) {
         if(expected[i] !== actual[i]){
            return console.log('FAIL')
         }
      }

      return console.log('PASS');
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
