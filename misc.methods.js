var FetchEnergy = {
    FetchEnergy: function (creep, onlyContainers = false) {
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        var useContainers = true;
        var storages = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });
        if (onlyContainers)
            storages.length = 0;
        if (storages.length === 0)
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
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && creep.store.getFreeCapacity() != 0) {
                creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (droppedResources.length > 0) {
            creep.pickup(droppedResources[0]);
            if (creep.pickup(droppedResources[0] == ERR_NOT_IN_RANGE) && creep.store.getFreeCapacity() != 0) {
                creep.moveTo(droppedResources[0])
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
    }
};
module.exports = FetchEnergy;