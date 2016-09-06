'use strict';
const path = require('path');
const fs = require('fs');
/**
 * The PolyM module is a command line module to create polymer elements from a template.
 * It contains full directory structure with the helper files like .gitignore or .hintrc
 *
 * # Usage
 * polym module-name [--description "the description"]
 *
 * Where `module-name` is a name of the web component.
 */
class PolyM {

  constructor(options) {
    if (options !== undefined) {

    }
    var result = this.processArgs(process.argv.slice(2));
    if (!result) {
      return;
    }
    this.setTarget();
    // console.log(process.argv); process.cwd()
    this.run();
  }

  get switchersMap() {
    return ['--debug', '--skip-tests','-st','--skip-readme','-sr', '--skip-demo', '-sd'];
  }

  get paramsMap() {
    return ['--description', '-d', '--author', '-a', '--version', -'v', '--repository', '-r'];
  }

  get author() {
    return this._author || process.env.POLYM_AUTHOR || process.env.USER || 'Add author here';
  }

  get repository() {
    if (this._repository) {
      return this._repository;
    }
    if (process.env.POLYM_REPO) {
      return process.env.POLYM_REPO + this.name;
    }
    return 'YOUR-NAME/' + this.name;
  }

  processArgs(args) {
    if (!args || !args.length) {
      this.displayHelp();
      return false;
    }

    var name = args.shift();
    switch (name) {
      case '-h':
      case '--help':
        this.displayHelp();
        return false;
      default:
        if (/[a-zA-Z0-9\-]/.test(name) || name.indexOf('-') === -1) {
          name = name.toLowerCase();
          this.name = name;
        } else {
          this.throwError('invalid-name', name);
          return false;
        }
    }

    var switchers = [];
    var params = new Map();
    var sm = this.switchersMap;
    var pm = this.paramsMap;
    for (let i = 0, len = args.length; i < len; i++) {
      var p = args[i];
      if (sm.indexOf(p) !== -1) {
        switchers.push(p);
      } else if (pm.indexOf(p) !== -1) {
        params.set(p, args[++i]);
      } else {
        this.throwError('invalid-param', p);
        return false;
      }
    }
    this.setArgs(switchers, params);
    return true;
  }
  // Sets the arguments of the program from the command line
  setArgs(switchers, params) {
    switchers.forEach((sw) => this.setSwitch(sw));
    params.forEach((value, key) => this.setParam(key, value));
  }

  setSwitch(sw) {
    switch (sw) {
      case '--skip-tests':
      case '-st':
        this.skipTests = true;
      break;
      case '--debug':
        this.isDebug = true;
      break;
      case '--skip-demo':
      case '-sd':
        this.skipDemo = true;
      break;
    }
  }

  setParam(p, v) {
    switch (p) {
      case '--description':
      case '-d':
        this.description = v;
      break;
      case '--author':
      case '-a':
        this._author = v;
      break;
      case '--version':
      case '-v':
        this.version = v;
      break;
      case '--repository':
      case '-r':
        this._repository = v;
      break;
    }
  }

  throwError(type, param) {
    var message = '';

    switch (type) {
      case 'invalid-name':
        message += 'The name of the component is invalid: ' + param + '. \n';
        message += 'Only A-Z, a-z, 0-9 and `-` signs are allowed. The name must contain ';
        message += 'a `-` sign.';
      break;
      case 'invalid-param':
        message += 'The paramter "' + param + '" is unknown.';
      break;
    }

    console.log('\x1b[31m', '\nError: ' + message + '\n', '\x1b[0m');
    this.displayHelp();
    process.exit(1);
  }

