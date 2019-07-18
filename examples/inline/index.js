'use strict';

// require('smart-env').load();
require('../../index').load({ directory: __dirname });

console.log(`Loaded ${Object.keys(process.env).length} env values.`);

for (const [key, value] of Object.entries(process.env)) {
  console.log(` ${key}: ${typeof value} =`, value);
}
