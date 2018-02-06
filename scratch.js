'use strict';

const Cmr1Cli = require('./lib/cli');

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
      throws: false, 	// Should this log type throw an Error?
      stamp: true,		// Also prefix log output with a timestamp
      prefix: 'Test', // Prefix string to show before each log msg
      color: 'blue'		// Color of output text (FG only)
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

const username = myCli.prompt('Username: ');

if (myCli.confirm(`Allow user: '${username}' to process file: ${myCli.options.src}?`)) {
  myCli.success(`File: ${myCli.options.src} processed by user: '${username}'`);
} else {
  myCli.warn(`User: '${username}' not allowed to process file: ${myCli.options.src}`);
}

