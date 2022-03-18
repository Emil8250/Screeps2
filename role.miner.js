var miner = {
    run: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
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
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE || creep.pos != sources[0].pos) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }

    }
};
module.exports = miner;