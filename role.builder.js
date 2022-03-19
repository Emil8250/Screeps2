var builder = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var useContainers = true;
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        if (containers.length === 0)
            useContainers = false;
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }
        if (creep.store.getUsedCapacity() == 0 || creep.memory.building == null) {
            creep.memory.building = false;
        }
        if (creep.memory.building) {
            if (targets.length) {
                creep.say(creep.build(targets[0]));
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            if (useContainers) {
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && creep.store.getFreeCapacity() != 0) {
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else if (droppedResources.length > 0) {
                creep.pickup(droppedResources[0]);
                if (creep.pickup(droppedResources[0] === ERR_NOT_IN_RANGE) && creep.store.getFreeCapacity() != 0) {
                    creep.moveTo(droppedResources[0])
                }
            }
        }
    }
};
module.exports = builder;