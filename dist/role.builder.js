// TODO: create comments
const roleCreep = require('role.creep');
const roleMaintainer = require('role.maintainer');

class roleBuilder extends roleCreep {
    /** 
     * @constructor constructor for builder creep
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

    /**
     * @description Find and build structures
     * @param {RoomPosition} target 
     * @param {number} source
     * @param {roleCreep} secondTask default value is undefined creep instance
     */
    build (target=undefined, source) {
        const creep = this.creep;
        if (creep.memory.renew != 'true') {
            if(creep.memory.building && creep.store.getUsedCapacity() == 0) {
                // if don't have energy, quit building state:
                creep.memory.building = false;
            }
            if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
                // if have full energy, enter building state:
                creep.memory.building = true;
                creep.say('🚧 Build');
            }
            if(!creep.memory.building) {
                // if not in building mode, harvest sources:
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[source]) == ERR_NOT_IN_RANGE) {
                    this.moveTo_(sources[source].pos);
                }
            } else {
                if (target != undefined) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        this.moveTo_(target.pos);
                    }
                } else {
                    // if in building mode, find construction site and build:
                    var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                    // sort targets from [low progressTotal to high progressTotal]:
                    targets.sort((a, b) => (a.progressTotal < b.progressTotal) ? 
                        -1 : ((a.progressTotal > b.progressTotal) ? 1 : 0));
                    if(targets.length) {
                        // if targets exist, go and build:
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            // var path = creep.room.findPath(creep.pos,targets[0].pos,
                            //     {visualizePathStyle: {stroke: '#ffffff'}, maxRooms:1});
                            // creep.moveByPath(path);
                            this.moveTo_(targets[0].pos);
                        }
                    } else {
                        // if no construction sites exist
                        new roleMaintainer(creep).maintain(this.creep);
                    }
                }
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