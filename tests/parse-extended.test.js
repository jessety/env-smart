'use strict';

const { parse } = require('../index');

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
    output: { JSON_OBJECT: { test: true, string: 'this is a string in an object' }}
  },
  {
    name: `parses quoted JSON as a string`,
    input: `JSON_STRING="{"test": true, "string": "this is a string"}"`,
    output: { JSON_STRING: '{"test": true, "string": "this is a string"}' }
  },
  {
    name: `parses quoted JSON as an object when suppied with an inline type`,
    input: `JSON_OBJECT=object="{"test": true, "string": "this is a string in an object"}"`,
    output: { JSON_OBJECT: { test: true, string: 'this is a string in an object' }}
  },
  {
    name: `parses unquoted number`,
    input: `ALLOWED_NUMBERS=array=[ 42, 7, 19, 29 ]`,
    output: { ALLOWED_NUMBERS: [42, 7, 19, 29]}
  },

  // =
  {
    name: `parses a = sign in the value, unquoted`,
    input: `URL=https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34`,
    output: {
      URL: 'https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34'
    }
  },
  {
    name: `parses a = sign in the value, quoted`,
    input: `URL="https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34"`,
    output: {
      URL: 'https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34'
    }
  },
  {
    name: `parses a = sign in the value, unquoted with inline type declaration`,
    input: `URL=string=https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34`,
    output: {
      URL: 'https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34'
    }
  },
  {
    name: `parses a = sign in value, quoted with inline type declaration`,
    input: `URL=string="https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34"`,
    output: {
      URL: 'https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34'
    }
  }
];

for (const { name, input, output, options } of tests) {

  test(name, () => {

    const parsed = parse(input, options || {});

    expect(parsed).toEqual(output);
  });
}
