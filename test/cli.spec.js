'use strict';

const expect = require('chai').expect;
const Cli = require('../');

describe('Cli', function() {
	const myCli = new Cli({
		optionDefinitions: [
		  { name: 'verbose', alias: 'v', type: Boolean },
		  { name: 'src', type: String, multiple: true, defaultOption: true },
		  { name: 'timeout', alias: 't', type: Number }
		]
	});

    it('should pass', function() {
    	console.log(myCli.options);
        expect(true).to.be.ok;
    });
});