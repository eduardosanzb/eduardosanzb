#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const colorLetter = color => msg => console.log(chalk[color](msg));
const bigColotLetter = color => msg => color.log(colorLetter(color)(msg))
const yellow = text => console.log(
  chalk
  .yellow(
    figlet.textSync(text, { horizontalLayout: 'default', kernig: 'fitted'})));

clear();

const red = colorLetter('red');

red('hello')
bigColotLetter('hi')
