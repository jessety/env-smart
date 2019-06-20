'use strict';

/**
 * Cast a value into the specified type
 * @param   {string}                             value     A string representation of a variable
 * @param   {string}                             type      The type the value should be. Either string, boolean, number, object or array.
 * @param   {object}                             [options] Additional options. Optional.
 * @returns {string|boolean|number|object|Array} The value casted into it's preferred type.
 */
function type(value, type, options) {

  type = type.toLowerCase();

  if (typeof value === type) {
    return value;
  }

  if (type === 'string') {
    return String(value);
  }

  if (type === 'boolean') {
    return (value.toLowerCase() === 'true');
  }

  if (type === 'number') {
    return Number(value);
  }

  // If the type is either an object or an array, assume it was serialized as JSON.
  if (['object', 'array'].includes(type)) {

    try {

      return JSON.parse(value);

    } catch (e) {

      if (options.verbose === true) {
        console.warn(`env-smart`, `Could not parse JSON value: ${e.message}. Raw value:\n ${value}`);
      }

      if (type === 'object') {

        return {};

      } else if (type === 'array') {

        return [];
      }
    }
  }

  return value;
}

module.exports = type;
