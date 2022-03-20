var FetchEnergy = {
    FetchEnergy: function (creep) {
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        var useContainers = true;
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        if (containers.length === 0)
            useContainers = false;
        
        if (useContainers) {
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && creep.store.getFreeCapacity() != 0) {
                creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (droppedResources.length > 0) {
            creep.pickup(droppedResources[0]);
            if (creep.pickup(droppedResources[0] == ERR_NOT_IN_RANGE) && creep.store.getFreeCapacity() != 0) {
                creep.moveTo(droppedResources[0])
            }
        }
    }
};
module.exports = FetchEnergy;