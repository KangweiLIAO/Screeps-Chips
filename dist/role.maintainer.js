// TODO: create comments
const roleCreep = require('./role.creep');

class roleMaintainer extends roleCreep {
    /** 
     * @constructor constructor for maintainer creep
     * @param {Creep} creep creep ref from Game.creeps[]
     **/
    constructor(creep) {
        super();
        this.creep = creep;
    }

    run() {
        this.maintain();
    }
    /** 
     * @description maintain operation
     * @param {number} threshold threshold for maintaining targets [0,1] (default = 0.9)
     **/
    maintain(creep=this.creep, threshold=0.8) {
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
                // constants:
                const prefer_targets = [STRUCTURE_ROAD,STRUCTURE_CONTAINER];

                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (prefer_targets.includes(structure.structureType)) 
                            && (structure.hits <= structure.hitsMax*threshold);
                    }
                });
                // sort targets by the percentage of hits [low percent to high percent]
                targets.sort((a, b) => (a.hits/a.hitsMax < b.hits/b.hitsMax) ? 
                    -1 : ((a.hits/a.hitsMax > b.hits/b.hitsMax) ? 1 : 0));
                if(targets.length) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        // console.log(`Move to -> ${targets[0].pos}`)
                        creep.moveTo(targets[0], {reusePath: 0}, {visualizePathStyle: {stroke: '#377b4b'}});
                    }
                } 
                // else {
                //     this.build(undefined,0);
                // }
            }
        }
    }
}

module.exports = roleMaintainer;