var containerRepair = {
    run: function (creep, targets) {
        var lowContainer = _.min(targets, function(container) { return container.hits; });
        if(!creep.memory.container)
            creep.memory.container = lowContainer.id;
        var currentContainer = Game.getObjectById(creep.memory.container);
        if(currentContainer.hits == currentContainer.hitsMax)
        {
            creep.say('Full HP');
            creep.memory.container = ""
        }
        if(lowContainer.hits < 15000 && currentContainer > 25000)
        {
            creep.memory.container = lowContainer.id;
            currentContainer = lowContainer;
        }
        if(creep.store.getUsedCapacity() <= 0)
        {
            if(creep.withdraw(currentContainer, RESOURCE_ENERGY) == -9) {
                creep.moveTo(currentContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        if(creep.repair(currentContainer) == ERR_NOT_IN_RANGE) {
            creep.moveTo(currentContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};
module.exports = containerRepair;