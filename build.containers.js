var buildContainers = {
    run: function (room) {
        var sources = room.find(FIND_SOURCES);
        var terrain = Game.map.getRoomTerrain(room.name);
        var canBePlacedAbove = terrain.get(sources[0].pos.x, sources[0].pos.y - 1) !== TERRAIN_MASK_WALL;
        var canBePlacedLeft = terrain.get(sources[0].pos.x - 1, sources[0].pos.y) !== TERRAIN_MASK_WALL;
        var canBePlacedBelow = terrain.get(sources[0].pos.x, sources[0].pos.y + 1) !== TERRAIN_MASK_WALL;
        var canBePlacedRight = terrain.get(sources[0].pos.x + 1, sources[0].pos.y) !== TERRAIN_MASK_WALL;
        if (canBePlacedAbove)
            Game.rooms[room.name].createConstructionSite(sources[0].pos.x, sources[0].pos.y - 1, STRUCTURE_CONTAINER, 'container' + Game.time);
        else if (canBePlacedLeft)
            Game.rooms[room.name].createConstructionSite(sources[0].pos.x - 1, sources[0].pos.y, STRUCTURE_CONTAINER, 'container' + Game.time);
        else if (canBePlacedBelow)
            Game.rooms[room.name].createConstructionSite(sources[0].pos.x, sources[0].pos.y + 1, STRUCTURE_CONTAINER, 'container' + Game.time);
        else if (canBePlacedRight)
            Game.rooms[room.name].createConstructionSite(ources[0].pos.x + 1, sources[0].pos.y, STRUCTURE_CONTAINER, 'container' + Game.time);
    }
};
module.exports = buildContainers;