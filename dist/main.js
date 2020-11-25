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
    
    // Creeps' operations:
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.ticksToLive < 300) console.log(creep.name+" needs renew.");
        if(creep.memory.role == 'attacker') {
            attacker_num++;
            const creep_inst = new roleAttacker(creep);
            creep_inst.toRoom(new RoomPosition(16,35,'W39N5'));
        }
        else if(creep.memory.role == 'builder') {
            builder_num++;
            const creep_inst = new roleBuilder(creep);
            creep_inst.renew(300);
            creep_inst.build(1);
        }
        else if(creep.memory.role == 'claimer') {
            claimer_num++;
            const creep_inst = new roleClaimer();
            creep_inst.renew(300);
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
            creep_inst.maintain()
        } else {
            console.log("(Creep) No such role.");
        }
    }

    // Structures' operations:
    for(var id in Game.structures) {
        var struct = Game.structures[id];
        if (struct.structureType == STRUCTURE_TOWER) {
            const struct_inst = new structTower(struct);
            struct_inst.repair();
        }
        if (struct.structureType == STRUCTURE_SPAWN) {
            // constants:
            const spawn = Game.spawns[struct.name];

            // creeps' body parts:
            /**
             * [MOVE,WORK,CARRY,ATTACK,RANGED_ATTACK,HEAL,CLAIM,TOUGH] 
             * = [50, 100, 50, 80, 150, 250, 600, 10]
             */ 
            const attacker_parts = [ATTACK,ATTACK,ATTACK,TOUGH,MOVE,MOVE];
            const claimer_parts = [CLAIM,MOVE];
            const upgrader_parts = [WORK,WORK,CARRY,CARRY,CARRY,MOVE];
            const worker_parts = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE];

            const attacker_parts_cost = 350;
            const claimer_parts_cost = 650;
            const upgrader_parts_cost = 400;
            const worker_parts_cost = 500;
            
            const attacker_max = 0;
            const builder_max = 3;
            const claimer_max = 0;
            const harvester_max = 4;
            const upgrader_max = 3;
            const maintainer_max = 2;

            // Action for Spawn1 in room 'W38N5'
            if(struct.name == 'Spawn1') {
                // variables:
                var available_energy = spawn.room.energyAvailable;
                
                if((attacker_num < attacker_max)&&(available_energy >= attacker_parts_cost)) {
                    // If number of attacker < desired number
                    autoRespawn(spawn,"Attacker",attacker_num,attacker_parts);
                    available_energy -= attacker_parts_cost;
                }
                if((builder_num < builder_max)&&(available_energy >= worker_parts_cost)) {
                    // If number of builder < desired number
                    autoRespawn(spawn,"Builder",builder_num,worker_parts);
                    available_energy -= worker_parts_cost;
                }
                if((claimer_num < claimer_max)&&(available_energy >= claimer_parts_cost)) {
                    // If number of builder < desired number
                    autoRespawn(spawn,"Claimer",claimer_num,claimer_parts);
                    available_energy -= claimer_parts_cost;
                }
                if((harvester_num < harvester_max)&&(available_energy >= worker_parts_cost)) {
                    // If number of harvester < desired number
                    autoRespawn(spawn,"Harvester",harvester_num,worker_parts);
                    available_energy -= worker_parts_cost;
                }
                if((maintainer_num < maintainer_max)&&(available_energy >= upgrader_parts_cost)) {
                    // If number of maintainer < desired number
                    autoRespawn(spawn,"Maintainer",maintainer_num,upgrader_parts);
                    available_energy -= upgrader_parts_cost;
                }
                if((upgrader_num < upgrader_max)&&(available_energy >= upgrader_parts_cost)) {
                    // If number of upgrader < desired number
                    autoRespawn(spawn,"Upgrader",upgrader_num,upgrader_parts);
                    available_energy -= upgrader_parts_cost;
                }
            }
        }
    }
}

/**
 * @description Spawn the specific creep by given spawn point
 * @param {StructureSpawn} spawn The spawn point
 * @param {string} prefix Creep's prefix
 * @param {number} control_num Current number of this type of creeps
 * @param {number[]} creep_parts body parts for this type of creeps
 */
function autoRespawn(spawn, prefix, control_num, creep_parts) {
    console.log("Spawn new "+prefix.toLowerCase());
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
    
}