#!/usr/bin/env node

'use strict';

process.title = 'polymd';

const program = require('commander');
const updateNotifier = require('update-notifier');
const packageJson = require('../package.json');
const lib = require('../main.js');

// See https://github.com/yeoman/update-notifier#how for how this works.
updateNotifier({
  pkg: packageJson
}).notify();

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
  .option('-s, --skip-test', 'Skip creation of the tests cases.', false)
  .option('-d, --skip-demo', 'Skip creation of the demo page.', false)
  .option('--arc', 'Special switch to create a component for Advanced REST Client.', false)
  .option('-n, --no-deps', 'Do not install dependencies.', false)
  .option('--no-travis', 'Do not add .travis.yaml file')
  .option('--no-dependencyci', 'Do not add dependencyci.yml file')

.action((componentName) => {
  if (!componentName) {
    program.outputHelp();
    return;
  }

  try {
    // program.path = process.cwd();
    let cli = new lib.PolyMd(componentName, program);
    cli.run();
  } catch (e) {
    console.error(e.message);
    program.outputHelp();
    return;
  }

});

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    Create ARC\'s component (with predefined values)');
  console.log('    $ polymd --adc -d "MY new component" new-component');
  console.log('');
  console.log('    Create a Polymer component');
  console.log('    $ polymd -d "Description" -a "Author" -v "0.0.1" component-name');
  console.log('');
  console.log('    Just a component without additional files.');
  console.log('    $ polymd --adc --skip-test --skip-demo new-component');
  console.log('');
});

program.parse(process.argv);
