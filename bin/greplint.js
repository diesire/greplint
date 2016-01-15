#!/usr/bin/env node
'use strict';

var Cli = require('../lib/cli').default;

new Cli().run(process.argv);
