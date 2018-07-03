/* eslint-env mocha */

const expect = require('chai').expect
const sinon = require('sinon')

const Cli = require('../../')

describe('Cli | Input', function () {
  let oldArgs = []

  // const defaultArgs = [
  //   '/path/to/node',
  //   '/path/to/file'
  // ]

  const inputMethods = [
    {
      cli: 'prompt',
      rls: 'question'
    },
    {
      cli: 'select',
      rls: 'keyInSelect'
    },
    {
      cli: 'confirm',
      rls: 'keyInYN'
    }
  ]

  beforeEach(function () {
    this.sinon = sinon.sandbox.create()

    oldArgs = process.argv
  })

  it('should have default cli input methods', function () {
    const testCli = new Cli()

    inputMethods.forEach(methodConfig => {
      expect(testCli[methodConfig.cli]).to.be.a('function')

      // this.sinon.stub(readLineSync, methodConfig.rls);

      // testCli[methodConfig.cli]();

      // expect(readLineSync[methodConfig.rls].called).to.be.true;

      // this.sinon.restore();
    })
  })

  afterEach(function () {
    this.sinon.restore()

    process.argv = oldArgs
    oldArgs = []
  })
})
