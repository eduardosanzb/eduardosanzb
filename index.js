#!/usr/bin/env node
"use strict";
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const importJsx = require("import-jsx");
const ui = importJsx("./components");
const { h, render } = require("ink");

const log = console.log;

clear();
render(h(ui));
