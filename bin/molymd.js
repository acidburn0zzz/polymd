#!/usr/bin/env node

'use strict';

process.title = 'polymd';
const resolve = require('resolve');
const updateNotifier = require('update-notifier');
const packageJson = require('../package.json');

// See https://github.com/yeoman/update-notifier#how for how this works.
updateNotifier({pkg: packageJson}).notify();

resolve('polymd', {basedir: process.cwd()}, function(error, path) {
  let lib = path ? require(path) : require('..');
  let args = process.argv.slice(2);
  let cli = new lib.PolyMd(args);
  if (cli.argumentError) {
    return;
  }
  cli.run();
  process.exit(0);
});
