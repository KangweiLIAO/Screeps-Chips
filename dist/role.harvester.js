const roleCreep = require('role.creep');

/**
 * @description Harvester creeps are creeps that focus on 
 *              harvesting energy and transferring to energy structures
 * @class roleHarvester
 * @requires roleCreep
 * @extends {roleCreep}
 */
class roleHarvester extends roleCreep {
    /** 
     * @constructor constructor for harvester creep
     * @param {Creep} creep creep ref from Game.creeps[]
     **/
    constructor(creep) {
        super();
        this.creep = creep;
    }

    run() {
        const creep = this.creep;
        if (creep.memory.renew != 'true') {
            if(!creep.memory.harvesting && creep.store.getUsedCapacity() < 50) {
                // if not harvesting and stored energy < 50, harvest
                creep.memory.harvesting = true;
                creep.say(String.fromCodePoint(0x1F528)+"Harvest");
            }
            if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
                // if harvesting and full, stop harvest
                creep.memory.harvesting = false;
            }
            if(creep.memory.harvesting) {
                // if in harvesting state, do:
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 0});
                }
            } else {
                // if not in harvesting state, transfer energy to indicated structure:
                var energy_structs = [STRUCTURE_EXTENSION,STRUCTURE_SPAWN,STRUCTURE_STORAGE,STRUCTURE_TOWER];
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            // if current structure is an energy structure
                            return energy_structs.includes(structure.structureType) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                // sort targets from [low energy to high energy]:
                targets.sort((a, b) => (a.store[RESOURCE_ENERGY] < b.store[RESOURCE_ENERGY]) ? 
                    -1 : ((a.store[RESOURCE_ENERGY] > b.store[RESOURCE_ENERGY]) ? 1 : 0));
                if(targets.length) {
                    // if target exist, move to target and transfer energy
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'},reusePath: 0});
                    }
                }
            }
        }
    }
}
module.exports = roleHarvester;