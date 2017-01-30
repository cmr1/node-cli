'use strict';

const Cli = require('./lib/Cli');

const myCli = new Cli({
	logging: {
		warn: { 
			color: 'magenta'
		},
		test: {
			prefix: 'TEST:',
			color: 'blue'
		}
	},
	optionDefinitions: [
	  { name: 'src', type: String, multiple: true, defaultOption: true },
	  { name: 'timeout', alias: 't', type: Number }
	]
});

myCli.log('log');

myCli.debug('debug');

myCli.warn('warn');

myCli.success('success');

myCli.test('test');

myCli.error('error');

