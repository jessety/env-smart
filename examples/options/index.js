'use strict';

// const settings = require('env-smart').load({
const settings = require('../../').load({
  directory: __dirname, // manually specify the directory to load .env files from
  encoding: 'utf8', // manually specify the encoding of the .env files
  lowercase: true, // make all keys lower case
  // uppercase: true, // make all keys upper case
  verbose: false, // output debug information - useful for searching for broken configs
  replace: false, // don't replace the contents of process.env, instead just use the dictionary that .load() returns
  process: false, // don't parse the process env, only dotfiles
  inlineTypes: true // don't allow inline types in .env or .env.defaults, e.g. PORT=number=8080
});

console.log(`Loaded ${Object.keys(settings).length} values`);

for (const [key, value] of Object.entries(settings)) {
  console.log(` ${key}: ${typeof value} =`, value);
}
