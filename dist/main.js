// TODO: create comments, fix potential bugs, improve efficiency
const roleAttacker = require('role.attacker');
const roleBuilder = require('role.builder');
const roleClaimer = require('role.claimer');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleMaintainer = require('role.maintainer');
const structTower = require('struct.tower');

// notifications:
Memory.notification = {creepExtinct:false};
Memory.towers = {};

// Main function
module.exports.loop = function () {
    var total_creeps = 0
    var harvester_num = 0
    var upgrader_num = 0
    var builder_num = 0
    var claimer_num = 0
    var attacker_num = 0
    var maintainer_num = 0

    // Notifications:
    if(Memory.notification.creepExtinct == true){
        var time = new Date();
        Game.notify(`No creep is alive (Report on ${time.getMonth()+1}-${time.getDate()}: 
            ${time.getHours()-5}:${time.getMinutes()})`);
        Memory.notification.creepExtinct = false;
    }

    // Manual functions:
    const updateCreeps = false;
    if (updateCreeps) {
        updateOldCreep('W38N5','harvester',
            ['work','work','work','work','carry','carry','move','move']);
    }

    // Creeps' operations:
    for(var name in Game.creeps) {
        // constants
        total_creeps++;
        const creep = Game.creeps[name];

        if(creep.memory.role == 'attacker') {
            attacker_num++;
            const creep_inst = new roleAttacker(creep);
            creep_inst.renew(300);
            creep_inst.run();
        }
        else if(creep.memory.role == 'builder') {
            builder_num++;
            const creep_inst = new roleBuilder(creep);
            creep_inst.renew(300);
            creep_inst.run();
        }
        else if(creep.memory.role == 'claimer') {
            claimer_num++;
            const creep_inst = new roleClaimer(creep);
            creep_inst.renew(400,2000);
            creep_inst.run();
        }
        else if(creep.memory.role == 'harvester') {
            harvester_num++;
            const creep_inst = new roleHarvester(creep);
            creep_inst.renew(300);
            creep_inst.run();
        }
        else if(creep.memory.role == 'upgrader') {
            upgrader_num++;
            const creep_inst = new roleUpgrader(creep);
            creep_inst.renew(300);
            creep_inst.run();
        }
        else if(creep.memory.role == 'maintainer') {
            maintainer_num++;
            const creep_inst = new roleMaintainer(creep);
            creep_inst.renew(300);
            creep_inst.run();
        } else {
            console.log(`(${creep.name}) No such role.`);
        }
        if (total_creeps == 0) Memory.notification.creepExtinct = true;
    }

    // Structures' operations:
    for(var id in Game.structures) {
        var struct = Game.structures[id];
        var tower_num = 0;

        if (struct.structureType == STRUCTURE_TOWER) {
            tower_num++;
            var tower_name = `Tower${tower_num}`;
            // if(Memory.towers[tower_name] == undefined) {
            //     console.log(`Tower${tower_num} added`);
            //     Memory.towers[tower_name] = {inst:(new structTower(struct)),cooldown:100,cooling:false};
            // } else {
            //     console.log(tower_name+" exist");
            //     console.log(Memory.towers[tower_name]);
            //     console.log(Memory.towers[tower_name].cooldown);
            //     const inst = Memory.towers[tower_name].inst
            //     inst.run();
            // }
            const struct_inst = new structTower(struct);
            struct_inst.run();
        }
        else if (struct.structureType == STRUCTURE_SPAWN) {
            // constants:
            const spawn = Game.spawns[struct.name];
            /**
             * Creeps' body parts:
             * [MOVE,WORK,CARRY,ATTACK,RANGED_ATTACK,HEAL,CLAIM,TOUGH] 
             * = [50, 100, 50, 80, 150, 250, 600, 10]
             * Game.spawns['Spawn1'].spawnCreep(worker_parts),"Harvester0",{memory:{role:'harvester'}});
             */ 
            const attacker_parts = [ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE];
            const claimer_parts = [CLAIM,ATTACK,MOVE,MOVE];
            const upgrader_parts = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
            const worker_parts = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];

            const attacker_parts_cost = 970;
            const claimer_parts_cost = 780;
            const upgrader_parts_cost = 650;
            const worker_parts_cost = 900;
            
            const attacker_max = 1;
            const builder_max = 2;
            const claimer_max = 0;
            const harvester_max = 3;
            const upgrader_max = 3;
            const maintainer_max = 2;

            // Action for Spawn1 in room 'W38N5'
            if(struct.name == 'Spawn1') {
                // variables:
                var available_energy = spawn.room.energyAvailable;

                if((attacker_num < attacker_max)&&(available_energy >= attacker_parts_cost)) {
                    // If number of attacker < desired number
                    autoRespawn(spawn,"Attacker",attacker_parts);
                    available_energy -= attacker_parts_cost;
                }
                if((builder_num < builder_max)&&(available_energy >= worker_parts_cost)) {
                    // If number of builder < desired number
                    autoRespawn(spawn,"Builder",worker_parts);
                    available_energy -= worker_parts_cost;
                }
                if((claimer_num < claimer_max)&&(available_energy >= claimer_parts_cost)) {
                    // If number of builder < desired number
                    autoRespawn(spawn,"Claimer",claimer_parts);
                    available_energy -= claimer_parts_cost;
                }
                if((harvester_num < harvester_max)&&(available_energy >= worker_parts_cost)) {
                    // If number of harvester < desired number
                    autoRespawn(spawn,"Harvester",worker_parts);
                    available_energy -= worker_parts_cost;
                }
                if((maintainer_num < maintainer_max)&&(available_energy >= upgrader_parts_cost)) {
                    // If number of maintainer < desired number
                    autoRespawn(spawn,"Maintainer",upgrader_parts);
                    available_energy -= upgrader_parts_cost;
                }
                if((upgrader_num < upgrader_max)&&(available_energy >= upgrader_parts_cost)) {
                    // If number of upgrader < desired number
                    autoRespawn(spawn,"Upgrader",upgrader_parts);
                    available_energy -= upgrader_parts_cost;
                }
            }
        }
    }
}

