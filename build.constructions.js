var miscMethods = require('misc.methods')
var build = {
    storage: function (spawn) {
        var storagePos = miscMethods.FindAvailableCords(spawn.room,spawn.pos);
        Game.rooms[spawn.room.name].createConstructionSite(storagePos.x, storagePos.y, STRUCTURE_STORAGE, 'storage' + Game.time);
    },
    tower: function(spawn){
        var towerPosition = Game.flags.tower.pos;
        Game.rooms[spawn.room.name].createConstructionSite(towerPosition.x, towerPosition.y, STRUCTURE_TOWER, 'tower' + Game.time);
    }
};
module.exports = build;