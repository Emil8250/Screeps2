var miscMethods = require('misc.methods')
var build = {
    storage: function (spawn) {
        var storagePos = miscMethods.FindAvailableCords(spawn.room,spawn.pos);
        Game.rooms[spawn.room.name].createConstructionSite(storagePos.x, storagePos.y, STRUCTURE_STORAGE, 'storage' + Game.time);
    }
};
module.exports = build;