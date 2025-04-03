import { AttrGeneratorHandler } from "./handlers/tfmatic_handlers.js";
import { Block } from "./proto/block.js";

/**
 * Processes an object's attributes into Attr objects.
 * @param {Object} object - Input attributes (key-value pairs).
 * @returns {Attr[]} Array of Attr objects.
 * @throws {Error} If input is not an object.
 */
export function HandleAttributeTypes(object) {
    if (!object || typeof object !== 'object') {
        throw new Error('Input must be an object');
    }
    let data = [];
    for (let key in object) {
        let current_item = object[key];
        data.push(AttrGeneratorHandler[typeof current_item](object, key))
    }
    return data;
}

/**
 * Constructs a Block object from configuration data.
 * @param {Object} block_object - Configuration object with block/child/attr.
 * @returns {Block} Initialized Block instance.
 */
export function BlockConstructor(block_object) {
    return new Block(block_object.block, block_object.child, block_object.attr)
}




