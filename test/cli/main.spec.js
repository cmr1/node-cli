'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const Cli = require('../../');

describe('Cli', function() {
	let oldArgs = [];
	let testCli = null;

	beforeEach(function() {
		this.sinon = sinon.sandbox.create();

		oldArgs = process.argv;

		process.argv = [
			'/path/to/node',
			'/path/to/file',
			'--verbose'
		];

		testCli = new Cli();
	});

	it('should exist with expected structure', function() {
		expect(testCli).to.exist;
		expect(testCli.settings).to.be.an('object');
		expect(testCli.options).to.be.an('object');
	});

	it('should have dynamic logging functions', function() {
		Object.keys(testCli.settings.logging).forEach(method => {
			const methodConfig = testCli.settings.logging[method];

			expect(testCli[method]).to.be.a('function');
			
			const consoleMethod = (typeof console[method] === 'function' ? method : 'log');

			if (testCli.options.verbose || methodConfig.verbose) {
				this.sinon.stub(console, consoleMethod);
			
				if (methodConfig.throws) {
					expect(testCli[method]).to.throw(Error);
				} else {
					expect(testCli[method]).to.not.throw(Error);
				}
				
				expect(console[consoleMethod].calledOnce).to.be.true;

				this.sinon.restore();
			}
		});
	});

  afterEach(function() {
  	this.sinon.restore();

  	process.argv = oldArgs;
  	oldArgs = [];
  });
});