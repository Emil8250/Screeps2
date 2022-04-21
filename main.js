var role = require('role');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader')
var buildExtensions = require('build.extensions');
var buildContainers = require('build.containers');
var roleContainerRepair = require('role.containerRepair');
var roleExtensionFiller = require('role.extionsionFiller');
var roleStorageFiller = require('role.storageFiller');
var roleTowerFiller = require('role.towerFiller');
var miscWorker = require('misc.workers');
var buildConstructions = require('build.constructions')
const {SpawnExternalBuilder} = require("./misc.workers");

module.exports.loop = function () {
    var ControllerProgress;
    var RCL;
    var RCLCurrent;
    var RCLNext;
    var Miners;
    var Upgraders;
    var StorageEnergy;
    var totalExternalBuilders = 0;
    
    for (var spawn in Game.spawns) {
        var currentSpawn = Game.spawns[spawn];
        if (Game.cpu.bucket > 9999)
            Game.cpu.generatePixel();
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var spawnMiner = false;
        var externalBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'externalBuilder');
        var spawnHauler = false;
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var spawnUpgrader = false;
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var spawnBuilder = false;
        var containerRepairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerRepair');
        var spawnContainerRepairer = false;
        var extensionFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'extensionFiller');
        var spawnExtensionFiller = false;
        var storageFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storageFiller');
        var spawnStorageFiller = false;
        var towerFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'towerFiller');
        var spawnTowerFiller = false;
        var roadRepair = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadRepair');
        var spawnRoadRepair = false;
        var spawnExternalBuider = false;
        var externalUpgrader= _.filter(Game.creeps, (creep) => creep.memory.role == 'externalUpgrader');
        var spawnExternalUpgrader = false;
        var storages = currentSpawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });

        var towers = currentSpawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        });
        var controllers = currentSpawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTROLLER);
            }
        });
        var hostiles = currentSpawn.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0 && towers.length > 0) {
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
        var targets = currentSpawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        var roads = currentSpawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_ROAD);
            }
        });

        var lowContainer;
        if (targets != null)
            lowContainer = _.min(targets, function(container) { return container.hits; });
        if (miners.length < 1 || miners.length < targets.length)
            spawnMiner = true;
        else if (builders.length < 1 && currentSpawn.room.find(FIND_CONSTRUCTION_SITES).length > 0)
            spawnBuilder = true;
        else if(containerRepairers.length < 1 && lowContainer != null && lowContainer.hits < 100000)
            spawnContainerRepairer = true;
        else if(extensionFillers.length < 1 || (storages.length > 0 && storages[0].store.getUsedCapacity() > 100000 && extensionFillers.length < 2))
            spawnExtensionFiller = true;
        else if(storageFillers.length < 1 && storages.length !== 0 || storageFillers.length < targets.length && storages.length !== 0)
            spawnStorageFiller = true;
        else if(externalBuilders.length < 3)
            spawnExternalBuider = true;
        else if(externalUpgrader.length < 1)
            spawnExternalUpgrader = true;
        else if(towerFillers.length < 1 && towers.length !== 0 && towers[0].store.getFreeCapacity(RESOURCE_ENERGY) !== 0)
            spawnTowerFiller = true;
        else if(roadRepair.length < 1 && roads.length !== 0 )
            spawnRoadRepair = true;
        else if (upgraders.length < 1 || (currentSpawn.room.energyAvailable === currentSpawn.room.energyCapacityAvailable && (upgraders.length < 2 || storages[0].store.getUsedCapacity() > 100000 && upgraders.length < 4) && builders.length === 0))
            spawnUpgrader = true;

        console.log(externalBuilders);
        var roomFlag = "";
        for(var flag in Game.flags) {
            if(Game.flags[flag].color == COLOR_GREEN){
                roomFlag = Game.flags[flag].name;
            }
        }
        
        if(roomFlag !== "")
            miscWorker.SpawnRoomer.SpawnRoomer(currentSpawn);
        if(spawnExternalBuider){
            miscWorker.SpawnExternalBuilder.SpawnExternalBuilder(currentSpawn);
        }
        if(spawnExternalUpgrader){
            miscWorker.SpawnExternalUpgrader.SpawnExternalUpgrader(currentSpawn);
        }
        if (spawnMiner) {
            miscWorker.SpawnMiner.SpawnMiner(currentSpawn);
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
        if(spawnRoadRepair)
            miscWorker.SpawnRoadRepair.SpawnRoadRepair(currentSpawn);
        if (spawnUpgrader) {
            miscWorker.SpawnUpgrader.SpawnUpgrader(currentSpawn);
        }
        if (spawnBuilder) {
            miscWorker.SpawnBuilder.SpawnBuilder(currentSpawn);
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
            miscWorker.SpawnFiller.SpawnFiller(currentSpawn);
        }
        if (spawnStorageFiller)
            miscWorker.SpawnStorageFiller.SpawnStorageFiller(currentSpawn, miners.length, extensionFillers.length);
        if (spawnTowerFiller)
            miscWorker.SpawnTowerFiller.SpawnTowerFiller(currentSpawn);
        buildExtensions.run(currentSpawn.room.name);
        buildContainers.run(currentSpawn.room);
        buildConstructions.storage(currentSpawn);
        buildConstructions.tower(currentSpawn);
        buildConstructions.road(currentSpawn, storages[0].pos, controllers[0]);
        for (let i = 0; i < targets.length; i++) {
            buildConstructions.road(currentSpawn, storages[0].pos, targets[i]);
        }
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];

            switch (creep.memory.role) {
                case 'miner':
                    role.Miner(creep);
                    break;
                case 'roomer':
                    role.Roomer(creep, roomFlag);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    role.Builder(creep);
                    break;
                case 'extensionFiller':
                    roleExtensionFiller.run(creep);
                    break;
                case 'containerRepair':
                    roleContainerRepair.run(creep, targets);
                    break;
                case 'storageFiller':
                    roleStorageFiller.run(creep);
                    break;
                case 'towerFiller':
                    roleTowerFiller.run(creep)
                    break;
                case 'roadRepair':
                    role.RoadRepair(creep, roads)
                    break;
                case 'externalBuilder':
                    role.ExternalBuilder(creep, "E32N41")
                    break;
                case 'externalUpgrader':
                    role.ExternalUpgrader(creep, "E32N41")
                    break;
            }
        }
        var test =  {x:currentSpawn.pos.x + 7 , y: currentSpawn.pos.y + 3};
        var test2 =  {x:currentSpawn.pos.x , y: currentSpawn.pos.y + 13};
        var test3 =  {x:currentSpawn.pos.x, y: currentSpawn.pos.y + 3};
        buildExtensions.buildBase(3, 10, currentSpawn, currentSpawn.pos);
        buildExtensions.buildBase(10, 3, currentSpawn, test);
        buildExtensions.buildBase(3, 10, currentSpawn, test2);
        buildExtensions.buildBase(10, 3, currentSpawn, test3);
        ControllerProgress += currentSpawn.room.controller.progress;
        RCL += currentSpawn.room.controller.level;
        RCLCurrent += currentSpawn.room.controller.progress;
        RCLNext += currentSpawn.room.controller.progressTotal;
        Miners += miners.length;
        Upgraders += upgraders.length;
        if(storages)
            StorageEnergy += storages[0].store.getUsedCapacity()
        
    }
    Memory.stats = {
        ControllerProgress: ControllerProgress,
        UsedCpu: Game.cpu.getUsed(),
        RCL: RCL,
        RCLCurrent: RCLCurrent,
        RCLNext: RCLNext,
        GCL: Game.gcl.level,
        GCLCurrent: Game.gcl.progress,
        GCLNext: Game.gcl.progressTotal,
        Miners: Miners,
        Upgraders: Upgraders,
        StorageEnergy: StorageEnergy
    };
}