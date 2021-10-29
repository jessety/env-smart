import type from './type';
import fs from 'fs';

/**
 * Parse the contents of an env file
 * @param   {string} path - The path of the env file to parse
 * @returns {object} - A key-value dictionary representation of the env file contents
 */
function parseFile(
  path: string,
  options?: {
    verbose?: boolean;
    encoding?: BufferEncoding;
    inlineTypes?: boolean;
  }
): { [key: string]: unknown } | undefined {
  if (typeof options !== 'object') {
    options = {};
  }

  if (!fs.existsSync(path)) {
    if (options.verbose === true) {
      console.warn('env-smart:', `.env file does not exist at path "${path}"`);
    }
    return;
  }

  if (typeof options.encoding !== 'string') {
    options.encoding = 'utf8';
  }

  const contents = fs.readFileSync(path, { encoding: options.encoding });

  if (!contents) {
    if (options.verbose === true) {
      console.warn('env-smart:', `Could not load contents of file at path "${path}"`);
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
function parse(
  data: string,
  options?: { verbose?: boolean; inlineTypes?: boolean; lowercase?: boolean; uppercase?: boolean }
): { [key: string]: unknown } {
  if (typeof options !== 'object') {
    options = {};
  }

  const env: { [key: string]: unknown } = {};

  const lines = data.split('\n');

  for (let line of lines) {
    line = line.trim();

    // Ignore all blank/whitespace lines, or lines that start with #
    if (line.length === 0 || line.charAt(0) === '#') {
      continue;
    }

    const components = line.split('=');

    // Ignore lines that don't at least have a key and a value
    if (components.length < 2) {
      continue;
    }

    let key = components[0].trim();
    let intendedType;
    let value;

    // Check if an inline type was declared, like this:
    // PORT=number=2112
    if (options.inlineTypes !== false && components.length >= 3) {
      intendedType = components[1].trim().toLowerCase();

      if (['string', 'boolean', 'number', 'object', 'array'].includes(intendedType)) {
        // This is a valid type declaration.
        value = components.slice(2).join('=');
      } else {
        // This is not a valid type declaration. It probably isn't actually a type declaration at all.
        intendedType = undefined;
        value = components.slice(1).join('=');
      }
    } else {
      value = components.slice(1).join('=');
    }

    // Ignore lines with blank keys
    if (key === '') {
      continue;
    }

    if (options.lowercase === true) {
      key = key.toLowerCase();
    } else if (options.uppercase === true) {
      key = key.toUpperCase();
    }

    // Remove whitespace, and double quotes from the beginning and end of the value string
    value = value.replace(/(^")|("$)/g, '').trim();

    if (intendedType !== undefined) {
      value = type(value, intendedType, options);
    }

    env[key] = value;
  }

  return env;
}

export { parse, parseFile };
