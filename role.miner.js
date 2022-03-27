var miner = {
    run: function (creep) {
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var sources = creep.room.find(FIND_SOURCES);
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        var takenContainers = [];
        for (let i = 0; i < miners.length; i++)
        {
            if(miners[i].memory.container !== undefined)
                takenContainers.push(miners[i].memory.container);
        }
        for (let i = 0; i < containers.length; i++){
            if (creep.memory.container === undefined && !takenContainers.includes(containers[i].id))
                creep.memory.container = containers[i].id
        }
            
        if (containers.length === 0)
            containers[0] = sources[0];
        var currentContainer = containers[0];
        if (creep.memory.container != null)
            currentContainer = Game.getObjectById(creep.memory.container);
        var currentSource = _.sortBy(sources, s => currentContainer.pos.getRangeTo(s));
        if (creep.harvest(currentSource[0]) === ERR_NOT_IN_RANGE || creep.pos !== currentContainer.pos) {
            creep.moveTo(currentContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
        }

    }
};
module.exports = miner;