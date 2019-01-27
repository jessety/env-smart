# env-smart
> Library for Node applications that enables typed values and defaults in `env` values

`env-smart` is a lightweight, zero-dependency library designed to solve two common issues with using environmental variables and `.env` files:
- Variable types
- Default values

In both sitautions, logic specific to the environmental variables (type casting, default checking) ends up seeping into the application logic. If any of these values are re-used in different parts of the app this can even lead to duplication.it can even lead to some very un-DRY repetition.

Instead, `env-smart` enables defining default values and types for all environmental variables in their own configuration files. It supports `.env` files if one is defined, but defaults and type checking are applied to the process' env if not.


## Install

```bash
$ npm install --save env-smart
```


## Usage

```javascript
require('env-smart').load();

// process.env is now populated with the contents the .env file

console.log(process.env.PORT);
```


Types are defined in the `.env.types` file:
```ini
PORT=number
VERBOSE=boolean
```

Default values are defined in the `.env.defaults` file:
```ini
PORT=80
VERBOSE=FALSE
```

Alternatively, you can declare both default values and types in the `.env.defaults` file:
```ini
PORT=80=number
VERBOSE=FALSE=boolean
```

Once defaults and types are set, loading is a breeze:
```javascript
require('env-smart').load();

console.log(`${process.env.PORT}: ${typeof process.env.PORT}`);
// 80: number
```

If neither value is otherwise defined, `process.env` would parse to:
```json
{
  "PORT": 80,
 "VERBOSE": false
}
```

Process env values take precedence over the contents of a `.env` file, and type checking is still applied.

```bash 
$ export PORT=8080 && node index.js
```

```javascript
require('env-smart').load();
console.log(`${process.env.PORT}: ${typeof process.env.PORT}`);
// 8080: number
```

Using a `.env` file makes managing different configurations between deployments much easier:
```ini
PORT=8080
VERBOSE=TRUE
```
Be careful to never commit your `.env` file!


### Options

The `load()` function supports a few optional parameters:

```javascript
require('env-smart').load({
  directory: __dirname, // manually specify the directory to load .env files from
  encoding: 'utf8', // manually specify the encoding of the .env files
  lowercase: true, // make all keys lower case.
  // uppercase: true, // make all keys upper case
  verbose: true, // output debug information to the console
});

// The 'PORT' value has been re-named 'port' by including the `lowercase` option
console.log(`${process.env.port}: ${typeof process.env.port}`);

```

Include `replace: false` option to return the parsed values without replacing the contents of `process.env`:

```javascript
const settings = require('env-smart').load({ replace: false });

console.log(settings.PORT);
```


## License

MIT © Jesse T Youngblood
