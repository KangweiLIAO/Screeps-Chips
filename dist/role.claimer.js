// TODO: create comments and implements methods
var roleCreep = require('role.creep');

class roleClamier extends roleCreep {
    /** 
     * @constructor constructor for harvester creep
     * @param {Creep} creep creep ref from Game.creeps[]
     **/
    constructor(creep) {
        super();
        this.creep = creep;
    }

    /**
     * @description basic running rules for claimer
     */
    run() {

    }
}

module.exports = roleClamier;