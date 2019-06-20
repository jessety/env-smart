'use strict';

const { parse } = require('../index');

const unparsed = [

  // Simple key / value
  `TEST=TRUE`,

  // Two values, one with a superfluous space in the value
  `PORT=80
VERBOSE= FALSE`,

  // Comment line
  `PORT=80  
# Don't change this
SSL_PORT=443`,

  // Typed values
  `PORT=number=80
VERBOSE=boolean=FALSE`,

  // Blank lines
  `
SAMPLE_VALUE=1234  

`,

  // Spaces spaces, everywhere
  ` KEY WITH SPACES = VALUE WITH SPACES `,

  // Quoted value
  `SAMPLE_STRING="This is a quoted string"`,

  // Quoted value that begins with a quote
  `SAMPLE_STRING=""This quoted string begins with a quote"`,

  // JSON string value
  `JSON_BLOB={"test": true, "string": "this is a string"}`,

  // JSON object value with a declared type
  `JSON_BLOB=object={"test": true, "string": "this is a string in an object"}`,

  // Quoted JSON string value
  `JSON_BLOB="{"test": true, "string": "this is a string"}"`,

  // Quoted JSON string value with a declared type
  `JSON_BLOB=object="{"test": true, "string": "this is a string in an object"}"`,

  // Unquoted array value
  `ALLOWED_NUMBERS=array=[ 42, 7, 19, 29 ]`,

  // Two = signs in value, unquoted
  `URL=https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34`,

  // Two = signs in value, quoted
  `URL="https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34"`,

  // Two = signs in value, unquoted with inline type declaration
  `URL=string=https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34`,

  // Two = signs in value, quoted with inline type declaration
  `URL=string="https://github.com/jessety/env-smart/commits/master?after=5ede1c0faed20fbd3346ea75724d6d096361ae72+34"`,

  // Chaos
  `
testing  = 1
verbose=  TRUE
eqeqeq====
key=
=value
test
=  asdf
#  
=
==
===
1=1
2=2=2
3==3=3=3
4=4=4=4=
success =       boolean = true`
];

// const parsed = unparsed.map(raw => parse(raw));

for (const [ index, value ] of unparsed.entries()) {

  const parsed = parse(value, { verbose: true });

  console.log(`=== Case ${index} ===\n${value}\n==>\n`, parsed, `\n\n`);
}
