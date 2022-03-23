var SpawnMiner = {
    SpawnMiner: function (spawn) {

        var energyCapacity = spawn.room.energyCapacityAvailable;
        var energyAvailable = spawn.room.energyAvailable;
        if(energyAvailable > 651)
            SpawnWorker(spawn,[WORK, WORK, WORK, WORK, WORK, MOVE]);
        else if(energyAvailable > 451)
            SpawnWorker(spawn,[WORK, WORK, WORK, WORK, MOVE]);
        else
            SpawnWorker(spawn,[WORK, WORK, MOVE]);

    }
};

function SpawnWorker(spawn, worker){
    var newName = 'miner' + Game.time;
    spawn.spawnCreep(worker, newName,
        {
            memory: {
                role: 'miner',
            }
        });
};
module.exports = SpawnMiner;