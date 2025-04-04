
import { KeyTypeHandler } from "./handlers/tfmatic_tokenizer_handlers.js";
import { tokenHandler } from "./handlers/tfmatic_tokenizer_handlers.js";

export function $string_tokenizer(attr) {
    return `"${attr._value}"`;
}

export function $var_tokenizer(attr) {
    return attr._value;
}

export function $raw_tokenizer(attr) {
    return attr._value;
}

export function string_value_tokenizer(attr, level = 0) {
    let indentation = level;
    let white_space = "    ".repeat(indentation)
    let tokens = []
    tokens.push(white_space)
    tokens.push(`${attr._name} = "${attr._value}"`)
    tokens.push("\n")
    return tokens;
}

export function raw_value_tokenizer(attr, level = 0) {
    let indentation = level;
    let white_space = "    ".repeat(indentation)
    let tokens = []
    tokens.push(white_space)
    tokens.push(`${attr._name} = ${attr._value}`)
    tokens.push("\n")
    return tokens;
}

/**
 * HCL code generation utilities.
 * @module writers/tfmatic_writer
 */

/**
 * Tokenizes an attribute value based on its type.
 * @param {Attr} attr - Attribute to tokenize.
 * @param {number} [level=0] - Indentation level.
 * @returns {string[]} Tokenized HCL fragments.
 */
export function object_value_tokenizer(attr, level = 0) {
    let indentation = level;
    let white_space = "    ".repeat(indentation)
    let tokens = []
    tokens.push(white_space)
    tokens.push(`${attr._name}`)
    tokens.push(" = ")
    if (attr._value.length != 0) {
        if (KeyTypeHandler[attr._value[0]._name] && attr._value.length === 1) {
            tokens.push(KeyTypeHandler[attr._value[0]._name](attr._value[0]))
            tokens.push("\n")
            return tokens
        }
        else {
            tokens.push("{\n")
            tokens.push(attr_tokenizer(attr._value, indentation + 1))
            tokens.push(white_space)
            tokens.push("}\n")
            return tokens;
        }
    }
    else {
        tokens.push("{ }\n")
        return tokens;
    }
}

/**
 * Recursively tokenizes an array of attributes.
 * @param {Attr[]} attr_stack - Attributes to process.
 * @param {number} [level=0] - Indentation level.
 * @returns {string[]} Tokenized HCL fragments.
 */
function attr_tokenizer(attr_stack, level = 0) {
    if (!Array.isArray(attr_stack)) {
        throw new Error('attr_stack must be an array');
    }
    let tokens = [];
    attr_stack.forEach(attr => {
        tokens.push(tokenHandler[typeof attr._value](attr, level))
    });
    return tokens;
}

//console.log(attr_tokenizer(HandleAttributeTypes(test_obj), 1).flat(Infinity).join(""))
//Programtically Defines Structure

function block_prefix_tokenizer(block_prefix) {
    let tokens = [];
    let count = 0;
    for (let prefix of block_prefix) {
        switch (count) {
            case 0: tokens.push(`${prefix} `)
                count++
                break
            default: tokens.push(`"${prefix}" `)
                count++
                break
        }
    }
    return tokens
}

/**
 * Generates HCL for a Block and its children/attributes.
 * @param {Block} block - Block to tokenize.
 * @param {number} [level=0] - Indentation level.
 * @returns {string[]} Tokenized HCL fragments.
 */
export function block_tokenizer(block, level = 0) {
    let tokens = [];
    let indentation = level;
    let white_space = "    ".repeat(indentation);
    tokens.push(white_space);
    tokens.push(block_prefix_tokenizer(block.block_prefix))
    if (block.attributes.length != 0 || block.block_children.length != 0) {
        tokens.push("{\n");
        if (block.attributes.length > 0) {
            tokens.push(attr_tokenizer(block.attributes, level + 1));
        }
        if (block.block_children.length > 0) {
            for (let child of block.block_children) {
                tokens.push(block_tokenizer(child, level + 1));
            }
        }
        tokens.push(white_space);
        tokens.push("} \n");
    }else {tokens.push("{ }\n")}
    return tokens
}

