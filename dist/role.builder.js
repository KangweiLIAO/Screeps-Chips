// TODO: create comments
const roleCreep = require('role.creep');

class roleBuilder extends roleCreep {
    /** @param {Creep} creep **/
    constructor(creep) {
        super();
        this.creep = creep;
    }

	buildFlagged(targets) {
        // TODO: build flagged construction site
    }
}

module.exports = roleBuilder;