var miscMethods = require('misc.methods')
var build = {
    storage: function (spawn) {
        var storagePos = miscMethods.FindAvailableCords(spawn.room,spawn.pos);
        Game.rooms[spawn.room.name].createConstructionSite(storagePos.x, storagePos.y, STRUCTURE_STORAGE, 'storage' + Game.time);
    },
    tower: function(spawn){
        var towerPosition = Game.flags.tower.pos;
        Game.rooms[spawn.room.name].createConstructionSite(towerPosition.x, towerPosition.y, STRUCTURE_TOWER, 'tower' + Game.time);
    },
    road: function(spawn, origin, goal){
        var path = Game.rooms[spawn.room.name].findPath(origin, goal.pos, {
            ignoreCreeps: true,
            ignoreRoads: true,
            swampCost: 1
        });
        for (let i = 0; i < path.length; i++) {
            Game.rooms[spawn.room.name].createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD, 'road' + Game.time);
            //TODO: Construct road
        }
      }
};
module.exports = build;