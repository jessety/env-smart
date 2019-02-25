'use strict';

require('../index').load({ directory: __dirname });
// Manually set our directory to the example path
// In most cases, all you'll need is:
// require('smart-env').load();

console.log(`Hello, world! Loaded ${Object.keys(process.env).length} env values.`);

for (const [key, value] of Object.entries(process.env)) {
  console.log(` ${key}: ${typeof value} = ${value}`);
}

// Values are pulled from a local .env file (if there is one) or the process env
// All values are then coerced into the type (boolean, number, or string) provided in .env.type, if one exists
// Note: .env files should never be committed, this one is only included for demonstration purposes

// So, for example, though the value for they key VERBOSE could have came from the process env, the .env file, or the defaults- we can be completely confident that it will be a boolean value if that type is defined in the .env.type file.
// ..and therefore we can use a quick ternary operator to throw together a one-liner log function:

const log = process.env.VERBOSE ? (...messages) => console.log('DEBUG:', ...messages) : () => {};

log('This will only be displayed if the `VERBOSE` env is set to true. If you\'re seeing this, it was!');
