var buildExtenions = {

    run: function (room) {
        var flag = Game.flags.extensions;
        var size = 8;
        var flagPos = flag.pos;
        var cornerPos = new RoomPosition(flagPos.x, flagPos.y, room);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                var isBothEven = i % 2 === 0 && j % 2 === 0;
                var isBothOdd = i % 2 === 1 && j % 2 === 1;
                var isCoordsFree = Game.rooms[room].lookForAt(LOOK_FLAGS, cornerPos.x + j, cornerPos.y + i).length === 0;

                if ((isBothEven || isBothOdd) && isCoordsFree)
                    Game.rooms[room].createConstructionSite(cornerPos.x + j, cornerPos.y + i, STRUCTURE_EXTENSION, 'extension' + Game.time);
            }
        }
    }
};
module.exports = buildExtenions;