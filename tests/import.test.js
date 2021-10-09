'use strict';

describe('Main export', () => {
  test('imports successfully', () => {
    expect(() => require('../')).not.toThrow();
  });
});
