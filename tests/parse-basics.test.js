'use strict';

const { parse } = require('../');

const tests = [
  {
    name: `parses simple key / value pair`,
    input: `TEST=TRUE`,
    output: { TEST: 'TRUE' }
  },
  {
    name: `parses two values`,
    input: `
PORT=80
VERBOSE=FALSE`,
    output: { PORT: '80', VERBOSE: 'FALSE' }
  },
  {
    name: `ignores comment lines`,
    input: `
PORT=80  
# Don't change this
SSL_PORT=443`,
    output: { PORT: '80', SSL_PORT: '443' }
  },
  {
    name: `respects inline type definitions`,
    input: `PORT=number=80
TEST=boolean=TRUE
WELCOME=string=Hello!
JSON_BLOB=object={"test": true, "string": "this is a string"}
ALLOWED_NUMBERS=array=[ 42, 7, 19, 29 ]`,
    output: {
      PORT: 80,
      TEST: true,
      WELCOME: 'Hello!',
      JSON_BLOB: { test: true, string: 'this is a string' },
      ALLOWED_NUMBERS: [ 42, 7, 19, 29 ]
    }
  },
  {
    name: `ignores blank lines`,
    input: `

SAMPLE_VALUE=1234  

    `,
    output: { SAMPLE_VALUE: '1234' }
  },
  {
    name: `ignores superfluous spaces`,
    input: ` KEY WITH SPACES = VALUE WITH SPACES `,
    output: { 'KEY WITH SPACES': 'VALUE WITH SPACES' }
  },
  {
    name: `parses quoted values`,
    input: `SAMPLE_STRING="This is a quoted string"`,
    output: { SAMPLE_STRING: 'This is a quoted string' }
  }
];

for (const { name, input, output, options } of tests) {

  test(name, () => {

    const parsed = parse(input, options || {});

    expect(parsed).toEqual(output);
  });
}
