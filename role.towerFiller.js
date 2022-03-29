var misc = require('misc.methods');
var towerFiller = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var towers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        });
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.filling = true;
        }
        if (creep.store.getUsedCapacity() == 0 || creep.memory.filling == null) {
            creep.memory.filling = false;
        }
        if (creep.memory.filling) {
			if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			    creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
			}
        } else {
            misc.FetchEnergy(creep);
        }
    }
};
module.exports = towerFiller;