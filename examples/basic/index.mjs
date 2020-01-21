
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

import env from '../../src/index.js';
env.load({ directory: __dirname });

// Manually set the directory path for the sake of this example
// In most cases, all you need is:
// import env from 'env-smart';
// env.load();

console.log(`Hello, world! Loaded ${Object.keys(process.env).length} env values.`);

for (const [key, value] of Object.entries(process.env)) {
  console.log(` ${key}: ${typeof value} =`, value);
}

// Values are pulled from a local .env file (if there is one) or the process env
// All values are then coerced into the type (boolean, number, or string) provided in .env.types, if one exists
// Note: .env files should never be committed, this one is only included for demonstration purposes

// So, for example, though the value for they key VERBOSE could have came from the process env, the .env file, or the defaults- we can be completely confident that it will be a boolean value if that type is defined in the .env.type file.
// ..and therefore we can use a quick ternary operator to throw together a one-liner log function:

const log = process.env.VERBOSE ? (...messages) => console.log('DEBUG:', ...messages) : () => {};

log('This will only be displayed if the `VERBOSE` env is set to true. If you\'re seeing this, it was!');
log('Try "export VERBOSE=false && node index.js" to disable this message.');
