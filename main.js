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
        var miners = [];
        var upgraders = [];
        var builders = [];
        var extensionFillers = [];
        var containerRepairers = [];
        var storageFillers = [];
        var towerFillers = [];
        var roadRepair = [];
        var currentSpawn = Game.spawns[spawn];
        /*for (const i in Game.creeps) {
            const currentCreep = Game.creeps[i];
            switch (currentCreep.memory.role) {
                case "miner":
                    miners.push(currentCreep);
                    break;
                case "upgrader":
                    upgraders.push(currentCreep);
                    break;
                case "builder":
                    
            }
        }*/
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
        console.log("1 " + currentSpawn.name + " " + Game.cpu.getUsed());
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];

            switch (creep.memory.role) {
                case 'miner':
                    miners.push(creep);
                    role.Miner(creep);
                    break;
                case 'roomer':
                    role.Roomer(creep, roomFlag);
                    break;
                case 'upgrader':
                    upgraders.push(creep);
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    builders.push(creep);
                    role.Builder(creep);
                    break;
                case 'extensionFiller':
                    extensionFillers.push(creep);
                    roleExtensionFiller.run(creep);
                    break;
                case 'containerRepair':
                    containerRepairers.push(creep);
                    roleContainerRepair.run(creep, targets);
                    break;
                case 'storageFiller':
                    storageFillers.push(creep);
                    roleStorageFiller.run(creep);
                    break;
                case 'towerFiller':
                    towerFillers.push(towerFillers);
                    roleTowerFiller.run(creep)
                    break;
                case 'roadRepair':
                    roadRepair.push(creep);
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
        
        //var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room === currentSpawn.room);
        var spawnMiner = false;
        //var externalBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'externalBuilder' && creep.room === currentSpawn.room);
        var spawnHauler = false;
       // var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room === currentSpawn.room );
        var spawnUpgrader = false;
        //var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room === currentSpawn.room);
        var spawnBuilder = false;
        //var containerRepairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerRepair' && creep.room === currentSpawn.room);
        var spawnContainerRepairer = false;
        //var extensionFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'extensionFiller' && creep.room === currentSpawn.room);
        var spawnExtensionFiller = false;
       // var storageFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storageFiller' && creep.room === currentSpawn.room);
        var spawnStorageFiller = false;
        //var towerFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'towerFiller' && creep.room === currentSpawn.room);
        var spawnTowerFiller = false;
       // var roadRepair = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadRepair' && creep.room === currentSpawn.room);
        var spawnRoadRepair = false;
        var spawnExternalBuider = false;
        //var externalUpgrader= _.filter(Game.creeps, (creep) => creep.memory.role == 'externalUpgrader' && creep.room === currentSpawn.room);
        var spawnExternalUpgrader = false;
        console.log("2 " + currentSpawn.name + " " + Game.cpu.getUsed());        
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

        var lowContainer;
        if (targets != null)
            lowContainer = _.min(targets, function(container) { return container.hits; });
        if (miners.length < 1 || (miners.length < targets.length && targets.length !== 0))
            spawnMiner = true;
        else if (builders.length < 2 || (builders.length < 3 &&  currentSpawn.room.controller.level <= 2) && currentSpawn.room.find(FIND_CONSTRUCTION_SITES).length > 0)
            spawnBuilder = true;
        else if(containerRepairers.length < 1 && lowContainer != null && lowContainer.hits < 100000)
            spawnContainerRepairer = true;
        else if(extensionFillers.length < 1 || (storages.length > 0 && storages[0].store.getUsedCapacity() > 100000 && extensionFillers.length < 2))
            spawnExtensionFiller = true;
        else if(storageFillers.length < 1 && storages.length !== 0 || storageFillers.length < targets.length && storages.length !== 0)
            spawnStorageFiller = true;
            // else if(externalBuilders.length < 3)
            //        spawnExternalBuider = true;
            // else if(externalUpgrader.length < 1)
        //    spawnExternalUpgrader = true;
        else if(towerFillers.length < 1 && towers.length !== 0 && towers[0].store.getFreeCapacity(RESOURCE_ENERGY) !== 0)
            spawnTowerFiller = true;
        else if(roadRepair.length < 1 && roads.length !== 0 )
            spawnRoadRepair = true;
        else if (upgraders.length < 1 || (currentSpawn.room.energyAvailable === currentSpawn.room.energyCapacityAvailable && (upgraders.length < 2 || storages[0].store.getUsedCapacity() > 100000 && upgraders.length < 4) && builders.length === 0))
            spawnUpgrader = true;

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
        if(currentSpawn.room.controller.level >= 6)
            buildExtensions.run(currentSpawn.room.name);
        buildContainers.run(currentSpawn.room);
        buildConstructions.storage(currentSpawn);
        buildConstructions.tower(currentSpawn);
        if(storages.length  > 0 )
        {
            buildConstructions.road(currentSpawn, storages[0].pos, controllers[0]);
            for (let i = 0; i < targets.length; i++) {
                buildConstructions.road(currentSpawn, storages[0].pos, targets[i]);
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
        if(storages.length  > 0)
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