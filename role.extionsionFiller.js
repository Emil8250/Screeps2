var extensionFiller = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var extensions = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        var useContainers = true;
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        if (containers.length === 0)
            useContainers = false;

        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.filling = true;
        }
        if (creep.store.getUsedCapacity() == 0 || creep.memory.filling == null) {
            creep.memory.filling = false;
        }
        if (creep.memory.filling) {
            if (creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(extensions[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
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
    }
};
module.exports = extensionFiller;