// TODO: create comments
const roleBuilder = require('./role.builder');

class roleMaintainer extends roleBuilder {
    maintain(maintain_threshold=0.9) {
        const creep = this.creep;
        if (creep.memory.renew != 'true') {
            if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.repairing = false;
            }
            if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
                creep.memory.repairing = true;
                creep.say('🚧 Repair');
            }
            if(!creep.memory.repairing) {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {reusePath: 10}, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        // if current structure
                        // console.log(structure.structureType);
                        return (structure.structureType==STRUCTURE_ROAD) && (structure.hits <= structure.hitsMax*maintain_threshold);
                    }
                });
                targets.sort((a, b) => (a.hits < b.hits) ? -1 : ((a.hits > b.hits) ? 1 : 0));
                if(targets.length) {
                    // console.log(targets.length);
                    // console.log('Moving -> ', targets[0].pos);
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {reusePath: 0}, {visualizePathStyle: {stroke: '#377b4b'}});
                    }
                } else {
                    creep.moveTo(new RoomPosition(12,22,'W38N5'));
                }
            }
        }
    }
}

module.exports = roleMaintainer;