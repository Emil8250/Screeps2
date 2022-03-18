var hauler = {
    run: function (creep) {
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        if (containers.length === 0) {
            containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });
        }
        if (droppedResources.length > 0) {
            creep.pickup(droppedResources[0]);
            if (creep.pickup(droppedResources[0] == ERR_NOT_IN_RANGE) && creep.store.getFreeCapacity() != 0) {
                creep.moveTo(droppedResources[0])
            } else if (creep.store.getFreeCapacity() == 0) {
                if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0],{visualizePathStyle: {stroke: '#eeeeee'}});
                }
            }
        }
        if (creep.store.getUsedCapacity() > 0) {
            if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0],{visualizePathStyle: {stroke: '#eeeeee'}});
            }
        }

    }
};
module.exports = hauler;