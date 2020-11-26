// TODO: create comments and implements methods
const structStructure = require("./struct.structure");

class structTower extends structStructure{
    /** @param {StructureTower} tower **/
    constructor(tower) {
        super();
        this.tower = tower;
    }

    attack() {}

    repair() {
        if (this.tower.store[RESOURCE_ENERGY] > this.tower.store.getCapacity('energy')*0.5) {
            var targets = this.tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    const ignore = []
                    return (!ignore.includes(structure.structureType) && structure.hits < structure.hitsMax*0.5);
                }
            });
            targets.sort((a, b) => (a.hits < b.hits) ? -1 : ((a.hits > b.hits) ? 1 : 0));
            if (targets[0].structureType != STRUCTURE_WALL) {
                this.tower.repair(targets[0]);
            } else {
                if(targets[0].hits < 250000) {
                    // Only repair walls with < 250K
                    this.tower.repair(targets[0]);
                }
            }
        }
    }
}

module.exports = structTower;