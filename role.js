var misc = require('misc.methods');
var Role = {
    Miner: function (creep) {
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var sources = creep.room.find(FIND_SOURCES);
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        var takenContainers = [];
        for (let i = 0; i < miners.length; i++)
        {
            if(miners[i].memory.container !== undefined)
                takenContainers.push(miners[i].memory.container);
        }
        for (let i = 0; i < containers.length; i++){
            if (creep.memory.container === undefined && !takenContainers.includes(containers[i].id))
                creep.memory.container = containers[i].id
        }
            
        if (containers.length === 0)
            containers[0] = sources[0];
        var currentContainer = containers[0];
        if (creep.memory.container != null)
            currentContainer = Game.getObjectById(creep.memory.container);
        var currentSource = _.sortBy(sources, s => currentContainer.pos.getRangeTo(s));
        if (creep.harvest(currentSource[0]) === ERR_NOT_IN_RANGE || creep.pos !== currentContainer.pos) {
            creep.moveTo(currentContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
        }

    },
    Builder: function (creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }
        if (creep.store.getUsedCapacity() == 0 || creep.memory.building == null) {
            creep.memory.building = false;
        }
        if (creep.memory.building) {
            if (targets.length) {
                creep.say(creep.build(targets[0]));
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else
            misc.FetchEnergy(creep);
    },
    Roomer: function(creep, roomFlag) {
        if(creep.memory.findRoom === undefined || creep.memory.findRoom === "")
            creep.memory.findRoom = roomFlag;
        
        const exitDir = creep.room.findExitTo("E32N41");
        const exit = creep.pos.findClosestByRange(exitDir);
        
        if(Game.rooms["E32N41"] !== undefined){
            var controllers = Game.rooms["E32N41"].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTROLLER);
                }
            });
            console.log(JSON.stringify(controllers[0]));
            creep.moveTo(controllers[0])
            console.log(creep.claimController(controllers[0]));
        }
        creep.moveTo(exit);
    },
    RoadRepair: function (creep, targets) {
        var lowRoad = _.min(targets, function(road) { return road.hits; });
        if(!creep.memory.road)
            creep.memory.road = lowRoad.id;
        
        var currentRoad = Game.getObjectById(creep.memory.road);
        if(currentRoad.hits == currentRoad.hitsMax)
        {
            creep.say('Full HP');
            creep.memory.road = ""
        }
        if(creep.store.getUsedCapacity() <= 0)
        {
            misc.FetchEnergy(creep);
        }
        if(creep.repair(currentRoad) == ERR_NOT_IN_RANGE) {
            creep.moveTo(currentRoad, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};
module.exports = Role;