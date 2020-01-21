'use strict';

const { type } = require('../');

const tests = [
  {
    name: `types a string into.. a string`,
    input: `a string`,
    into: `string`,
    output: `a string`
  },
  {
    name: `types a string into a boolean`,
    input: `true`,
    into: `boolean`,
    output: true
  },
  {
    name: `types 'TRUE' into a boolean`,
    input: `TRUE`,
    into: `boolean`,
    output: true
  },
  {
    name: `types 'FALSE' into a boolean`,
    input: `FALSE`,
    into: `boolean`,
    output: false
  },
  {
    name: `types a string into a number`,
    input: `42`,
    into: `number`,
    output: 42
  },
  {
    name: `types a string into an array`,
    input: `[1,2,3]`,
    into: `array`,
    output: [1, 2, 3]
  },
  {
    name: `types a string into an object`,
    input: `{"test":true}`,
    into: `object`,
    output: { test: true }
  }
];

for (const { name, input, into, output, options } of tests) {

  test(name, () => {

    const result = type(input, into, options || {});

    expect(result).toEqual(output);
  });
}