  displayHelp() {
    var m = '\nUsage:\n';
    m += '  polym <MODULE-NAME>';
    m += ' [--description "the description"]';
    m += ' [--author "the author"]';
    m += ' [--version "1.0.0"]';
    m += ' [--repository "my-org"]';
    m += ' [--skip-tests]';
    m += ' [--skip-demo]\n\n';
    m += 'MODULE-NAME: \n';
    m += '  The name of the web component. It must be consisted with alphanumeric\n  characters ';
    m += 'and a `-` sign. All uppercase characters will be normalized\n  to lowercase.\n\n';
    m += 'Options:\n';
    m += '  --description, -d\tShort description for the component \n\t\t\t';
    m += 'used in bower and package file\n\n';
    m += '  --author, -a\t\tAuthor of the component. You can set up the `POLYM_AUTHOR` env \n';
    m += '\t\t\tvariable to automatically insert it into this field.\n';
    m += '\t\t\tIf not, the `USER` variable will be used (if present).\n\n';
    m += '  --version, -v\t\tVersion of the component. Use semantic version standard.\n\n';
    m += '  --repository, -r\tThe repository of the element. It should be only a user or \n';
    m += '\t\t\torganization name and component name will be appended.\n';
    m += '\t\t\tUse the `POLYM_REPO` env variable to automate this.\n\n';
    m += '  --skip-tests, -st\tSkip creation of the tests cases.\n\n';
    m += '  --skip-demo, -sd\tSkip creation of the demo page.\n';

    console.log(m);
  }

  // Set target directory
  setTarget() {
    var dir = process.cwd();
    if (this.isDebug) {
      dir += '/output';
    }
    this.target = dir;
  }

  selfPath(path) {
    return __dirname + '/' + path;
  }

  run() {
    // Copy helper files.
    this.copy(this.selfPath('templates/helpers'), path.join(this.target, './'));
    // Component's metadata and logic.
    this.copy(this.selfPath('templates/logic'), path.join(this.target, './'));
    // Gulp tasks.
    this.copy(this.selfPath('templates/tasks'), path.join(this.target, './tasks'));
    // The Component
    this.copy(this.selfPath('templates/component.html'),
      path.join(this.target, `./${this.name}.html`));
    // Test cases.
    if (!this.skipTests) {
      this.copy(this.selfPath('templates/test'), path.join(this.target, './test'));
    }
    // Demo page.
    if (!this.skipDemo) {
      this.copy(this.selfPath('templates/demo'), path.join(this.target, './demo'));
    }
    this.updateVariables();
  }

  copy(src, dest) {
    var exists = fs.existsSync(src);
    if (!exists) {
      return false;
    }
    var stats = fs.statSync(src);
    if (stats.isFile()) {
      if (fs.existsSync(dest)) {
        let ds = fs.statSync(dest);
        if (ds.isDirectory()) {
          return;
        } else if (ds.isFile()) {
          fs.unlinkSync(dest);
        }
      }
      fs.writeFileSync(dest, fs.readFileSync(src));
      return true;
    } else if (stats.isDirectory()) {
      try {
        fs.mkdirSync(dest);
      } catch (e) {

      }
      fs.readdirSync(src).forEach((file) => {
        this.copy(path.join(src, file),
                        path.join(dest, file));
      });
    }
  }

  // Update variables in the copied files.
  updateVariables() {
    this._updateVars(path.join(this.target, './bower.json'));
    this._updateVars(path.join(this.target, './package.json'));
    this._updateVars(path.join(this.target, './README.md'));
    this._updateVars(path.join(this.target, `./${this.name}.html`));

    // Test file.
    if (!this.skipTests) {
      this._updateVars(path.join(this.target, './test/basic-test.html'));
    }
    // Demo page.
    if (!this.skipDemo) {
      this._updateVars(path.join(this.target, './demo/index.html'));
    }
  }

  _updateVars(file) {
    var name = this.name;
    var author = this.author;
    var description = this.description || 'Insert description here.';
    var version = this.version || '1.0.0';
    var repository = this.repository;

    var txt = fs.readFileSync(file, 'utf8');
    txt = txt.replace(/ELEMENT-NAME/gim, name);
    txt = txt.replace(/ELEMENT-AUTHOR/gim, author);
    txt = txt.replace(/ELEMENT-DESCRIPTION/gim, description);
    txt = txt.replace(/ELEMENT-VERSION/gim, version);
    txt = txt.replace(/REPOSITORY-NAME/gim, repository);
    fs.writeFileSync(file, txt);
  }
}

new PolyM();
