'use strict';

const { parseFile } = require('./parse');

/**
 * Load env values
 * @param   {object} [parameters] - Loading options
 * @returns {object} - Object containing env values found in a .env file (or the process )
 */
function load(options) {

  if (typeof options !== 'object') {
    options = {};
  }

  if (typeof options.directory !== 'string') {
    options.directory = process.cwd();
  }

  if (typeof options.uppercase !== 'boolean') {
    options.uppercase = false;
  }

  if (typeof options.lowercase !== 'boolean') {
    options.lowercase = false;
  }

  if (typeof options.replace !== 'boolean') {
    options.replace = true;
  }

  const log = options.verbose ? (...messages) => console.log('env-smart:', ...messages) : () => {};

  // log(`Loading "${options.directory}/.env"...`);

  // Parse the contents of the env file, if one exists
  const file = parseFile(`${options.directory}/.env`, options) || {};

  // Parse default values for our env variables
  const defaults = parseFile(`${options.directory}/.env.defaults`, options) || {};

  // Parse variable types for our env variables.
  const types = parseFile(`${options.directory}/.env.types`, options) || {};

  const env = {};

  // First, entries for all default values defined in .env.defaults
  for (const [key, value] of Object.entries(defaults)) {
    env[key] = value;
  }

  // Add all values from either a .env file or the process env
  for (const [key, value] of Object.entries(file)) {
    env[key] = value;
  }

  // Lastly, all values from the process env - allows overwriting the .env file with process env
  for (const [key, value] of Object.entries(process.env)) {

    if (options.lowercase === true) {

      env[key.toLowerCase()] = value;

    } else if (options.lowercase === true) {

      env[key.toUpperCase()] = value;

    } else {

      env[key] = value;
    }
  }

  // Cast values into the types specified in the .env.types file, if defined
  // eslint-disable-next-line prefer-const
  for (let [key, type] of Object.entries(types)) {

    if (!env.hasOwnProperty(key)) {
      continue;
    }

    type = type.toLowerCase();

    if (type === 'boolean') {
      env[key] = (env[key].toLowerCase() === 'true');
    }

    if (type === 'number') {
      env[key] = Number(env[key]);
    }

    // If the type is either an object or an array, assume it was serialized as JSON.
    if (['object', 'array'].includes(type)) {

      try {

        env[key] = JSON.parse(env[key]);

      } catch (e) {

        log(`ERROR: Could not parse JSON value for env key "${key}": ${e.message}`);

        if (type === 'object') {

          env[key] = {};

        } else if (type === 'array') {

          env[key] = [];
        }
      }
    }
  }

  if (options.replace === true) {
    log('Replaced contents of "process.env".');
    process.env = env;
  }

  return env;
}

module.exports = load;
