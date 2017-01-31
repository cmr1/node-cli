[![Build Status](https://travis-ci.org/cmr1/cli-node.svg?branch=master)](https://travis-ci.org/cmr1/cli-node)

# cli-node
NodeJS CLI module

## Example: (from `scratch.js`)
```javascript
const Cmr1Cli = require('cmr1-cli');

const additionalOptions = [
  { 
    name: 'src', 
    alias: 's', 
    type: String, 
    multiple: true, 
    defaultOption: true, 
    description: 'Input source', 
    typeLabel: '[underline]{file}' 
  },
  { 
    name: 'timeout', 
    alias: 't', 
    type: Number, 
    description: 'Timeout', 
    typeLabel: '[underline]{ms}' 
  }
];

const myCli = new Cmr1Cli({
  name: 'My CLI script name',
  description: 'A description of this script',
  helpHeader: 'Available Options',
  optionDefinitions: additionalOptions,
  logging: {
    test: {
      verbose: true,  // Consider this debug, only show when verbose
      throws: false,  // Should this log type throw an Error?
      stamp: true,    // Also prefix log output with a timestamp
      prefix: 'Test', // Prefix string to show before each log msg
      color: 'blue'   // Color of output text (FG only)
    }
  }
});

Object.keys(myCli.settings.logging).forEach(type => {
  myCli[type](`This is a(n) ${type} message!`);
  myCli[type](`Called using: myCli.${type}('message')`)
});

additionalOptions.forEach(option => {
  const name = option.name;
  const value = myCli.options[name];

  myCli.log(`Option '${name}' = '${value}'`);
});


```

### Example console output:
**Command:** `node scratch.js --src /path/to/input/file --timeout 1000 -fv`


![Example console output](docs/img/cmr1-cli-scratch-out.png?raw=true)


### Example help menu:
**Command:** `node scratch.js --help`


![Example help menu](docs/img/cmr1-cli-scratch-help.png?raw=true)