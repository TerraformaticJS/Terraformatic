import { object_value_tokenizer } from "../tfmatic_writer.js"
import { raw_value_tokenizer } from "../tfmatic_writer.js"
import { string_value_tokenizer } from "../tfmatic_writer.js"
import { $raw_tokenizer } from "../tfmatic_writer.js"
import { $string_tokenizer } from "../tfmatic_writer.js"
import { $var_tokenizer } from "../tfmatic_writer.js"

/**
 * Tokenization handlers for HCL code generation.
 * @module handlers/tfmatic_tokenizer_handlers
 */

/**
 * Value Tokenization Handler - Converts attribute values to HCL tokens.
 * @typedef {Object} TokenHandler
 * @property {Function} object - Tokenizes objects (nested structures/special syntax).
 * @property {Function} number - Tokenizes raw numeric values.
 * @property {Function} string - Tokenizes quoted string values.
 * @property {Function} boolean - Tokenizes raw boolean values.
 */
export let tokenHandler = {
    "object": (attr, level) => { return object_value_tokenizer(attr, level) },
    "number": (attr, level) => { return raw_value_tokenizer(attr, level) },
    "string": (attr, level) => { return string_value_tokenizer(attr, level) },
    "boolean": (attr, level) => { return raw_value_tokenizer(attr, level) },
}


/**
 * Key Type Handler - Processes special key types (e.g., variables, heredocs).
 * @typedef {Object} KeyTypeHandler
 * @property {Function} $var - Tokenizes variable references (e.g., `var.region`).
 * @property {Function} $func - Tokenizes function calls.
 * @property {Function} $heredoc - Tokenizes heredoc syntax.
 * @property {Function} $string - Forces string quoting.
 * @property {Function} $raw - Outputs raw unquoted values.
 */
export let KeyTypeHandler = {
    "$var": (attr, level) => { return $var_tokenizer(attr, level) },
    "$func": (attr, level) => { return $raw_tokenizer(attr, level) },
    "$heredoc": (attr, level) => { return $raw_tokenizer(attr, level) },
    "$string": (attr, level) => { return $string_tokenizer(attr, level) },
    "$raw": (attr, level) => { return $raw_tokenizer(attr, level) },
}