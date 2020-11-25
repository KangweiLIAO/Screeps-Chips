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
 * @param {number} reusePath reuse path
 * @param {roleCreep} secondTask default value is undefined creep instance
 */
roleCreep.prototype.moveTo_ = function(creep, pos_to, reusePath=5, maxRooms=1, strokeColor=undefined,lineStyle='dashed') {
    var path = creep.room.findPath(creep.pos,pos_to,
        {visualizePathStyle: {stroke: strokeColor, lineStyle:lineStyle}, maxRooms:maxRooms, reusePath:reusePath});
    creep.moveByPath(path);
}

/**
 * @description Find and build structures
 * @param {Creep} creep creep instance
 * @param {roleCreep} secondTask default value is undefined creep instance
 */
roleCreep.prototype.build = function(creep, source_num, secondTask=undefined) {
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
            if(creep.harvest(sources[source_num]) == ERR_NOT_IN_RANGE) {
                this.moveTo_(creep, sources[source_num].pos, strokeColor='#ffffff');
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
                    this.moveTo_(creep, targets[0].pos, strokeColor='#ffffff');
                }
            } else {if (secondTask != undefined) secondTask.run(creep);}
        }
    }
}

/**
 * @description Creep automatic renew when live reaching renew threshold
 * @param {Creep} creep creep instance
 * @param {number} renew_threshold renew threshold
 * @param {number} renew_to renew to a value
 */
roleCreep.prototype.renew = function(creep, renew_threshold, renew_to=renew_threshold+700) {
    const spawns = creep.room.find(FIND_MY_SPAWNS);
    var energy_store = creep.room.energyAvailable;
    if((creep.memory.renew == 'false') && (creep.ticksToLive < renew_threshold)) {
        creep.say(String.fromCodePoint(0x1F354)+"Renew");
        creep.memory.renew = 'true';
    }
    if(creep.memory.renew == 'waiting' && energy_store > 50) {
        creep.memory.renew = 'true';
    }
    if(creep.memory.renew == 'true') {
        if(energy_store <= 50) {
            creep.say(String.fromCodePoint(0x1F643)+"Waiting");
            creep.memory.renew = 'waiting';
        } else {
            if((spawns[0].renewCreep(creep) == ERR_NOT_IN_RANGE) 
                || creep.transfer(spawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawns[0]);
            }
            if(creep.ticksToLive > renew_to) {
                creep.say(String.fromCodePoint(0x1F606)+"Full");
                creep.memory.renew = 'false';
            }
        }
    } else if(creep.memory.renew == '') {creep.memory.renew == 'false';}
}

module.exports = roleCreep;