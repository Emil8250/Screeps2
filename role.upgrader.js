var misc = require('misc.methods');
var upgrader = {
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
        }
        if (creep.store.getUsedCapacity() == 0 || creep.memory.upgrading == null) {
            creep.memory.upgrading = false;
        }
        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 25});
            }
        } else {
            misc.FetchEnergy(creep);
        }
    }
};
module.exports = upgrader;