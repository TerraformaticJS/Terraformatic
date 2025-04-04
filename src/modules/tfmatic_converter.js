import { AttrGeneratorHandler } from "./handlers/tfmatic_handlers.js";
import { Block } from "./proto/block.js";
import { Attr } from "./proto/attr.js";
/**
 *@module converters/tfmatic_writer
 */

/**
 * @typedef {Object} TfmaticConfig
 * @property {string[]} block - Array of block identifiers
 * @property {Object|Object[]} [attr] - Single attribute object or array of attribute objects
 * @property {Object|Object[]} [child] - Optional child configuration (single or array)
 * @example <caption>Basic configuration</caption>
 * {
 *   block: ['header', 'main'],
 *   attr: { id: 'page-header', class: 'dark' },
 *   child: {
 *     block: ['logo'],
 *     attr: { src: '/logo.png' }
 *   }
 * }
 * 
 * @example <caption>Array-based configuration</caption>
 * {
 *   block: ['section'],
 *   attr: [
 *     { id: 'section-1' },
 *     { class: 'collapsible' }
 *   ],
 *   child: [
 *     { block: ['heading'], attr: { text: 'Title' } },
 *     { block: ['content'], attr: { html: '<p>Content</p>' } }
 *   ]
 * }
 * 
 * @example <caption>Minimal configuration</caption>
 * {
 *   block: ['div'],
 *   attr: { class: 'container' }
 * }
 */

/**
 * Processes an object's attributes into Attr objects.
 * @param {TfmaticConfig[attr]} - Input attributes (key-value pairs).
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
 * @param {TfmaticConfig} block_object - Configuration object with block/child/attr.
 * @returns {Block} Initialized Block instance.
 */
export function BlockConstructor(block_object) {
    return new Block(block_object.block, block_object.child, block_object.attr)
}