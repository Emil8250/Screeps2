var misc = require('misc.methods');
var storageFiller = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var storages = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.filling = true;
        }
        if (creep.store.getUsedCapacity() == 0 || creep.memory.filling == null) {
            creep.memory.filling = false;
        }
        if (creep.memory.filling) {
            if (creep.transfer(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 50});
            }
        } else {
            misc.FetchEnergy(creep, true);
        }
    }
};
module.exports = storageFiller;