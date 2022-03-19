var miner = {
    run: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        if (containers.length === 0)
            containers[0] = sources[0];
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE || creep.pos != containers[0].pos) {
            creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }

    }
};
module.exports = miner;