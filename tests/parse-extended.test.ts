import { parse } from '../src';

const tests = [
  // quotes
  {
    name: `parses quoted values`,
    input: `SAMPLE_STRING="This is a quoted string"`,
    output: { SAMPLE_STRING: 'This is a quoted string' }
  },
  {
    name: `parses quoted values that begin with a quote`,
    input: `SAMPLE_STRING=""This quoted string begins with a quote"`,
    output: { SAMPLE_STRING: '"This quoted string begins with a quote' }
  },

  // JSON objects / arrays
  {
    name: `parses JSON as a string`,
    input: `JSON_STRING={"test": true, "string": "this is a string"}`,
    output: { JSON_STRING: '{"test": true, "string": "this is a string"}' }
  },
  {
    name: `parses JSON as an object when supplied with an inline type`,
    input: `JSON_OBJECT=object={"test": true, "string": "this is a string in an object"}`,
    output: { JSON_OBJECT: { test: true, string: 'this is a string in an object' } }
  },
  {
    name: `parses quoted JSON as a string`,
    input: `JSON_STRING="{"test": true, "string": "this is a string"}"`,
    output: { JSON_STRING: '{"test": true, "string": "this is a string"}' }
  },
  {
    name: `parses quoted JSON as an object when suppied with an inline type`,
    input: `JSON_OBJECT=object="{"test": true, "string": "this is a string in an object"}"`,
    output: { JSON_OBJECT: { test: true, string: 'this is a string in an object' } }
  },
  {
    name: `parses unquoted number`,
    input: `ALLOWED_NUMBERS=array=[ 42, 7, 19, 29 ]`,
    output: { ALLOWED_NUMBERS: [42, 7, 19, 29] }
  },

  // =
  {
    name: `parses a = sign in the value, unquoted`,
    input: `URL=https://github.com/jessety/env-smart/commits/main?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34`,
    output: {
      URL: 'https://github.com/jessety/env-smart/commits/main?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34'
    }
  },
  {
    name: `parses a = sign in the value, quoted`,
    input: `URL="https://github.com/jessety/env-smart/commits/main?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34"`,
    output: {
      URL: 'https://github.com/jessety/env-smart/commits/main?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34'
    }
  },
  {
    name: `parses a = sign in the value, unquoted with inline type declaration`,
    input: `URL=string=https://github.com/jessety/env-smart/commits/main?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34`,
    output: {
      URL: 'https://github.com/jessety/env-smart/commits/main?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34'
    }
  },
  {
    name: `parses a = sign in value, quoted with inline type declaration`,
    input: `URL=string="https://github.com/jessety/env-smart/commits/main?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34"`,
    output: {
      URL: 'https://github.com/jessety/env-smart/commits/main?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34'
    }
  },
  {
    name: `ignores lines without a = sign`,
    input: `KEY_WITHOUT_EQUALS`,
    output: {}
  },
  {
    name: `ignores lines with blank keys`,
    input: `=VALUE_WITHOUT_KEY`,
    output: {}
  }
];

describe('parse function', () => {
  for (const { name, input, output } of tests) {
    test(name, () => {
      const parsed = parse(input);

      expect(parsed).toEqual(output);
    });
  }
});
