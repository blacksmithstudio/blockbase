# Your Application
Your application [using Blockbase](http://npmjs.com/package/@blacksmithstudio/blockbase)

### Version
1.0

### Installation

You need to install : 
- NPM (Node.js) in order to get the dependencies
https://nodejs.org/en/


**Installing Blockbase**
```sh
$ npm i -g blockbase
```

**Create your first application**
```sh
$ blockbase create myApp
```

### Usage

Start the app, using node `package.json` scripts runner.
PM2 required (installed with Blockbase) !

#### Development
```sh
$ npm run app
```

#### Sandbox / Production
```sh
$ npm run app:{env}
```

#### Run the tests (mocha should be install, see Dev Dependencies)
```sh
$ npm run test
```

Then your app is available on your localhost : http://localhost:1337

License
----

(Copyright) 2018 - Alexandre Pereira for Blacksmith S.A.S.


**Free Software, Hell Yeah!**

[Node.js]:https://nodejs.org/en
[NPM]:https://www.npmjs.com