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
        const creep = this.creep;
        if (creep.memory.renew != 'true') {
            var flag_num = 0;
            var flagTargets = [];

            for (var name in Game.flags) {
                flag_num++;
                const flag = Game.flags[name]
                const color = flag.color;
                if (color == COLOR_ORANGE) {
                    var hasConstruct = false;
                    const look = this.creep.room.lookAt(flag.pos);
                    look.forEach(function (lookObj) {
                        if(lookObj.type == LOOK_CONSTRUCTION_SITES) {
                            // console.log(lookObj.constructionSite.pos);
                            flagTargets.push(lookObj.constructionSite);
                            hasConstruct = true;
                        }
                    });
                    if (!hasConstruct) {flag.remove()}
                }
            }
            if(flagTargets.length != 0){
                this.buildFlagged(flagTargets);
            } else {
                this.build(undefined,1);
            }
        }
    }

	buildFlagged(targets) {
        // TODO: build flagged construction site
        const creep = this.creep;
        if (creep.memory.renew != 'true') {
            this.build(targets[0],1);
        }
    }
}

module.exports = roleBuilder;