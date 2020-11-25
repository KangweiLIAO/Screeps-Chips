// TODO: create comments, fix potential bugs, improve efficiency
const roleAttacker = require('role.attacker');
const roleBuilder = require('role.builder');
const roleClaimer = require('role.claimer');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleMaintainer = require('role.maintainer');
const structTower = require('struct.tower');

// Main function
module.exports.loop = function () {
    var harvester_num = 0
    var upgrader_num = 0
    var builder_num = 0
    var claimer_num = 0
    var attacker_num = 0
    var maintainer_num = 0
    
    // creeps operations:
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            // console.log(creep.room.energyAvailable);
            // console.log(creep.room.energyCapacityAvailable);
            harvester_num++;
            const creep_inst = new roleHarvester(creep);
            creep_inst.renew(creep,300);
            creep_inst.run();
        }
        else if(creep.memory.role == 'upgrader') {
            upgrader_num++;
            const creep_inst = new roleUpgrader();
            creep_inst.renew(creep,300);
            creep_inst.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            builder_num++;
            const creep_inst = new roleBuilder(creep);
            creep_inst.renew(creep,300);
            creep_inst.build(creep,1);
        }
        else if(creep.memory.role == 'maintainer') {
            maintainer_num++;
            const creep_inst = new roleMaintainer(creep);
            creep_inst.renew(creep,300);
            creep_inst.maintain()
        }
        else if(creep.memory.role == 'attacker') {
            attacker_num++;
            roleAttacker.toRoom(creep,new RoomPosition(16,35,'W39N5'));
        }
        else if(creep.memory.role == 'claimer') {
            claimer_num++;
            const creep_inst = new roleClaimer();
            creep_inst.renew(creep,200);
        }
    }
    
    // spawns operations:
    for (var name in Game.spawns) {
        const spawn = Game.spawns[name];
        const room = spawn.room;
        const worker_parts = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE];    // cost = 500
        const upgrader_parts = [WORK,WORK,CARRY,CARRY,CARRY,MOVE];   // cost = 400
        const claimer_parts = [CLAIM,MOVE];                   // cost = 650
        const attacker_parts = [ATTACK,ATTACK,ATTACK,TOUGH,MOVE,MOVE];    // cost = 350

        var available_energy = room.energyAvailable;

        if(name == 'Spawn1') {
            // spawn1's action
            if((attacker_num < 0)&&(available_energy >= 350)) {
                // If number of attacker < desired number
                console.log("Spawn new attacker");
                autoRespawn(spawn,"Attacker",attacker_num,attacker_parts);
                available_energy -= 350;
            }
            if((harvester_num < 4)&&(available_energy >= 500)) {
                // If number of harvester < desired number
                console.log("Spawn new harvester");
                autoRespawn(spawn,"Harvester",harvester_num,worker_parts);
                available_energy -= 500;
            }
            if((builder_num < 3)&&(available_energy >= 500)) {
                // If number of builder < desired number
                console.log("Spawn new builder");
                autoRespawn(spawn,"Builder",builder_num,worker_parts);
                available_energy -= 500;
            }
            if((upgrader_num < 2)&&(available_energy >= 400)) {
                // If number of upgrader < desired number
                console.log("Spawn new upgrader");
                autoRespawn(spawn,"Upgrader",upgrader_num,upgrader_parts);
                available_energy -= 400;
            }
            if((maintainer_num < 2)&&(available_energy >= 400)) {
                // If number of maintainer < desired number
                console.log("Spawn new maintainer");
                autoRespawn(spawn,"Maintainer",maintainer_num,upgrader_parts);
                available_energy -= 400;
            }
        }
    }

    // Other structures
    for(var name in Game.structures) {
        var struct = Game.structures[name];
        if (struct.structureType == STRUCTURE_TOWER) {
            const struct_inst = new structTower(struct);
            struct_inst.repair();
        }
        if (struct.structureType == STRUCTURE_SPAWN) {

        }
    }
}

/**
 * @param {StructureSpawn} spawn The spawn point
 * @param {string} prefix Creep's prefix
 * @param {number} control_num Current number of this type of creeps
 */
function autoRespawn(spawn, prefix, control_num, creep_parts) {
    for (var i=0; i<=control_num; i++) {
        if(Game.creeps[prefix+i] == null) {
            var err = spawn.spawnCreep(creep_parts, prefix+(i), {memory:{role:prefix.toLowerCase()}});
            if (err != 0) throw Error("Auto Re-spawn Error (error code = " + err + ")")
            break;
        }
    }
}

/**
 * @param {Creep} creep The old creep needs to be replaced
 * @param {number[]} new_parts Current number of this type of creeps
 */
function autoUpdate(creep, new_parts) {
    if (creep.body != new_parts) {
        creep.suicide();
    }
}