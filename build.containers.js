var buildContainers = {
    run: function (room) {
        var sources = room.find(FIND_SOURCES);
        var terrain = Game.map.getRoomTerrain(room.name);
        var canBePlacedAbove = terrain.get(sources[0].pos.x, sources[0].pos.y - 1) !== TERRAIN_MASK_WALL;
        var canBePlacedLeft = terrain.get(sources[0].pos.x - 1, sources[0].pos.y) !== TERRAIN_MASK_WALL;
        var canBePlacedBelow = terrain.get(sources[0].pos.x, sources[0].pos.y + 1) !== TERRAIN_MASK_WALL;
        var canBePlacedRight = terrain.get(ources[0].pos.x + 1, sources[0].pos.y) !== TERRAIN_MASK_WALL;
        
        
        //Game.rooms[room].createConstructionSite(cornerPos.x + j, cornerPos.y + i, STRUCTURE_EXTENSION, 'extension' + Game.time);
    }
};
module.exports = buildContainers;