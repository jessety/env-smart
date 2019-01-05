'use strict';

const { parseFile } = require('./parse');

const cache = {};

/**
 * Load env values
 * @param   {string} [directory=__dirname] - Which directory to load .env files from. Defaults to __dirname if omitted
 * @returns {object} - Object containing env values found in a .env file (or the process )
 */
function load(directory) {

  if (directory === undefined) {
    directory = __dirname;
  }

  // If we've already parsed the env file, great! We're done.
  // (unless we parsed a different directory before)
  if (cache[directory] !== undefined) {
    return cache[directory];
  }

  // Define paths for ENV files
  const paths = {
    file: `${directory}/.env`,
    defaults: `${directory}/.env.defaults`,
    types: `${directory}/.env.types`
  };

  // Parse the contents of the env file, if one exists
  const file = parseFile(paths.file) || {};

  // Parse default values for our env variables
  const defaults = parseFile(paths.defaults) || {};

  // Parse variable types for our env variables.
  const types = parseFile(paths.types) || {};

  const env = {};

  // First, entries for all default values defined in .env.defaults
  for (const [key, value] of Object.entries(defaults)) {
    env[key] = value;
  }

  // Add all values from either a .env file or the process env
  for (const [key, value] of Object.entries(file)) {
    env[key] = value;
  }

  // Lastly, all values from the process env - allows overwriting the .env file wiht process env
  for (const [key, value] of Object.entries(process.env)) {
    env[key] = value;
  }

  // Cast values into the types specified in the .env.types file, if defined
  for (const [key, type] of Object.entries(types)) {

    if (!env.hasOwnProperty(key)) {
      continue;
    }

    if (type.toLowerCase() === 'boolean') {
      env[key] = (env[key].toLowerCase() === 'true');
    }

    if (type.toLowerCase() === 'number') {
      env[key] = Number(env[key]);
    }

    // ..obviously adding objects and arrays would be trivial, but I'm not sure I should encourage that.
  }

  cache[directory] = env;

  return env;
}

module.exports = load;
