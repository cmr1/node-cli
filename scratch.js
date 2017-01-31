'use strict';

const Cli = require('./lib/Cli');

const myCli = new Cli({
	logging: {
		warn: { 
			color: 'magenta'
		},
		test: {
			prefix: 'TEST:',
			color: 'blue',
			throws: true
		}
	},
	optionDefinitions: [
	  { name: 'src', type: String, multiple: true, defaultOption: true },
	  { name: 'timeout', alias: 't', type: Number }
	]
});

console.log(myCli);

myCli.log('log', 2, {a:1, b:2});

myCli.debug('debug');

myCli.warn('warn');

myCli.success('success');

myCli.test('test');

myCli.error('error');

