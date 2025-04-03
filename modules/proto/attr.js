/**
 * A prototype constructor function, returns an Attr object.
 * Stores data in a name:value pair. In most cases used by
 * the tfmatic converter to preprare data for tokenization 
 * by the tfmatic writer.
 * @param {*} name - A name to assign to name:value pair.
 * @param {*} value - A data value.
 */
export function Attr(name, value) {
    this._name = name;
    this._value = value;
}