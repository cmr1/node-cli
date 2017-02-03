'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const Cli = require('../../');

describe('Cli | Options', function() {
	let oldArgs = [];
	const defaultArgs = [
		'/path/to/node',
		'/path/to/file'
	];

	beforeEach(function() {
		this.sinon = sinon.sandbox.create();

		oldArgs = process.argv;
	});

	it('has expected default option definitions', function() {
		const testCli = new Cli();

		const expectedDefaults = [
			'help',
			'force',
			'quiet',
			'verbose'
		];

		const presentDefaults = testCli.settings.optionDefinitions.filter(optDef => {
			return expectedDefaults.indexOf(optDef.name) !== -1;
		});

		expect(presentDefaults).to.have.length(expectedDefaults.length);
	});

	it('should show help menu with help option & alias', function() {
		const helpOptions = [
			'--help', // Help option
			'-h'      // Help option alias
		];

		helpOptions.forEach(opt => {
			this.sinon.stub(console, 'log');
			this.sinon.stub(process, 'exit');

			process.argv = Object.assign([], defaultArgs);
			process.argv.push(opt);

			const testCli = new Cli();
			
			expect(console.log.called).to.be.true;
			expect(process.exit.calledOnce).to.be.true;

	  	this.sinon.restore();
		});
	});

	it('should print an error and show help menu for unknown options', function() {
		const helpOptions = [
			'--fake-option', // Unknown option
			'-a',						 // Unknown option alias
		];

		helpOptions.forEach(opt => {
			this.sinon.stub(console, 'error');
			this.sinon.stub(console, 'log');
			this.sinon.stub(process, 'exit');

			process.argv = Object.assign([], defaultArgs);
			process.argv.push(opt);

			const testCli = new Cli();

			expect(console.error.calledOnce).to.be.true;
			expect(console.log.called).to.be.true;
			expect(process.exit.calledOnce).to.be.true;

	  	this.sinon.restore();
		});
	});

	it('should throw an error without force option & suppress exceptions if force option is set', function() {

	});

	it('should suppress all output', function() {

	});

	it('should allow all output including debug', function() {

	});

	afterEach(function() {
  	this.sinon.restore();

  	process.argv = oldArgs;
  	oldArgs = [];
  });
});