var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')
var buildExtensions = require('build.extensions');
module.exports.loop = function () {
    var gameSpawns = Object.keys(Game.spawns);
    var currentSpawn;
    for (var spawn in Game.spawns) {
        currentSpawn = Game.spawns[spawn];
    }
    if (Game.cpu.bucket > 5000)
        Game.cpu.generatePixel();

    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var spawnMiner = false;
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var spawnHauler = false;
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var spawnUpgrader = false;
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var spawnBuilder = false;
    
    if (miners.length < 1)
        spawnMiner = true;
    else if (haulers.length < 1)
        spawnHauler = true;
    else if (upgraders.length < 2)
        spawnUpgrader = true;
    else if (builders.length < 1)
        spawnBuilder = true;
    
    if (spawnMiner) {
        var newName = 'miner' + Game.time;
        currentSpawn.spawnCreep([WORK, WORK, MOVE], newName,
            {
                memory: {
                    role: 'miner',
                }
            });
    }
    if (spawnHauler) {
        var newName = 'hauler' + Game.time;
        currentSpawn.spawnCreep([WORK, CARRY, CARRY, MOVE], newName,
            {
                memory: {
                    role: 'hauler',
                }
            });
    }
    if (spawnUpgrader) {
        var newName = 'upgrader' + Game.time;
        currentSpawn.spawnCreep([WORK, WORK, CARRY, MOVE], newName,
            {
                memory: {
                    role: 'upgrader',
                }
            });
    }
    if (spawnBuilder) {
        var newName = 'builder' + Game.time;
        currentSpawn.spawnCreep([WORK, CARRY, CARRY, CARRY, MOVE], newName,
            {
                memory: {
                    role: 'builder',
                }
            });
    }
    buildExtensions.run(currentSpawn.room.name);
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        switch (creep.memory.role) {
            case 'miner':
                roleMiner.run(creep);
                break;
            case 'hauler':
                roleHauler.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
        }
    }
}
