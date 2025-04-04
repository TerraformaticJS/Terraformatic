import { BlockConstructorHandler , AttrConstructorHandler} from "../handlers/tfmatic_handlers.js";
/**
 * Core Terraform configuration conversion utilities.
 * @module proto/block
 */

/**
 * Block Prototype - Represents a Terraform configuration block.
 * @constructor
 * @param {string[]} [prefix] - Block type/name (e.g., `["resource", "aws_instance"]`).
 * @param {Object|Object[]} [children] - Child blocks (processed recursively | e.g, `{} or [{},{},{}]`)).
 * @param {Object|Object[]} [attributes] - Block attributes (key-value pairs). (e.g, `{} or [{},{},{}]`)
 */
export function Block(prefix, children, attributes) {
    this.block_prefix = prefix;
    if (children) {
        this.block_children = BlockConstructorHandler[`${Array.isArray(children)}`](children);
    } else this.block_children = [];
    if (attributes) {
        this.attributes = AttrConstructorHandler[`${Array.isArray(attributes)}`](attributes);
    } else this.attributes = [];
}
