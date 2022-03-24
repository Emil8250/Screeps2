var SpawnMiner = {
    SpawnMiner: function (spawn) {
        var energyAvailable = spawn.room.energyAvailable;
        if (energyAvailable > 651) SpawnWorker(spawn, [WORK, WORK, WORK, WORK, WORK, MOVE], 'miner'); else if (energyAvailable > 451) SpawnWorker(spawn, [WORK, WORK, WORK, WORK, MOVE], 'miner'); else SpawnWorker(spawn, [WORK, WORK, MOVE], 'miner');

    }
};

var SpawnUpgrader = {
    SpawnUpgrader: function (spawn) {
        var role = 'upgrader';
        var energyAvailable = spawn.room.energyAvailable;
        if (energyAvailable > 551) SpawnWorker(spawn, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE], role); else if (energyAvailable > 401) SpawnWorker(spawn, [WORK, WORK, CARRY, CARRY, CARRY, MOVE], role); else SpawnWorker(spawn, [WORK, WORK, CARRY, MOVE], role);
    }
};

var SpawnFiller = {
    SpawnFiller: function (spawn) {
        var role = 'extensionFiller';
        var energyAvailable = spawn.room.energyAvailable;
        if (energyAvailable > 601) SpawnWorker(spawn, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role); else if (energyAvailable > 501) SpawnWorker(spawn, [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role); else SpawnWorker(spawn, [WORK, CARRY, CARRY, CARRY, MOVE], role);
    }
};

var SpawnBuilder = {
    SpawnBuilder: function (spawn) {
        var role = 'builder';
        var energyAvailable = spawn.room.energyAvailable;
        if (energyAvailable > 601) SpawnWorker(spawn, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], role); else if (energyAvailable > 501) SpawnWorker(spawn, [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], role); else SpawnWorker(spawn, [WORK, CARRY, CARRY, CARRY, MOVE], role);
    }
}

function SpawnWorker(spawn, worker, role) {
    var newName = role + Game.time;
    spawn.spawnCreep(worker, newName, {
        memory: {
            role: role,
        }
    });
};
module.exports = {SpawnMiner: SpawnMiner, SpawnUpgrader: SpawnUpgrader, SpawnFiller: SpawnFiller, SpawnBuilder: SpawnBuilder};