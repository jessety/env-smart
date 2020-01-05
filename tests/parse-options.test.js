'use strict';

const { parse } = require('../index');

const tests = [
  {
    name: `respects inline types by default`,
    input: `temperature=number=42`,
    output: { temperature: 42 }
  },
  {
    name: `ignores inline types when set to`,
    input: `temperature=number=42`,
    options: { inlineTypes: false },
    output: { temperature: 'number=42' }
  },
  {
    name: `respects inline types when directed to`,
    input: `temperature=number=42`,
    options: { inlineTypes: true },
    output: { temperature: 42 }
  },
  {
    name: `parses keys as lowercase when directed to`,
    input: `TEST=true`,
    options: { lowercase: true },
    output: { test: 'true' }
  },
  {
    name: `parses keys as uppercase when directed to`,
    input: `test=true`,
    options: { uppercase: true },
    output: { TEST: 'true' }
  }
];

for (const { name, input, output, options } of tests) {

  test(name, () => {

    const parsed = parse(input, options || {});

    expect(parsed).toEqual(output);
  });
}
