
![Blockbase](https://s3-eu-west-1.amazonaws.com/blockbase/assets/blockbase-logo.svg)
# Blockbase
Lightweight MVC Framework for Node.

[![Travis Blockbase](https://travis-ci.org/blacksmithstudio/blockbase.svg?branch=master)](https://travis-ci.org/blacksmithstudio/blockbase)
[![NPM Version](https://img.shields.io/npm/v/blockbase.svg)](https://www.npmjs.com/package/blockbase)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

### Version
1.0.9

### Summary
- [Install](#install)
- [Namespace Architecture](#namespace)
- [Drivers](#drivers)
- [Controllers](#controllers)
- [Models](#models)

### Install
You need first to have Node.JS on your machine. If not [please folllow the install instructions here](https://nodejs.org)

Then let's move on :

1. Install Blockbase
``` shell
$ npm install -g blockbase
```

2. Create a project using the CLI 
``` shell
$ blockbase create MySuperProject
```

3. Discover the architecture 

Blockbase is based on an hybrid MVC+Drivers architecture to build complete projects and scalable architectures.
```
/config (required, where you'll push your configuration)
/drivers
/controllers
/models
app.js
```

4. Edit your `app.js`
Blockbase is using a simple instance method : `blockbase(options, callback)`
In options, the only mandatory property is `root` handling the path of the current project (see example below).
``` js
const blockbase = require('blockbase')

blockbase({ root : __dirname }, async (app) => {
    app.drivers.logger.success('App', `${app.config.name} is alive !`)
    // let's code !
})
```

#### Namespace
If you log the `app` variable from the callback, you'll get the following architecture :
* `app.config`: contains the config JSON from /config/{env}.yml (see [config](https://www.npmjs.com/package/config) package)
* `app.root`: path where the app is launched
* `app.drivers`: drivers namespace, by default is containing only `app.drivers.logger` handling the console logs. You can install more drivers (see more [Drivers Install](#drivers))
* `app.controllers`: will be automatically populated by the files from /controllers/* (see more [Managing Controllers](#controllers))
* `app.models`: will be automatically populated by the files from /models/* (see more [Managing Models](#models))

#### Drivers

Blockbase is build with a driver linked logic to build connectors to other tools or customer traversal methods across your app. 
We offer a list of [official drivers here](https://github.com/blacksmithstudio/blockbase/blob/master/docs/DRIVERS.md) to install connectors such as [MySQL](https://github.com/blacksmithstudio/blockbase-mysql), [PostgreSQL](https://github.com/blacksmithstudio/blockbase-postgresql), ... 

##### Automatic install for official drivers.
You can easily install [official drivers](https://github.com/blacksmithstudio/blockbase/blob/master/docs/DRIVERS.md) by using `npm i` in your project. This will automatically add the driver to the blockbase namespace `app.drivers.*`
``` shell
$ npm i --save blockbase-express
```
In the example above, the driver will be install under the `app.drivers.express` namespace

##### Manual Install for your custom drivers.
You can create your own drivers by adding them to the /drivers/ folder using the CLI.
```
$ blockbase add driver custom
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

#### Controllers
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

To create a controller
```
$ blockbase add controller foo
```
To create a sub.controller
```
$ blockbase add controller foo.bar
```

#### Models

Models follow a slight different approach, using `class` and `extends` properties of ES6.

##### Building a custom model from scratch

You can build a custom model with no inherited properties and submethods.
Adding it directly to /models/ will add it to the `app.models.*` namespace

To create a model with the CLI
```
$ blockbase add model user
```

Example : /models/user.js

```js
module.exports = (app) => {
    return class User {
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
Blockbase has by default a serie of classic methods powered in the models (create, read, update, delete, etc.) useful in your API build-up. To activate these methods, use the inheritance below :

##### Building a custom model with Blockbase inheritance

Example : /models/user.js

```js
module.exports = (app) => {
    // we call the "super model" from the namespace
    const Model = app.models._model
    
    // we extend the super model in our user model so it will receive all the default methods.
    return class User extends Model {
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

```js
    const Model = app.models._model
    [...]
    return class Awesome extends Model {
```
Thanks to this extend, you'll get access to a lot of default methods in the model.
```js
   const User = app.models.user
   let user = new User({ firstname : 'John', lastname : 'Doe' })
   
   console.log(user.body()) // will show you the data 
   console.log(user.clean()) // will remove null/empty data from the object
   etc...
```

###### Default methods in the model
- `{model}.body()` allowing you to access the data (if your model has a`.data`object)
- `{model}.clean()` remove all the null and empty values from your data
- `{model}.validate()` returns the Joi validation of your model
- `{model}.valid()` returns a boolean if your object data is Joi validated or not

###### Default methods in the model (be careful : a DBMS driver is required, for example blockbase-postgresql)
- `await {model}.create()` returns a new saved object in your database
- `await {model}.read()` returns an object from your database (search by id)
- `await {model}.update()` returns an updated object from your database
- `await {model}.delete()` returns a boolean on deletion of your object (by id)

#### Run tests
Blockbase has some unit tests (with [Mocha](https://mochajs.org)) written run them often !

```sh
$ npm test
```

License
----
(Licence [MIT](https://github.com/blacksmithstudio/blockbase/blob/master/LICENCE))
Coded by [Blacksmith](https://www.blacksmith.studio)

**Free Software, Hell Yeah!**

[Node.js]:https://nodejs.org/en
[NPM]:https://www.npmjs.com
