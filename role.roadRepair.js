var misc = require('misc.methods');
var roadRepair = {
    run: function (creep, targets) {
        var lowRoad = _.min(targets, function(road) { return road.hits; });
        if(!creep.memory.road)
            creep.memory.road = lowRoad.id;
        
        var currentRoad = Game.getObjectById(creep.memory.road);
        if(currentRoad.hits == currentRoad.hitsMax)
        {
            creep.say('Full HP');
            creep.memory.road = ""
        }
        if(creep.store.getUsedCapacity() <= 0)
        {
            misc.FetchEnergy(creep);
        }
        if(creep.repair(currentRoad) == ERR_NOT_IN_RANGE) {
            creep.moveTo(currentRoad, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};
module.exports = roadRepair;