// TODO: create comments and implements methods
var roleCreep = require('role.creep');

class roleAttacker extends roleCreep {
    /** 
     * @constructor constructor for harvester creep
     * @param {Creep} creep creep ref from Game.creeps[]
     **/
    constructor(creep) {
        super();
        this.creep = creep;
    }

    /**
     * @description basic running rules for attacker
     * @param {string[]} ignore_users users that won't be attacked
     */
    run(ignore_users=[]) {
        const creep = this.creep;
        if (creep.memory.renew != 'true') {
            var hostiles = Game.rooms[creep.room.name].find(FIND_HOSTILE_CREEPS);
            if (hostiles.length) {
                if (!ignore_users.includes(hostiles[0].owner.username)) {
                    if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostiles[0], {reusePath: 0,visualizePathStyle: {stroke: '#c72c33'}});
                    }
                }
            } else {
                creep.moveTo(new RoomPosition(2,28,'W38N5'));
            }
        }
    }
}

module.exports = roleAttacker;