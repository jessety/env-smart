'use strict';

// require('env-smart').load();
require('../../').load({ directory: __dirname });

console.log(`Loaded ${Object.keys(process.env).length} env values.`);

for (const [key, value] of Object.entries(process.env)) {
  console.log(` ${key}: ${typeof value} =`, value);
}
