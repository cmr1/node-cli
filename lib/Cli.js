'use strict';

const extend = require('extend');
const colors = require('colors/safe');
const clArgs = require('command-line-args');

const defaultSettings = {
	allowForceNoThrow: true,
	logging: {
		log: {
			prefix: '',
			color: 'white'
		},
		warn: {
			throws: false,
			prefix: 'WARN:',
			color: 'yellow',
		},
		error: {
			throws: true,
			prefix: 'ERROR:',
			color: 'red'
		},
		debug: {
			verbose: true,
			prefix: 'DEBUG:',
			color: 'cyan'
		},
		success: {
			prefix: 'SUCCESS:',
			color: 'green'
		}
	},
	optionDefinitions: [
		{
			name: 'verbose',
			alias: 'v',
			type: Boolean
		},
		{
			name: 'force',
			alias: 'f',
			type: Boolean
		}
	]
}

class Cli {
	constructor(settings = {}) {
		this.optionDefinitions = [];
		this.options = [];

		this.settings = Object.assign({}, defaultSettings);

		this.mergeSettings(settings);

		this.setOptions();

		this.enableLogging();
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
						if (!methodConfig.verbose || this.options.verbose) {
							const consoleMethod = (typeof console[method] === 'function' ? console[method] : console['log']);
							const prefix = (typeof methodConfig.prefix === 'string' ? methodConfig.prefix : '');
							const color = (typeof colors[methodConfig.color] === 'function' ? methodConfig.color : 'white');

							if (prefix.trim() !== '') {
								consoleMethod(colors[color](prefix), ...Cli.colorize(args, color));							
							} else {
								consoleMethod(...Cli.colorize(args, color));							
							}

							if (methodConfig.throws === true && !(this.settings.allowForceNoThrow && this.options.force)) {
								throw new Error(args);
							}
						}
					}
				}
			});
		}
	}

	setOptionDefinitions(optionDefinitions = []) {
		let definitions = [];

		if (typeof optionDefinitions === 'object') {
			if (!Array.isArray(optionDefinitions)) {
				definitions.push(optionDefinitions);
			} else {
				definitions = Object.assign([], optionDefinitions);
			}
		}

		this.optionDefinitions = defaultOptionDefinitions.concat(definitions);

		this.log(this.optionDefinitions);
	}

	setOptions() {		
		this.options = clArgs(this.settings.optionDefinitions);
	}

	getOptions() {
		return this.options;
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