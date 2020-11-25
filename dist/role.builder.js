// TODO: create comments
const roleCreep = require('role.creep');

class roleBuilder extends roleCreep {
    /** 
     * @constructor constructor for harvester creep
     * @param {Creep} creep creep ref from Game.creeps[]
     **/
    constructor(creep) {
        super();
        this.creep = creep;
    }

    /**
     * @description basic running rules for builder
     */
    run() {

    }

	buildFlagged(targets) {
        // TODO: build flagged construction site
    }
}

module.exports = roleBuilder;