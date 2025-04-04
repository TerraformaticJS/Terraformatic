import { Attr } from "../proto/attr.js";
import { Block } from "../proto/block.js";
import { HandleAttributeTypes } from "../tfmatic_converter.js";

/**
 * Handlers for generating tfmatic configuration elements from tfmatic config objects.
 * config_obj = {...}
 * config_obj => ``Attr(), Block()```
 * @module handlers/tfmatic_handlers
 */

/**
 * Attribute Generator Handlers - Maps data types to attribute creation methods.
 * @typedef {Object} AttrGeneratorHandler
 * @property {Function} object - Handles object-type attributes (recursively processes nested objects).
 * @property {Function} string - Handles string-type attributes.
 * @property {Function} number - Handles numeric attributes.
 * @property {Function} boolean - Handles boolean attributes.
 */
export let AttrGeneratorHandler = {
    "object":   (object, key) => {
        return new Attr(key, HandleAttributeTypes(object[key]));
    },
    "string":   (object, key) => {
        return new Attr(key, object[key])
    },
    "number":   (object, key) => {
        return new Attr(key, object[key])
    },
    "boolean":  (object, key) => {
        return new Attr(key, object[key])
    },
}


/**
 * Block Constructor Handlers - Creates Block objects from tfmatic configuration objects.
 * child:
 * @typedef {Object} BlockConstructorHandler
 * @property {Function} false - Handles single block creation.
 * @property {Function} true - Handles array of blocks (creates multiple Block objects).
 */
export let BlockConstructorHandler = {
    "false": (block) => {
        let block_array = []
        block_array.push(new Block(block.block, block.child, block.attr))
        return block_array;
    },
    "true": (blocks) => {
        let block_array = []
        for (let block of blocks) {
            block_array.push(new Block(block.block, block.child, block.attr))
        }
        return block_array;
    }
}

/**
 * Attribute Constructor Handlers - Processes tfmatic attribute configurations objects
 * e.g  
 * attr = tfmatic_config_obj.attr
 * attr = [{...},{...}.{...}] 
 * attr = {...} 
 * @typedef {Object} AttrConstructorHandler
 * @property {Function} false - Handles single attribute object.
 * @property {Function} true - Handles array of attribute objects (flattens nested structures).
 */
export let AttrConstructorHandler = {
    "false": (attributes) => {
        let attr_stack = [];
        attr_stack = HandleAttributeTypes(attributes)
        return attr_stack;
    },
    "true": (attributes) => {
        let attr_stack = [];
        for (let attribute_object of attributes) {
            attr_stack.push(HandleAttributeTypes(attribute_object))
        }
        attr_stack = attr_stack.flat(1)
        return attr_stack;
    }
}

