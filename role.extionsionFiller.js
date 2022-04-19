var misc = require('misc.methods');
var extensionFiller = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var fillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'extensionFiller').sort((a,b) => a.ticksToLive - b.ticksToLive);
        
        var extensions = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.filling = true;
        }
        if (creep.store.getUsedCapacity() == 0 || creep.memory.filling == null) {
            creep.memory.filling = false;
        }
        if (creep.memory.filling) {
            for (let i = 0; i < fillers.length; i++)
            {
                if(creep.id === fillers[0].id){
                    if (creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(extensions[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }   
                }
                else{
                    if (creep.transfer(extensions[extensions.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(extensions[extensions.length - 1], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        } else {
            misc.FetchEnergy(creep);
        }
    }
};
module.exports = extensionFiller;
