// TODO: create comments
const roleBuilder = require('./role.builder');

class roleMaintainer extends roleBuilder {
    run() {
        
    }
    /** 
     * @description maintain operation
     * @param {number} maintain_threshold threshold for maintaining targets [0,1] (default = 0.9)
     **/
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
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {reusePath:10, visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        // if current structure
                        // console.log(structure.structureType);
                        return (structure.structureType!=STRUCTURE_WALL) && (structure.hits <= structure.hitsMax*maintain_threshold);
                    }
                });
                // sort targets by the percentage of hits [low percent to high percent]
                targets.sort((a, b) => (a.hitsMax/a.hits > b.hitsMax/b.hits) ? 
                    -1 : ((a.hitsMax/a.hits < b.hitsMax/b.hits) ? 1 : 0));
                if(targets.length) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {reusePath: 0}, {visualizePathStyle: {stroke: '#377b4b'}});
                    }
                } else {
                    this.build(undefined,0);
                }
            }
        }
    }
}

module.exports = roleMaintainer;