// TODO: create comments and implements methods
const structStructure = require("./struct.structure");

class structTower extends structStructure{
    /** @param {StructureTower} tower **/
    constructor(tower) {
        super();
        this.tower = tower;
    }

    attack() {
        const tower = this.tower;
        const roomName = tower.room.name;
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        if (hostiles.length) {
            const username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
            this.tower.attack(hostiles[0]);
        }
        return hostiles.length;
    }

    repair() {
        const tower = this.tower;
        if (tower.store[RESOURCE_ENERGY] > tower.store.getCapacity('energy')*0.3) {
            var targets = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    const ignore = []
                    return (!ignore.includes(structure.structureType) && structure.hits < structure.hitsMax*0.5);
                }
            });
            targets.sort((a, b) => (a.hits < b.hits) ? -1 : ((a.hits > b.hits) ? 1 : 0));
            if (targets[0].structureType != STRUCTURE_WALL) {
                tower.repair(targets[0]);
            } else {
                if(targets[0].hits < 300000) {
                    // Only repair walls with < 250K
                    tower.repair(targets[0]);
                }
            }
        }
    }
}

module.exports = structTower;