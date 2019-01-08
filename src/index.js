'use strict';

const load = require('./load');
const { parse, parseFile } = require('./parse');

module.exports = { load, config: load, parse, parseFile };
