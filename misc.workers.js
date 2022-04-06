var miscMethods = require('misc.methods');
var SpawnMiner = {
    SpawnMiner: function (spawn) {
        var energyAvailable = spawn.room.energyAvailable;
        if (energyAvailable > 551)
            SpawnWorker(spawn, [WORK, WORK, WORK, WORK, WORK, MOVE], 'miner');
        else if (energyAvailable > 451) 
            SpawnWorker(spawn, [WORK, WORK, WORK, WORK, MOVE], 'miner'); 
        else 
            SpawnWorker(spawn, [WORK, WORK, MOVE], 'miner');

    }
};

var SpawnUpgrader = {
    SpawnUpgrader: function (spawn) {
        var role = 'upgrader';
        var energyAvailable = spawn.room.energyAvailable;
        if (energyAvailable > 1299) 
            SpawnWorker(spawn, [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], role); 
        else if (energyAvailable > 851) 
            SpawnWorker(spawn, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role); 
        else if (energyAvailable > 751) 
            SpawnWorker(spawn, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role); 
        else if (energyAvailable > 651) 
            SpawnWorker(spawn, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role); 
        else if (energyAvailable > 551) 
            SpawnWorker(spawn, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE], role); 
        else if (energyAvailable > 401) 
            SpawnWorker(spawn, [WORK, WORK, CARRY, CARRY, CARRY, MOVE], role); 
        else 
            SpawnWorker(spawn, [WORK, WORK, CARRY, MOVE], role);
    }
};

var SpawnFiller = {
    SpawnFiller: function (spawn) {
        var role = 'extensionFiller';
        var energyAvailable = spawn.room.energyAvailable;
        if (energyAvailable > 701) 
            SpawnWorker(spawn, [WORK, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role);
        else if (energyAvailable > 601) 
            SpawnWorker(spawn, [WORK, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role);
        else if (energyAvailable > 501) 
            SpawnWorker(spawn, [WORK, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role);
        else 
            SpawnWorker(spawn, [WORK, CARRY, CARRY, CARRY, MOVE], role);
    }
};

var SpawnBuilder = {
    SpawnBuilder: function (spawn) {
        var role = 'builder';
        var energyAvailable = spawn.room.energyAvailable;
        if(energyAvailable >= 1300)
            SpawnWorker(spawn, [WORK, WORK,WORK,WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], role); 
        else if (energyAvailable > 1001) 
            SpawnWorker(spawn, [WORK, WORK,WORK,WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], role); 
        else if (energyAvailable > 601) 
            SpawnWorker(spawn, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], role); 
        else if (energyAvailable > 501) 
            SpawnWorker(spawn, [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], role); 
        else 
            SpawnWorker(spawn, [WORK, CARRY, CARRY, CARRY, MOVE], role);
    }
}

var SpawnRoadRepair = {
    SpawnRoadRepair: function (spawn) {
        var role = 'roadRepair';
        var energyAvailable = spawn.room.energyAvailable;
        if (energyAvailable > 601) 
            SpawnWorker(spawn, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], role); 
        else if (energyAvailable > 501) 
            SpawnWorker(spawn, [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], role); 
        else 
            SpawnWorker(spawn, [WORK, CARRY, CARRY, CARRY, MOVE], role);
    }
}

var SpawnStorageFiller = {
    SpawnStorageFiller: function (spawn, miners, extensionFillers) {
        var role = 'storageFiller';
        var energyAvailable = spawn.room.energyAvailable;
        if(!miscMethods.ShouldSpawn(1300, miners, extensionFillers, spawn))
            return;
        if(energyAvailable >= 1300)
            SpawnWorker(spawn, [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], role);
        else if(energyAvailable > 1001)
            SpawnWorker(spawn, [CARRY, CARRY, CARRY, CARRY,CARRY, CARRY,CARRY, CARRY,CARRY, CARRY,CARRY, CARRY,CARRY, CARRY,CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], role);
        else if (energyAvailable > 601) 
            SpawnWorker(spawn, [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role); 
        if (energyAvailable > 501) 
            SpawnWorker(spawn, [CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role); 
        else 
            SpawnWorker(spawn, [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], role);
    }
}

var SpawnTowerFiller = {
    SpawnTowerFiller: function (spawn) {
        var role = 'towerFiller';
        SpawnWorker(spawn, [WORK, CARRY, CARRY, CARRY, MOVE], role);
    }
}

function SpawnWorker(spawn, worker, role) {
    var newName = role + Game.time;
    spawn.spawnCreep(worker, newName, {
        memory: {
            role: role,
        }
    });
}

module.exports = {
    SpawnMiner: SpawnMiner,
    SpawnUpgrader: SpawnUpgrader,
    SpawnFiller: SpawnFiller,
    SpawnBuilder: SpawnBuilder,
    SpawnStorageFiller: SpawnStorageFiller,
    SpawnTowerFiller:SpawnTowerFiller,
    SpawnRoadRepair:SpawnRoadRepair
};
