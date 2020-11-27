/**
 * @constructor roleCreep constructor
 * @abstract    constructor should be override by child class
 */

var roleCreep = function() {
    if (this.constructor === roleCreep) {
      throw new Error("Abstract class cannot be instantiated.");
    }
    // Creep initialization...
};

/**
 * @description basic method for a creep
 * @abstract    run() should be override by child class
 */
roleCreep.prototype.run = function() {
    throw new Error("Abstract method called.");
}

/**
 * @description A greater movement
 * @param {RoomPosition} pos_from start position
 * @param {RoomPosition} pos_to end position
 * @param {number} maxRooms the room limit for searching a path
 * @param {roleCreep} reusePath reserve how many path in memory
 */
roleCreep.prototype.moveTo_ = function(pos_to, maxRooms=1, reusePath=5, visual) {
    const creep = this.creep;
    var path = creep.room.findPath(creep.pos, pos_to, {maxRooms:maxRooms, reusePath:reusePath});
    creep.moveByPath(path);
}

/**
 * @description Find and harvest sources
 * @param {number} target_source the index of specific source in Game.sources
 */
roleCreep.prototype.harvest = function(target_source=undefined) {
    const creep = this.creep;
    var sources = creep.room.find(FIND_SOURCES);
    if(creep.harvest(sources[source]) == ERR_NOT_IN_RANGE) {
        this.moveTo_(sources[source].pos);
    }
}

/**
 * @description Find and build structures
 * @param {RoomPosition} target 
 * @param {number} source
 * @param {roleCreep} secondTask default value is undefined creep instance
 */
roleCreep.prototype.build = function(target=undefined, source) {
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
                }
            }
        }
    }
}

/**
 * @description Creep automatic renew when live reaching renew threshold
 * @param {Creep} creep creep instance
 * @param {number} threshold renew threshold
 * @param {number} limit renew to a value
 */
roleCreep.prototype.renew = function(threshold=300, limit=threshold+600) {
    // constants:
    const creep = this.creep;
    const spawns = creep.room.find(FIND_MY_SPAWNS);
    // variable:
    var energy_store = creep.room.energyAvailable;  // available energy in current room
    var status = creep.memory.renew;                // string type

    if((status == 'false') && (creep.ticksToLive < threshold)) {
        console.log(creep.name + " Renew");
        creep.say(String.fromCodePoint(0x1F354)+"Renew");
        creep.memory.renew = 'true';
        status = 'true'
    } else if(status == 'waiting' && energy_store > 50) {
        creep.memory.renew = 'true';
        status = 'true'
    }
    if(status == 'true') {
        if(energy_store <= 50) {
            creep.say(String.fromCodePoint(0x1F643)+"Waiting");
            creep.memory.renew = 'waiting';
        } else {
            if((spawns[0].renewCreep(creep) == ERR_NOT_IN_RANGE) 
                || creep.transfer(spawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawns[0]);
            }
            if(creep.ticksToLive > limit) {
                creep.say(String.fromCodePoint(0x1F606)+"Full");
                creep.memory.renew = 'false';
            }
        }
    }
}

module.exports = roleCreep;