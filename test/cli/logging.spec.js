'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const Cli = require('../../');

describe('Cli | Logging', function() {
	let oldArgs = [];
	let testCli = null;
  const defaultArgs = [
    '/path/to/node',
    '/path/to/file'
  ];

  beforeEach(function() {
    this.sinon = sinon.sandbox.create();

    oldArgs = process.argv;
  });

  it('should support default logging methods', function() {
    process.argv = Object.assign([], defaultArgs);
    process.argv.push('--verbose');

    const testCli = new Cli();

    Object.keys(testCli.settings.logging).forEach(method => {
      const methodConfig = testCli.settings.logging[method];
      const consoleMethod = (typeof console[method] === 'function' ? method : 'log');

      this.sinon.stub(console, consoleMethod);

      if (methodConfig.throws) {
        expect(testCli[method]).to.throw(Error);
      } else {
        testCli[method](`Calling: ${method}`);            
      }

      expect(console[consoleMethod].called).to.be.true;

      this.sinon.restore();
    });
  });

  afterEach(function() {
  	this.sinon.restore();

  	process.argv = oldArgs;
  	oldArgs = [];
  });
});