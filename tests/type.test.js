'use strict';

const { type } = require('../');

describe('type function', () => {

  // Test scenarios not possible in TypeScript

  test('types a number into a string', () => {

    const result = type(324, 'string');

    expect(result).toEqual('324');
  });
});
