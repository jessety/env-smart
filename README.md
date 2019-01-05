# smart-env
> Library for Node applications that enables typed values and defaults in `env` values

`smart-env` is designed to solve two issues with using `.env` files:
- Variable types
- Default values

In both sitautions, logic specific to the environmental variables (type casting, default checking) ends up seeping into the application logic. If any of these values are re-used in different parts of the app, it can even lead to some very un-DRY repetition.

Instead, `smart-env` enables defining default values and types for all environmental variables in their own configuration files. It supports `.env` files if one is defined, but defaults and type checking are also applied to the `process.env` if not.

## Install

```bash
$ npm install --save smart-env
```

## Usage

Types are defined in the `.env.types` file:
```ini
PORT=NUMBER
VERBOSE=BOOLEAN
```
Default values are defined in the `.env.defaults` file:
```ini
PORT=80
VERBOSE=FALSE
```

Once those two files are set, loading is a breeze:

```javascript
const env = require('smart-env').load();

// Because a type was defined for the 'VERBOSE' key, it's guarenteed to be a boolean value
// -- therefore, we can use a quick ternary operator for a one-liner log function:
const log = env.VERBOSE ? (...messages) => console.log('DEBUG:', ...messages) : () => {};

log('This will only be visible if the `VERBOSE` env is set to true.');
```

From a terminal:
```bash 
$ export PORT=8080 && node index.js
```

Lastly, using a `.env` file makes managing different configurations between deployments much easier:
```ini
PORT=8080
VERBOSE=TRUE
```
Be careful to never commit your `.env` file!


## License

MIT © Jesse T Youngblood
