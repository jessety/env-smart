'use strict';

const { parse } = require('../index');

const unparsed = [

  // Simple test
  'TEST=TRUE',

  // Two values, one with a superfluous space in the value
  `PORT=80
VERBOSE=FALSE `,

  // Comment line
  `PORT=80  
# Don't change this
SSL_PORT=443`,

  // Blank lines
  `

SAMPLE_VALUE=1234  
`,

  // Spaces spaces, everywhere
  `KEY_WITH_SPACES = VALUE WITH SPACES  
SAMPLE_STRING="This is a string"`,

  // JSON string contents
  'JSON_BLOB={"test": true, string: "this is a string"}',

  // JSON string contents that's quoted
  'JSON_BLOB="{"test": true, string: "this is a string"}"'
];

const parsed = unparsed.map(raw => {
  return parse(raw);
});

for (const [ index, value ] of unparsed.entries()) {
  console.log(`=== Test ${index} ===\n${value}\n==>\n${JSON.stringify(parsed[index], null, '  ')}\n`);
}