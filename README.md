# env-smart

Zero-dependency library for using .env files with types and default values

[![ci](https://github.com/jessety/env-smart/workflows/ci/badge.svg)](https://github.com/jessety/env-smart/actions)
[![npm](https://img.shields.io/npm/v/env-smart.svg)](https://www.npmjs.com/package/env-smart)
[![license](https://img.shields.io/github/license/jessety/env-smart.svg)](https://github.com/jessety/env-smart/blob/main/LICENSE)

`env-smart` is a lightweight, zero-dependency library for loading configuration from environmental variables and `.env` files in JavaScript or TypeScript. It is designed to solve two common issues with environmental variables:

- Variable types
- Default values

In both sitautions, logic specific to the configuration (type casting, default checking) ends up seeping into the application logic. If any of these values are re-used in different parts of the app this can even lead to duplication.

Instead, `env-smart` enables declaring default values and types for all environmental variables in additional configuration files. It loads the contents of the `.env` file if present, but defaults and type checking are applied to the process' env if not.

## Installation

```bash
npm install env-smart
```

## Usage

Calling `.load()` populates `process.env` with the contents of a `.env` file in the root directory of your project, as well as the process' environmental variables.

```javascript
// Modules
import env from 'env-smart';
env.load();

// CommonJS
require('env-smart').load();

console.log(process.env.PORT);
```

Using a `.env` files to store environmental variables makes managing different configurations between deployments much easier. Example file:

```ini
PORT=8080
VERBOSE=TRUE
API_KEY=xyz
```

### Types and Defaults

In addition to the main `.env` file, `env-smart` also checks for two additional optional configuration files: `.env.defaults` and `.env.types`.

Default values are set in the `.env.defaults` file:

```ini
PORT=80
VERBOSE=FALSE
```

If an environmental variable is otherwise empty empty, it's value from `.env.defaults` will be used.

Types are set in the `.env.types` file:

```ini
PORT=number
VERBOSE=boolean
```

Supported types are: `string`, `number`, `boolean`, `object` and `array`.

Alternatively, variable types may be declared inline in the `.env.defaults` file:

```ini
PORT=number=80
VERBOSE=boolean=FALSE
```

Once defaults and types are set, loading is a breeze:

```javascript
require('env-smart').load();

console.log(`${process.env.PORT}: ${typeof process.env.PORT}`);
// 80: number
```

Process environmental variables take precedence over the contents of a `.env` file, and type checking is still applied.

```bash
export PORT=8080 && node index.js
```

```javascript
require('env-smart').load();
console.log(`${process.env.PORT}: ${typeof process.env.PORT}`);
// 8080: number
```

Both `.env.defaults` and `.env.types` should not contain any secrets, and should be committed to version control systems. Be careful to never commit the `.env` file.

### Options

The `load()` function supports a few optional parameters:

```javascript
require('env-smart').load({
  directory: __dirname, // manually specify the directory to load .env files from
  encoding: 'utf8', // manually specify the encoding of the .env files
  lowercase: true, // make all keys lower case.
  // uppercase: true, // make all keys upper case
  verbose: true, // output debug information to the console
  process: false, // if set to false, don't parse the process env, only dotfiles
  inlineTypes: false, // don't allow inline type declarations in .env or .env.defaults, e.g. PORT=number=8080

  envFilename : '.env', //  manually specify .env file name
  envDefaultsFilename : '.env.defaults', // manually specify .env.defaults file name
  envTypesFilename : '.env.types' // manually specify .env.types file name
});

// The 'PORT' value has been re-named 'port' by including the `lowercase` option
console.log(`${process.env.port}: ${typeof process.env.port}`);
```

Include `replace: false` option to return the parsed values without replacing the contents of `process.env`:

```javascript
const settings = require('env-smart').load({ replace: false, lowercase: true });

console.log(settings.port);
```

## License

MIT © Jesse T Youngblood
