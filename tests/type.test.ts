import { type } from '../src';

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
    name: `types a string into an object`,
    input: `{"test":true}`,
    into: `object`,
    output: { test: true }
  },
  {
    name: `types a string into an array`,
    input: `[1,2,3]`,
    into: `array`,
    output: [1, 2, 3]
  },
  {
    name: `types an invalid JSON string into an object`,
    input: `{test":true}`,
    into: `object`,
    output: {}
  },
  {
    name: `types an invalid JSON string into an array`,
    input: `[1,2,"three]`,
    into: `array`,
    output: []
  }
];

describe('type function', () => {
  for (const { name, input, into, output } of tests) {
    test(name, () => {
      const result = type(input, into);

      expect(result).toEqual(output);
    });
  }

  // Handle errors

  test('returns input unchanged when presented with an unknown type', () => {
    const value = 'this is actually just a string';
    const intendedType = 'mystery';

    const result = type(value, intendedType);

    expect(result).toBe(value);
  });

  test('prints an error when parsing invalid JSON string in verbose mode', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    type('{test":true}', 'object', { verbose: true });
    type('[1,2,]', 'array', { verbose: true });

    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockRestore();
  });

  test('doesn\'t print an error when parsing invalid JSON string when not in verbose mode', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    type('{test":true}', 'object', { verbose: false });
    type('[1,2,]', 'array', { verbose: false });

    expect(spy).toHaveBeenCalledTimes(0);

    spy.mockRestore();
  });
});
