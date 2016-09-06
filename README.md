# polym
The `polym` (polymer-module) is a module to easily create a Polymer web component element from the template.

It will create the following structure:
```
| - demo
|    - index.html
| - tasks
|    - lint-task.js
|    - release.js
| - test
|    - basic-test.html
|    - index.html
| - .editorconfig
| - .gitattributes
| - .gitignore
| - .jsbeautifyrc
| - .jscsrc
| - .travis.yml
| - bower.json
| - CONTRIBUTING.md
| - gulpfile.js
| - index.html
| - LICENSE.md
| - my-element.html
| - package.json
| - README.md
```

* __demo__ - Demo pages with predefined index file
* __tasks__ - Gulp tasks directory
  * lint-task.js - Call with `gulp lint` to run linters
  * release.js - Call with `gulp release` to publish the release. it uses [conventional-github-releaser](https://github.com/conventional-changelog/conventional-github-releaser) to release the update.
* __test__ - Test cases directory. see [web components tester](https://github.com/Polymer/web-component-tester) for more information
  * basic-test.html - A home for basic tests. it will contain a simple test case example
  * index.html - A file where test cases files should be included.
* __.editorconfig__ - Unified editor configuration
* __.gitattributes__, __.gitignore__ - Git setup files
* __.jsbeautifyrc__, __.jscsrc__ - Linters files with unified setup
* __.travis.yml__ - Travis integration file
* __bower.json__ - Bower definition for dependency management
* __CONTRIBUTING.md__ - A file with description of how to contribute to the project. It will be automatically included into new issue page on github. TODO: It's currently ARC specific file. Should be more generic.
* __gulpfile.js__ - Gulp definitions file. It only includes tasks form the `tasks` directory.
* __index.html__ - Documentation page for the component.
* __LICENSE.md__ - The license file. TODO: It's Apache 2 only. Could be some option to choose between different licenses.
* __my-element.html__ - Generated element. Name of the file depends on the component name.
* __package.json__ - Node dependencies required in gulp tasks.
* __README.md__ - Auto-generated readme file.

## Install
```shell
sudo npm install polym -g
```
It's better to install it as a global command since it doesn't have interface to include it into another node nodule.

## Usage
```shell
polym MODULE-NAME [ --description "the description"] [--author "the author"] [--version "1.0.0"] [--repository "my-org"] [--skip-tests] [--skip-demo]
```

#### MODULE-NAME
The name of the web component. It must be consisted with alphanumeric characters and a `-` sign. All uppercase characters will be normalized to lowercase.

#### Options
| Option | Shortcut | Description |
| --- | --- | --- |
| `--description` | `-d` | Short description for the component used in bower and in the package file |
| `--author` | `-a` | Author of the component. You can set up the `POLYM_AUTHOR` env variable to automatically insert it into this field. If not, the `USER` variable will be used (if present). |
| `--version` | `-v` | Version of the component. Use semantic version standard. |
| `--repository` | `-r` | The repository of the element. It should be only a user or organization name and component name will be appended. Use the `POLYM_REPO` env variable to automate this. |
| `--skip-tests` | `-st` | Skip creation of the tests cases.
| `--skip-demo` | `-sd` | Skip creation of the demo page.
