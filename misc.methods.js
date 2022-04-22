var FetchEnergy = {
    FetchEnergy: function (creep, onlyContainers = false) {
        var storageFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storageFiller');
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        var useContainers = true;
        var storages = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });
        if (onlyContainers)
            storages.length = 0;
        if (storages.length === 0 || storages[0].store.getUsedCapacity() < 1000)
        {
            storages = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
                }
            });
        }
        if (storages.length === 0)
            useContainers = false;
        
        if (useContainers) {
            var takenContainers = [];
            for (let i = 0; i < storageFillers.length; i++)
            {
                if(storageFillers[i].memory.container !== undefined)
                    takenContainers.push(storageFillers[i].memory.container);
            }
            for (let i = 0; i < storages.length; i++){
                if (creep.memory.container === undefined && !takenContainers.includes(storages[i].id))
                    creep.memory.container = storages[i].id
            }
            var currentContainer = storages[0];
            if (creep.memory.container != null)
                currentContainer = Game.getObjectById(creep.memory.container);
            
            if (creep.withdraw(currentContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && creep.store.getFreeCapacity() != 0) {
                creep.moveTo(currentContainer, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 50});
            }
        } else if (droppedResources.length > 0) {
            creep.pickup(droppedResources[0]);
            if (creep.pickup(droppedResources[0] == ERR_NOT_IN_RANGE) && creep.store.getFreeCapacity() != 0) {
                creep.moveTo(droppedResources[0], {reusePath: 50})
            }
        }
    },
    FindAvailableCords: function (room, relativePos){
        var terrain = Game.map.getRoomTerrain(room.name);
        var canBePlacedAbove = terrain.get(relativePos.x, relativePos.y - 1) !== TERRAIN_MASK_WALL;
        var canBePlacedLeft = terrain.get(relativePos.x - 1, relativePos.y) !== TERRAIN_MASK_WALL;
        var canBePlacedBelow = terrain.get(relativePos.x, relativePos.y + 1) !== TERRAIN_MASK_WALL;
        var canBePlacedRight = terrain.get(relativePos.x + 1, relativePos.y) !== TERRAIN_MASK_WALL;
        if (canBePlacedAbove)
            return new RoomPosition(relativePos.x, relativePos.y - 1, room.name);
        else if (canBePlacedLeft)
            return new RoomPosition(relativePos.x -1, relativePos.y, room.name);
        else if (canBePlacedBelow)
            return new RoomPosition(relativePos.x, relativePos.y + 1, room.name);
        else if (canBePlacedRight)
            return new RoomPosition(relativePos.x + 1, relativePos.y, room.name);
    },
    ShouldSpawn: function (creepCost, miners, extensionFillers, spawn){
        return ((spawn.room.energyAvailable == spawn.room.energyCapacityAvailable || spawn.room.energyAvailable >= creepCost) && miners > 0 && extensionFillers > 0)
    }
};
module.exports = FetchEnergy;