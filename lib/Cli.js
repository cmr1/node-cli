'use strict';

const extend = require('extend');
const colors = require('colors/safe');
const clArgs = require('command-line-args');
const getUsage = require('command-line-usage')

const defaultSettings = {
	name: 'Node CLI',
	description: 'No description',
	helpHeader: 'Options',
	allowForceNoThrow: true,
	logging: {
		log: {
			stamp: true,
			prefix: '',
			color: 'white'			
		},
		warn: {
			stamp: true,
			throws: false,
			prefix: 'WARN:',
			color: 'yellow',
		},
		error: {
			stamp: true,
			throws: true,
			prefix: 'ERROR:',
			color: 'red'
		},
		debug: {
			stamp: true,
			verbose: true,
			prefix: 'DEBUG:',
			color: 'cyan'
		},
		success: {
			stamp: true,
			prefix: 'SUCCESS:',
			color: 'green'
		}
	},
	optionDefinitions: [
		{
			name: 'help',
			alias: 'h',
			type: Boolean,
			description: 'Print this usage guide.'
		},
		{
			name: 'force',
			alias: 'f',
			type: Boolean,
			description: 'Ignore "throws" flag on logging methods.'
		},
		{
			name: 'quiet',
			alias: 'q',
			type: Boolean,
			description: 'Surpress all log output'
		},
		{
			name: 'verbose',
			alias: 'v',
			type: Boolean,
			description: 'Show debugging output.'
		}
	]
};

class Cli {
	constructor(settings = {}) {
		try {
			this.options = {};
			this.settings = Object.assign({}, defaultSettings);

			this.mergeSettings(settings);
			this.enableLogging();
			this.setOptions();
		} catch (e) {
			this.options.force = true;

			const logger = (typeof this.error === 'function' ? this.error : console.error);

			if (typeof e.message === 'string') {
				logger(e.message)
			} else if (typeof e.name === 'string') {
				logger(e.name);
			} else {
				logger(e);
			}

			this.showHelp();
		}
		
		if (this.options.help) {
			this.showHelp();
		}
	}

	mergeSettings(settings = {}) {
		if (typeof settings === 'object') {
			Object.keys(settings).forEach(key => {
				const val = settings[key];

				if (typeof this.settings[key] === typeof val) {
					switch(typeof val) {
						case 'object':
							if (Array.isArray(this.settings[key]) && Array.isArray(val)) {
								this.settings[key] = this.settings[key].concat(val);
							} else if (!Array.isArray(this.settings[key]) && !Array.isArray(val)) {
								this.settings[key] = extend(true, this.settings[key], val);
							} else {
								throw new Error(`Cannot override setting: '${key}' ... Type did not match!`);
							}
							break;
						default:
							this.settings[key] = val;
							break;
					}
				} else if (typeof this.settings[key] === 'undefined') {
					this.settings[key] = val;
				}
			});
		}
	}

	enableLogging() {
		if (typeof this.settings.logging === 'object') {
			Object.keys(this.settings.logging).forEach(method => {
				const methodConfig = this.settings.logging[method];

				if (typeof this[method] === 'undefined') {
					this[method] = (...args) => {
						if ((!methodConfig.verbose || this.options.verbose) && !this.options.quiet) {
							const consoleMethod = (typeof console[method] === 'function' ? console[method] : console['log']);
							const prefix = (typeof methodConfig.prefix === 'string' ? methodConfig.prefix : '');
							const color = (typeof colors[methodConfig.color] === 'function' ? methodConfig.color : 'white');

							let output = Cli.colorize(args, color);

							if (prefix.trim() !== '') {
								output = Cli.colorize([prefix], color).concat(output);
							}

							if (methodConfig.stamp) {
								const timeStamp = this.getTimeStamp();
								output = Cli.colorize([`[${timeStamp}]`], color).concat(output);
							}

							consoleMethod(...output);

							if (methodConfig.throws === true && !(this.settings.allowForceNoThrow && this.options.force)) {
								throw new Error(args);
							}
						}
					}
				}
			});
		}
	}

	setOptions() {		
		this.options = clArgs(this.settings.optionDefinitions);
	}

	getOptions() {
		return this.options;
	}

	getHelpSections() {
		return [
			{
				header: this.settings.name,
				content: this.settings.description
			},
			{
				header: this.settings.helpHeader,
				optionList: this.settings.optionDefinitions
			}
		];
	}

	getTimeStamp() {
		const d = new Date();

		return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
	}

	showHelp() {
		console.log(getUsage(this.getHelpSections()));
		process.exit(0);
	}

  static colorize(args, color) {
    if (typeof colors[color] === 'function') {
      Object.keys(args).forEach(key => {
        if (typeof args[key] === 'string') {
          args[key] = colors[color](args[key]);
        }
      });
    }

    return args;
  }
}

module.exports = Cli;