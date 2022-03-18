var builder = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }
        if (creep.store.getUsedCapacity() == 0 || creep.memory.building == null) {
            creep.memory.building = false;
        }
        if (creep.memory.building) {
            if(targets.length) {
                creep.say(creep.build(targets[0]));
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            if (droppedResources.length > 0) {
                creep.pickup(droppedResources[0]);
                if (creep.pickup(droppedResources[0] === ERR_NOT_IN_RANGE) && creep.store.getFreeCapacity() != 0) {
                    creep.moveTo(droppedResources[0])
                }
            }
        }
    }
};
module.exports = builder;