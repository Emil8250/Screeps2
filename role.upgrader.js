var upgrader = {
    /** @param {Creep} creep **/
    run: function (creep) {
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
            creep.memory.upgrading = true;
        }
        if (creep.store.getUsedCapacity() == 0 || creep.memory.upgrading == null) {
            creep.memory.upgrading = false;
        }
        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            if(useContainers){
                if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && creep.store.getFreeCapacity() != 0) {
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else if (droppedResources.length > 0) {
                creep.pickup(droppedResources[0]);
                if (creep.pickup(droppedResources[0] == ERR_NOT_IN_RANGE) && creep.store.getFreeCapacity() != 0) {
                    creep.moveTo(droppedResources[0])
                }
            }
        }
    }
};
module.exports = upgrader;