/* eslint-env mocha */

const expect = require('chai').expect
const sinon = require('sinon')

const Cli = require('../../')

describe('Cli | Options', function () {
  let oldArgs = []
  const defaultArgs = [
    '/path/to/node',
    '/path/to/file'
  ]

  beforeEach(function () {
    this.sinon = sinon.sandbox.create()

    oldArgs = process.argv
  })

  it('has expected default option definitions', function () {
    const testCli = new Cli()

    const expectedDefaults = [
      'help',
      'force',
      'quiet',
      'verbose'
    ]

    const presentDefaults = testCli.settings.optionDefinitions.filter(optDef => {
      return expectedDefaults.indexOf(optDef.name) !== -1
    })

    expect(presentDefaults).to.have.length(expectedDefaults.length)
  })

  describe('help', function () {
    it('should show help menu with help option & alias', function () {
      const options = [
        '--help', // Help option
        '-h' // Help option alias
      ]

      options.forEach(opt => {
        this.sinon.stub(console, 'log')
        this.sinon.stub(process, 'exit')

        process.argv = Object.assign([], defaultArgs)
        process.argv.push(opt)

        const testCli = new Cli()

        expect(testCli).to.not.eql(undefined)
        expect(console.log.called).to.eql(true)
        expect(process.exit.calledOnce).to.eql(true)

        this.sinon.restore()
      })
    })

    it('should print an error and show help menu for unknown options', function () {
      const options = [
        '--fake-option', // Unknown option
        '-a' // Unknown option alias
      ]

      options.forEach(opt => {
        this.sinon.stub(console, 'error')
        this.sinon.stub(console, 'log')
        this.sinon.stub(process, 'exit')

        process.argv = Object.assign([], defaultArgs)
        process.argv.push(opt)

        const testCli = new Cli()

        expect(testCli).to.not.eql(undefined)
        expect(console.error.calledOnce).to.eql(true)
        expect(console.log.called).to.eql(true)
        expect(process.exit.calledOnce).to.eql(true)

        this.sinon.restore()
      })
    })
  })

  describe('force', function () {
    it('should throw an error without force option & suppress exceptions with it', function () {
      this.sinon.stub(console, 'log')

      const testCli = new Cli({
        logging: {
          test: {
            throws: true
          }
        }
      })

      expect(testCli.test).to.throw(Error)
      expect(console.log.called).to.eql(true)

      this.sinon.restore()
    })

    it('suppress exceptions if force option is set', function () {
      const options = [
        '--force', // Force option
        '-f' // Force option alias
      ]

      options.forEach(opt => {
        this.sinon.stub(console, 'log')

        process.argv = Object.assign([], defaultArgs)
        process.argv.push(opt)

        const testCli = new Cli({
          logging: {
            test: {
              throws: true
            }
          }
        })

        expect(testCli.options.force).to.eql(true)

        if (testCli.options.force) {
          expect(testCli.test).to.not.throw(Error)
        } else {
          expect(testCli.test).to.throw(Error)
        }

        expect(console.log.called).to.eql(true)

        this.sinon.restore()
      })
    })
  })

  describe('quiet', function () {
    it('should suppress all output', function () {
      const options = [
        '--quiet', // Quiet option
        '-q' // Quiet option alias
      ]

      options.forEach(opt => {
        process.argv = Object.assign([], defaultArgs)
        process.argv.push(opt)

        const testCli = new Cli()

        Object.keys(testCli.settings.logging).forEach(method => {
          const methodConfig = testCli.settings.logging[method]
          const consoleMethod = (typeof console[method] === 'function' ? method : 'log')

          this.sinon.stub(console, consoleMethod)

          if (methodConfig.throws) {
            expect(testCli[method]).to.not.throw(Error)
          } else {
            testCli[method](`Calling: ${method}`)
          }

          expect(console[consoleMethod].called).to.eql(false)

          this.sinon.restore()
        })
      })
    })
  })

  describe('verbose', function () {
    it('should allow all output including debug', function () {
      const options = [
        '--verbose', // Verbose option
        '-v' // Verbose option alias
      ]

      options.forEach(opt => {
        process.argv = Object.assign([], defaultArgs)
        process.argv.push(opt)

        const testCli = new Cli()

        Object.keys(testCli.settings.logging).forEach(method => {
          const methodConfig = testCli.settings.logging[method]
          const consoleMethod = (typeof console[method] === 'function' ? method : 'log')

          this.sinon.stub(console, consoleMethod)

          if (methodConfig.throws) {
            expect(testCli[method]).to.throw(Error)
          } else {
            testCli[method](`Calling: ${method}`)
          }

          expect(console[consoleMethod].called).to.eql(true)

          this.sinon.restore()
        })
      })
    })
  })

  afterEach(function () {
    this.sinon.restore()

    process.argv = oldArgs
    oldArgs = []
  })
})
