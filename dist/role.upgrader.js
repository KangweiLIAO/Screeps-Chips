// TODO: create comments
const roleCreep = require('role.creep');

class roleUpgrader extends roleCreep {
    /** @param {Creep} creep **/
    constructor(creep) {
        super();
        this.creep = creep;
    }

    run() {
        const creep = this.creep;
        if (creep.memory.renew != 'true') {
            if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.upgrading = false;
            }
            if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
                creep.memory.upgrading = true;
                creep.say('⚡ upgrade');
            }
            if(creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {reusePath: 10}, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.name == 'Upgrader0'){
                    creep.moveTo(new RoomPosition(7,11,'W38N5'));
                }
                if(creep.name == 'Upgrader1'){
                    creep.moveTo(new RoomPosition(8,11,'W38N5'));
                }
                if(creep.name == 'Upgrader2'){
                    creep.moveTo(new RoomPosition(10,11,'W38N5'));
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {reusePath: 10}, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
}
module.exports = roleUpgrader;