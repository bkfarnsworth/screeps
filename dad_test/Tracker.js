module.exports = function (totalEnergyAvailable, totalEnergyCapacity) {
    
    //TODO: do the decaying average for energy
    
    //was getting 19 at noon...so....
    //22 for 3
    
    var controller = Game.rooms.W11S5.controller;
    var serverHour = new Date().getHours();
    var hour = serverHour < 7 ? serverHour + 24 - 7 : serverHour - 7;
    var minutes = new Date().getMinutes();
    var roundedDownMinutes = Math.trunc(minutes / 10) * 10;
    
    // var number = 33;
    // alert(Math.trunc(number / 10) * 10);
    
    // console.log(hour)
    // console.log(timezoneOffset)
    // console.log(controller.progress + " / " + controller.progressTotal);
    
    //////////// LONG TERM CONTROLLER TRACKER
    if(!Memory.longTermControllerTracker){
        Memory.longTermControllerTracker = []
    }else{
        
        var hasCurrentTime = Memory.longTermControllerTracker.filter(function(datum){
            return datum.hour === hour && datum.minutes === roundedDownMinutes;
        }).length;
        
        if(!hasCurrentTime){
                
            var previousTotal = Memory.longTermControllerTracker[0].progress;
            
            Memory.longTermControllerTracker.unshift({
                hour: hour,
                minutes: roundedDownMinutes,
                progress: controller.progress,
                change: controller.progress - previousTotal,
                level: controller.level
            })
        }
    }
    var timeToNextLevel = 0;
    var lastHour = Memory.longTermControllerTracker.slice(0, 7);
    var sum = 0;
    var num = 0;
    lastHour.forEach(function(tenMinChunk){
        sum += (tenMinChunk.change || 1000);
        num++;
    })
    var tenMinAverage = sum / num;
    console.log('TEN MINUTE AVG: ' + tenMinAverage)
    var pointsToNextLevel = controller.progressTotal - controller.progress;
    // console.log(pointsToNextLevel)
    
    
    //I think this will give you the number of hours...
    console.log('EXPECTED TIME TO NEXT LEVEL: ' + parseFloat(((((pointsToNextLevel / tenMinAverage) * 10) / 60 ).toFixed(2))) + ' hours');
    
    
    ///////ENERGY TRACKER
    if(!Memory.energyTracker){
        Memory.energyTracker = {
            averageEnergyAvailable: 0,
            averageEnergyCapacity: 0
        };
    }else{
        var decayFactor = 0.9;
    
        Memory.energyTracker.averageEnergyAvailable *= decayFactor;
        Memory.energyTracker.averageEnergyCapacity *= decayFactor;
        Memory.energyTracker.averageEnergyAvailable += (totalEnergyAvailable * (1 - decayFactor));
        Memory.energyTracker.averageEnergyCapacity += (totalEnergyCapacity * (1 - decayFactor));
        
        //round
        Memory.energyTracker.averageEnergyAvailable = parseFloat(Memory.energyTracker.averageEnergyAvailable.toFixed(2))
        Memory.energyTracker.averageEnergyCapacity = parseFloat(Memory.energyTracker.averageEnergyCapacity.toFixed(2))
    }

    //////// CONTROLLER TRACKER
    if(!Memory.controllerTracker){
        Memory.controllerTracker = {
            averagePointsPerTick: 0,
            currentTotal: 0
        };
    }else{
        var decayFactor = 0.9;
        var previousTickTotal = Memory.controllerTracker.currentTotal || controller.progress;
        var currentTickUpgradePoints = controller.progress - previousTickTotal;
    
        Memory.controllerTracker.averagePointsPerTick *= decayFactor;
        Memory.controllerTracker.averagePointsPerTick += (currentTickUpgradePoints * (1 - decayFactor));
        Memory.controllerTracker.currentTotal = controller.progress;
        
        //round
        Memory.controllerTracker.averagePointsPerTick = parseFloat(Memory.controllerTracker.averagePointsPerTick.toFixed(2))
    }

}