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

module.exports.loop = function () {
    for (var spawn in Game.spawns) {
        var currentSpawn = Game.spawns[spawn];
        if (Game.cpu.bucket > 9999)
            Game.cpu.generatePixel();
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
        var storageFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storageFiller');
        var spawnStorageFiller = false;
        var towerFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'towerFiller');
        var spawnTowerFiller = false;
        var roadRepair = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadRepair');
        var spawnRoadRepair = false;

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
        else if(towerFillers.length < 1 && towers.length !== 0 && towers[0].store.getFreeCapacity(RESOURCE_ENERGY) !== 0)
            spawnTowerFiller = true;
        else if(roadRepair.length < 1 && roads.length !== 0 )
            spawnRoadRepair = true;
        else if (upgraders.length < 1 || (currentSpawn.room.energyAvailable === currentSpawn.room.energyCapacityAvailable && (upgraders.length < 2 || storages[0].store.getUsedCapacity() > 100000 && upgraders.length < 4) && builders.length === 0))
            spawnUpgrader = true;


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
                case 'hauler':
                    roleHauler.run(creep);
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
            StorageEnergy: storages[0].store.getUsedCapacity()
        };
        /*    var counter = {i:0};
            var test =  {x:currentSpawn.pos.x + 7 , y: currentSpawn.pos.y + 3};
            var test2 =  {x:currentSpawn.pos.x , y: currentSpawn.pos.y + 13};
            var test3 =  {x:currentSpawn.pos.x, y: currentSpawn.pos.y + 3};
            drawExtensions(3, 10, currentSpawn, currentSpawn.pos, counter)
            drawExtensions(10, 3, currentSpawn, test, counter);
            drawExtensions(3, 10, currentSpawn, test2, counter);
            drawExtensions(10, 3, currentSpawn, test3, counter);
            //drawRoads(10, 16, currentSpawn);
            var test4 =  {x:currentSpawn.pos.x + 3, y: currentSpawn.pos.y + 3};
            var test5 =  {x:currentSpawn.pos.x + 7, y: currentSpawn.pos.y + 12};
            drawRoads(10, 4, test4, test5, currentSpawn);*/
    }
}

function drawExtensions(width, height, spawn, corner, counter){
    var ignoreX = spawn.pos.x + 4;
    var ignoreY = spawn.pos.y + 7;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            var isOnRoad = corner.x + j == ignoreX || corner.y + i == ignoreY;
            var isBothEven = i % 2 === 1 && j % 2 === 0;
            var isBothOdd = i % 2 === 0 && j % 2 === 1;
            var isCoordsFree = spawn.room.lookForAt(LOOK_STRUCTURES, corner.x + j, corner.y + i).length === 0;
            if(isOnRoad)
                spawn.room.visual.circle(corner.x + j,corner.y + i, {stroke: 'red'});
            if ((isBothOdd || isBothEven ) && isCoordsFree)
            {
                if(isOnRoad)
                    continue;
                spawn.room.visual.circle(corner.x + j,corner.y + i,  {stroke: 'yellow'})
                counter.i = counter.i + 1;
            }

        }
    }

}
function drawRoads(height, width, topCorner, bottomCorner, spawn){


    for (let i = 0; i < width; i++) {
        spawn.room.visual.circle(topCorner.x + i, topCorner.y, {stroke: 'red'});
        spawn.room.visual.circle(topCorner.x + i, topCorner.y + bottomCorner.y, {stroke: 'red'});
    }
    for (let i = 0; i < height; i++) {
        spawn.room.visual.circle(topCorner.x, topCorner.y + i, {stroke: 'red'});
        // var isOnRoad = topCorner.x == topCorner || spawn.pos.y == roadsY;
        //if(isOnRoad)
        //spawn.room.visual.circle(spawn.pos.x + j,spawn.pos.y + i, {stroke: 'red'});
    }
}