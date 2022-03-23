var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')
var buildExtensions = require('build.extensions');
var buildContainers = require('build.containers');
var roleContainerRepair = require('role.containerRepair');
var roleExtensionFiller = require('role.extionsionFiller');
var miscWorker = require('misc.workers');

module.exports.loop = function () {
    var currentSpawn;
    for (var spawn in Game.spawns) {
        currentSpawn = Game.spawns[spawn];
    }
    if (Game.cpu.bucket > 9999)
        Game.cpu.generatePixel();
    var totalAvailableEnergy = currentSpawn.room.energyAvailable;
    
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var spawnMiner = false;
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var spawnHauler = false;
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var spawnUpgrader = false;
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var spawnBuilder = false;
    var containerRepairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerRepair');
    var spawnContainerRepairer = false;
    var extensionFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'extensionFiller');
    var spawnExtensionFiller = false;

    var targets = currentSpawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER);
        }
    });
    var lowContainer;
    if (targets != null)
        lowContainer = _.min(targets, function(container) { return container.hits; });
    if (miners.length < 1)
        spawnMiner = true;
    /*else if (haulers.length < 1)
        spawnHauler = true;*/
    else if (builders.length < 1 && currentSpawn.room.find(FIND_CONSTRUCTION_SITES).length > 0)
        spawnBuilder = true;
    else if(containerRepairers.length < 1 && lowContainer != null && lowContainer.hits < 10000)
        spawnContainerRepairer = true;
    else if(extensionFillers.length < 1)
        spawnExtensionFiller = true;
    else if (totalAvailableEnergy > 650 && targets[0].store.getUsedCapacity() > 650)
        spawnUpgrader = true;
    if (spawnMiner) {
        miscWorker.SpawnMiner(currentSpawn);
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
    if (spawnContainerRepairer){
        var newName = 'containerRepairer' + Game.time;
        currentSpawn.spawnCreep([WORK, CARRY, CARRY, CARRY, MOVE], newName,
            {
                memory: {
                    role: 'containerRepair',
                }
            });
    }
    if (spawnExtensionFiller){
        var newName = 'extensionFiller' + Game.time;
        currentSpawn.spawnCreep([WORK, CARRY, CARRY, CARRY, MOVE], newName,
            {
                memory: {
                    role: 'extensionFiller',
                }
            });
    }
        
    buildExtensions.run(currentSpawn.room.name);
    buildContainers.run(currentSpawn.room);
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
            case 'extensionFiller':
                roleExtensionFiller.run(creep);
                break;
            case 'containerRepair':
                roleContainerRepair.run(creep, targets);
                break;
        }
    }
    Memory.stats = {
        ControllerProgress: Game.spawns.Spawn1.room.controller.progress,
        UsedCpu: Game.cpu.getUsed(),
        RCL: Game.spawns.Spawn1.room.controller.level,
        RCLCurrent: Game.spawns.Spawn1.room.controller.progress,
        RCLNext: Game.spawns.Spawn1.room.controller.progressTotal,
        GCL: Game.gcl.level,
        GCLCurrent: Game.gcl.progress,
        GCLNext: Game.gcl.progressTotal,
        Miners: miners.length,
        Upgraders: upgraders.length,
    };
}