/**
 * @description Spawn the specific creep by given spawn point
 * @param {StructureSpawn} spawn The spawn point
 * @param {string} prefix creep's prefix
 * @param {number[]} creep_parts body parts for this type of creeps
 * @param {string} update_role the role that needed to be update (e.g. 'harvester')
 * @param {number[]} new_parts new body parts for type of creeps which needed to be updated
 */

function autoRespawn(spawn, prefix, creep_parts, update_role=undefined, new_parts=undefined) {
    var code = 1;
    var postfix = 0;
    while (code == 1 || code == ERR_NAME_EXISTS || code == ERR_BUSY){
        code = spawn.spawnCreep(creep_parts, prefix+(postfix), {memory:{renew:'false', role:prefix.toLowerCase()}});
        if (code == OK) console.log(`(${spawn.name}) New ${prefix} is spawning...`)
        postfix++;
    }
    if (prefix.toLowerCase() == update_role && new_parts != undefined) {
        for(var name in Game.creeps) {
            const creep = Game.creeps[name];
            var body = creep.body.filter((obj) => {return obj.type});
            if (!body.equals(new_parts)) {
                console.log(`Apply new parts: [${new_parts}] to current ${creep.name}.`);
                console.log(`${creep.name} old`);
                // (spawn.spawnCreep(creep_parts, prefix+(postfix), 
                //     {memory:{renew:'false', role:prefix.toLowerCase()}}) == ERR_NAME_EXISTS)
            }
        }
    }
}


/**
 * @description Generates a list of body parts to spawn a creep with by following a
 *              regex-like pattern to decide which parts to try spawning and fitting in as
 *              many parts as possible for the given amount of energy.
 *              Pattern examples:
 *
 *              'mah'        1 MOVE, 1 ATTACK, and 1 HEAL part
 *              'mw4a'       1 MOVE part, 4 WORK parts, and 1 ATTACK part
 *              'm*'         As many MOVE parts as will fit
 *              'w*m*t*'     As many WORK parts as will fit, then as many MOVE parts as
 *                           will fit, then as many TOUGH parts as will fit
 *              'm[wc]*'     1 MOVE part, then alternate between WORK and CARRY parts
 *                           until one doesn't fit
 *              '[mw3]*'     1 MOVE part for every 3 WORK parts, until one doesn't fit
 *              'm3[arh]*t*' 3 MOVE parts, then cycle between ATTACK, RANGED_ATTACK,
 *                           and HEAL until one doesn't fit, then as many TOUGH
 *                           parts as will fit
 *              '[m[wc]2]*'  Cycle between MOVE, WORK, CARRY, WORK, CARRY until one
 *                           doesn't fit
 */
function generateCreepBody(pattern, energy) {
    const PARTS = {
        'c': CARRY,
        'w': WORK,
        'm': MOVE,
        'a': ATTACK,
        'r': RANGED_ATTACK,
        'h': HEAL,
        'l': CLAIM,
        't': TOUGH
    };
    let result = [];
    let stack = [];
    let i = 0;
    let repeat = 0;
    let depleted = false;
    while (i < pattern.length && energy > 0 && result.length < 50) {
        const c = pattern[i];
        if (c == '*' || (c >= '0' && c <= '9')) {
            const top = stack.pop();
            if (!top) {
                break;
            }
            let count = 0;
            while (i < pattern.length && pattern[i] >= '0' && pattern[i] <= '9') {
                count = count * 10 + (pattern[i] - '0');
                i++;
            }
            if (c == '*') {
                count = 999;
                i++;
            }
            if (!depleted && top[1] < count - 1) {
                i = top[0];
                repeat = top[1] + 1;
            } else {
                repeat = 0;
                if (stack.length == 0) {
                    depleted = false;
                }
            }
            stack.push(top);
            continue;
        }
        stack.pop();
        if (c == '[') {
            stack.push([i, repeat]);
            stack.push(null);
        }
        if (c in PARTS) {
            if (!depleted) {
                const cost = BODYPART_COST[PARTS[c]];
                if (energy >= cost) {
                    result.push(PARTS[c]);
                    energy -= cost;
                } else {
                    depleted = true;
                }
            }
            stack.push([i, repeat]);
        }
        repeat = 0;
        i++;
    }
    return result;
}


// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
