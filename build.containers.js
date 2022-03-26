var buildContainers = {
    run: function (room) {
        var sources = room.find(FIND_SOURCES);
        for (let i = 0; i < sources.length; i++) {
            var terrain = Game.map.getRoomTerrain(room.name);
            var canBePlacedAbove = terrain.get(sources[i].pos.x, sources[i].pos.y - 1) !== TERRAIN_MASK_WALL;
            var canBePlacedLeft = terrain.get(sources[i].pos.x - 1, sources[i].pos.y) !== TERRAIN_MASK_WALL;
            var canBePlacedBelow = terrain.get(sources[i].pos.x, sources[i].pos.y + 1) !== TERRAIN_MASK_WALL;
            var canBePlacedRight = terrain.get(sources[i].pos.x + 1, sources[i].pos.y) !== TERRAIN_MASK_WALL;
            if (canBePlacedAbove)
                Game.rooms[room.name].createConstructionSite(sources[i].pos.x, sources[i].pos.y - 1, STRUCTURE_CONTAINER, 'container' + Game.time);
            else if (canBePlacedLeft)
                Game.rooms[room.name].createConstructionSite(sources[i].pos.x - 1, sources[i].pos.y, STRUCTURE_CONTAINER, 'container' + Game.time);
            else if (canBePlacedBelow)
                Game.rooms[room.name].createConstructionSite(sources[i].pos.x, sources[i].pos.y + 1, STRUCTURE_CONTAINER, 'container' + Game.time);
            else if (canBePlacedRight)
                Game.rooms[room.name].createConstructionSite(ources[i].pos.x + 1, sources[i].pos.y, STRUCTURE_CONTAINER, 'container' + Game.time);
        }
    }
};
module.exports = buildContainers;