'use strict';

const settings = require('../index').load({
  directory: __dirname, // manually specify the directory to load .env files from
  lowercase: true, // make all keys lower case.
  // uppercase: true, // make all keys upper case
  verbose: true, // output debug information - useful for searching for broken configs
  replace: false, // don't replace the contents of process.env, instead just use the dictionary .load() returns
  process: false // don't parse the process env, only dotfiles
});

console.log(`Loaded ${Object.keys(settings).length} values:`);

for (const [key, value] of Object.entries(settings)) {
  console.log(` ${key}: ${typeof value} = ${value}`);
}
