'use strict';

const fs = require('fs');
const envfile = require('envfile');

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
    raw: `${directory}/.env`,
    defaults: `${directory}/.env.defaults`,
    types: `${directory}/.env.types`
  };

  // Parse the contents of the env file (if one exists) or use the process env if one does not
  const raw = fs.existsSync(paths.raw) ? envfile.parseFileSync(paths.raw) : process.env;

  // Parse default values for our env variables
  const defaults = fs.existsSync(paths.defaults) ? envfile.parseFileSync(paths.defaults) : {};

  // Parse variable types for our env variables.
  const types = fs.existsSync(paths.types) ? envfile.parseFileSync(paths.types) : {};

  const env = {};

  // First, entries for all default values defined in .env.defaults
  for (const [key, value] of Object.entries(defaults)) {
    env[key] = value;
  }

  // Add all values from either a .env file or the process env
  for (const [key, value] of Object.entries(raw)) {
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
