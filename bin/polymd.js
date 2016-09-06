#!/usr/bin/env node

'use strict';

process.title = 'polymd';

const program = require('commander');
const updateNotifier = require('update-notifier');
const packageJson = require('../package.json');
const lib = require('../main.js');

// See https://github.com/yeoman/update-notifier#how for how this works.
updateNotifier({pkg: packageJson}).notify();

program
  .arguments('<componentName>')
  .option('-d, --description <description>', 'Short description of the component used in bower ' +
    'and in the package file', '')
  .option('-a, --author <author>', 'Author of the component. You can set up the `POLYMD_AUTHOR` ' +
    'env variable to automatically insert it into this field. If not, the `USER` variable will ' +
    'be used (if present).', '')
  .option('-v, --version <version>', 'Version of the component. Use semantic version standard.',
    '1.0.0')
  .option('-r, --repository <repository>', 'The repository of the element. It should be only a ' +
    'user or organization name and component name will be appended. Use the `POLYMD_REPO` env ' +
    'variable to automate this.')
  .option('-p, --path <path>', 'Target directory where the element will be created. ' +
    'Current directory by default.')
  .option('-s, --skip-tests', 'Skip creation of the tests cases.', false)
  .option('-d, --skip-demos', 'Skip creation of the demo page.', false)
  .option('--arc', 'Special switch to create a component for Advanced REST Client.', false)
  .option('--debug', 'Don\'t use it.', false)

  .action((componentName) => {
    if (!componentName) {
      program.outputHelp();
      return;
    }
    let cli;
    try {
      // program.path = process.cwd();
      cli = new lib.PolyMd(componentName, program);
    } catch (e) {
      console.error(e.message);
      program.outputHelp();
      return;
    }
    // console.log(cli.name);
    // console.log(cli.description);
    // console.log(cli.author);
    // console.log(cli.version);
    // console.log(cli.skipTests);
    // console.log(cli.skipDemos);
    // console.log(cli.target);
    cli.run();
  })
  .parse(process.argv);
