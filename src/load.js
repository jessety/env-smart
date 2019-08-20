'use strict';

const { parseFile } = require('./parse');
const type = require('./type');

/**
 * Load env values
 * @param   {object} [parameters] - Loading options
 * @returns {object} - Object containing env values found in a .env file (or the process )
 */
function load(options) {

  if (typeof options !== 'object') {
    options = {};
  }

  // Set up default parameters

  if (typeof options.verbose !== 'boolean') {
    options.verbose = false;
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

  if (typeof options.process !== 'boolean') {
    options.process = true;
  }

  if (typeof options.inlineTypes !== 'boolean') {
    options.inlineTypes = true;
  }

  if (typeof options.envFilename !== 'string') {
    options.envFilename = '.env';
  }

  if (typeof options.envDefaultsFilename !== 'string') {
    options.envDefaultsFilename = '.env.defaults';
  }

  if (typeof options.envTypesFilename !== 'string') {
    options.envTypesFilename = '.env.types';
  }

  // const log = options.verbose ? (...messages) => console.log('env-smart:', ...messages) : () => {};

  // log(`Loading "${options.directory}/.env"...`);

  // Parse the contents of the env file, if one exists
  const file = parseFile(`${options.directory}/${options.envFilename}`, options) || {};

  // Parse default values for our env variables
  const defaults = parseFile(`${options.directory}/${options.envDefaultsFilename}`, options) || {};

  // Parse variable types for our env variables
  const types = parseFile(`${options.directory}/${options.envTypesFilename}`, { ...options, inlineTypes: false }) || {};

  const env = {};

  // First, entries for all default values defined in .env.defaults
  for (const [key, value] of Object.entries(defaults)) {

    env[key] = value;

    // If types aren't declared for these values, use the types parsed from the defaults file
    if (types[key] === undefined) {
      types[key] = typeof value;
    }
  }

  // Add all values from the .env file
  for (const [key, value] of Object.entries(file)) {
    env[key] = value;
  }

  // Lastly, all values from the process env - allows overwriting the .env file with process env
  if (options.process === true) {

    for (let [key, value] of Object.entries(process.env)) {

      if (options.lowercase === true) {

        key = key.toLowerCase();

      } else if (options.uppercase === true) {

        key = key.toUpperCase();
      }

      env[key] = value;
    }
  }

  // Cast values into the types specified in the .env.types file, or inline in .env.defaults
  for (const [key, intendedType] of Object.entries(types)) {

    if (!env.hasOwnProperty(key)) {
      continue;
    }

    env[key] = type(env[key], intendedType, options);
  }

  if (options.replace === true) {
    process.env = env;
  }

  return env;
}

module.exports = load;
