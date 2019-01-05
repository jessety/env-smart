'use strict';

const fs = require('fs');

/**
 * Parse the contents of an env file
 * @param   {string} path - The path of the env file to parse
 * @returns {object} - A key-value dictionary representation of the env file contents
 */
function parseFile(path, encoding) {

  if (!fs.existsSync(path)) {
    return;
  }

  if (encoding === undefined) {
    encoding = 'utf8';
  }

  const contents = fs.readFileSync(path, { encoding });

  if (!contents) {
    return;
  }

  return parse(contents);
}

/**
 * Parse a string of env formatted data
 * @param   {string} data - env data
 * @returns {object} - A key-value dictionary representation of the env file contents
 */
function parse(data) {

  const env = {};

  const lines = data.split('\n');

  for (let line of lines) {

    line = line.trim();

    // Ignore all blank lines, or lines that start with #
    if (line.length === 0 || line.charAt(0) === '#') {
      continue;
    }

    const components = line.split('=');

    // Ignore lines that don't at least have a key and a value
    if (components.length < 2) {
      return;
    }

    const [ key, value ] = components;

    // Remove whitespace, and quotes from the beginning and end of the value string
    env[key.trim()] = value.replace(/(^")|("$)/g, '').trim();
  }

  return env;
}

module.exports = { parse, parseFile };
