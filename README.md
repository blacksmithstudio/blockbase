# Blockbase
Lightweight MVC Framework for Node.

### Version
0.1.2 alpha

### Install
You need first to have Node.JS on your machine. If not [please folllow the install instructions here](https://nodejs.org)

Then let's move on :

1. Create first a project directory
``` shell
$ cd /workspace && mkdir myproject
```

2. Create the architecture (you can use [the sample app](https://bitbucket.org/blacksmithstudio/sample) as a model)
```
/config
/drivers
/controllers
/models
app.js
```

3. Install Blockbase
``` shell
$ npm i --save @blacksmithstudio/blockbase
```

4. Edit your `app.js`
Blockbase is using a simple instance method : `blockbase(options, callback)`
In options, the only mandatory property is `root` handling the path of the current project (see example below).
``` js
const blockbase = require('@blacksmithstudio/blockbase')

blockbase({ root : __dirname }, (app) => {
    app.drivers.logger.success('App', `${app.config.name} is alive !`)
    // let's code !
})
```

#### Namespace `app.*`
If you log the `app` variable from the callback, you'll get the following architecture :
* `app.config`: contains the config JSON from /config/{env}.yml (see [config](https://www.npmjs.com/package/config) package)
* `app.root`: path where the app is launched
* `app.drivers`: drivers namespace, by default is containing only `app.drivers.logger` handling the console logs. You can install more drivers (see more [Drivers Install](#drivers-install))
* `app.controllers`: will be automatically populated by the files from /controllers/* (see more [Managing Controllers](#managing-controllers))
* `app.models`: will be automatically populated by the files from /models/* (see more [Managing Models](#managing-models))

#### Drivers Install

##### Automatic install for official drivers.
You can easily install official drivers by using `npm i` in your project. This will automatically add the driver to the blockbase namespace `app.drivers.*`
``` shell
$ npm i --save @blacksmithstudio/blockbase-postgresql
```
In the example above, the driver will be install under the `app.drivers.postgresql` namespace

##### Manual Install for your custom drivers.
You can create your own drivers by adding them to the /drivers/ folder.
```
$ touch ./drivers/custom.js
```

Blockbase structure allows you to pass the entire `app.*` namespace to your drivers, controllers, etc...
Here is an example of a custom driver :

example below : /drivers/custom.js
```js
const something = require('something')

module.exports = (app) => {
    // setup of your driver
    return {
        foo(arg1, arg2) {
            // do something
        },

        bar() {
            // do something
        }
    }
}
```

Following that you'll be able to use anywere the driver by calling `app.drivers.custom.foo(arg1, arg2)` for example.
!!! Please don't call any controller or model in the driver above the `return` statement as it is instanciated at the application initialization.

#### Managing Controllers
Controllers will follow the same rules, you want to create a controller ? Just add it under /controllers, but there are some differences.
- Controllers could have an optional `init` method, triggered on the creation of the app.
- Controllers can have sub namespaces (2 dimensions max) like `app.controllers.sub.foo.bar`

Example of Architecture :
```
/config
/drivers
/controllers
---/custom.js
---/foo/bar.js
/models
app.js
```
Following the construction above, Blockbase will render `app.controllers.custom.*` and `app.controllers.foo.bar.*`

#### Managing Models

Models follow a slight different approach, using `class` and `extends` properties of ES6.

##### Building a custom model from scratch
You can build a custom model with no inherited properties and submethods.
Adding it directly to /models/ will add it to the `app.models.*` namespace

Example : /models/mymodel.js

```js
module.exports = (app) => {
    return class MyModel {
        constructor(data){
            // init my model
        }

        example(){
            // model sub method
        }
    }
}
```
However this model is limited, having only its declared subproperties.

##### Building a custom model with Blockbase inheritance

Example : /models/awesome.js

```js
module.exports = (app) => {
    const Model = app.models._model

    return class Awesome extends Model {
        constructor(data){
            super({ type : 'awesome', authenticated : false })

            if(data)
                this.data = data
        }

        example(){
            // example of an additional method
        }
    }
}
```

The main change is on the `Model` inheritance.
Thanks to that you'll get access to multiple new features.

```js
    const Model = app.models._model
    [...]
    return class Awesome extends Model {
```

@TODO - finish the model documentation

#### Run tests
Blockbase has some unit tests (with [Mocha](https://mochajs.org)) written run them often !

```sh
$ npm test
```

License
----
(Copyright) 2017 - Alexandre Pereira for Blacksmith S.A.S.


**Free Software, Hell Yeah!**

[Node.js]:https://nodejs.org/en
[NPM]:https://www.npmjs.com
