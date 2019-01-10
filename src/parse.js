'use strict';

const fs = require('fs');
const type = require('./type');

/**
 * Parse the contents of an env file
 * @param   {string} path - The path of the env file to parse
 * @returns {object} - A key-value dictionary representation of the env file contents
 */
function parseFile(path, options) {

  if (typeof options !== 'object') {
    options = {};
  }

  if (!fs.existsSync(path)) {

    if (options.verbose === true) {
      console.log('env-smart:', `.env file does not exist at path "${path}"`);
    }
    return;
  }

  if (typeof options.encoding !== 'string') {
    options.encoding = 'utf8';
  }

  const contents = fs.readFileSync(path, { encoding: options.encoding });

  if (!contents) {
    if (options.verbose === true) {
      console.log('env-smart:', `Could not load contents of file at path "${path}"`);
    }
    return;
  }

  return parse(contents, options);
}

/**
 * Parse a string of env formatted data
 * @param   {string} data - env data
 * @returns {object} - A key-value dictionary representation of the env file contents
 */
function parse(data, options) {

  if (typeof options !== 'object') {
    options = {};
  }

  const env = {};

  const lines = data.split('\n');

  for (let line of lines) {

    line = line.trim();

    // Ignore all blank/whitespace lines, or lines that start with #
    if (line.length === 0 || line.charAt(0) === '#') {
      continue;
    }

    const components = line.split('=');

    // Ignore lines that don't at least have a key and a value, even if that value is a blank string
    if (components.length < 2) {
      continue;
    }

    let [ key, value, intendedType ] = components;

    // Ignore lines with blank keys
    if (key === '') {
      continue;
    }

    if (options.uppercase === true) {
      key = key.toUpperCase();
    }

    if (options.lowercase === true) {
      key = key.toLowerCase();
    }

    // Remove whitespace, and double quotes from the beginning and end of the value string
    value = value.replace(/(^")|("$)/g, '').trim();

    if (intendedType !== undefined) {
      // A type was defined, like this:
      // PORT=2112=NUMBER
      value = type(value, intendedType, options);
    }

    env[key.trim()] = value;
  }

  return env;
}

module.exports = { parse, parseFile };
