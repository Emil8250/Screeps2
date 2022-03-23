var SpawnMiner = {
    SpawnMiner: function (spawn) {

        var energyCapacity = spawn.room.energyCapacityAvailable;
        var energyAvailable = spawn.room.energyAvailable;
        if(energyCapacity === 300 || energyAvailable < 451)
            SpawnWorker(spawn, [WORK, WORK, MOVE]);
        else
            SpawnWorker(spawn,[WORK, WORK, WORK, WORK, MOVE]);

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