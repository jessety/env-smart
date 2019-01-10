'use strict';

const load = require('./load');
const type = require('./type');
const { parse, parseFile } = require('./parse');

module.exports = { load, config: load, type, parse, parseFile };
