# minecraft-bot [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Declarative bot for minecraft

## Docker

```sh
$ docker build -t matthewfranglen/minecraft-bot .
$ docker run -it --rm --name minecraft-bot matthewfranglen/minecraft-bot
```

## Installation

```sh
$ npm install --save minecraft-bot
```

## Usage

```js
var minecraftBot = require('minecraft-bot');

minecraftBot('Rainbow');
```

## License

 © [Matthew Franglen]()


[npm-image]: https://badge.fury.io/js/minecraft-bot.svg
[npm-url]: https://npmjs.org/package/minecraft-bot
[travis-image]: https://travis-ci.org/matthewfranglen/minecraft-bot.svg?branch=master
[travis-url]: https://travis-ci.org/matthewfranglen/minecraft-bot
[daviddm-image]: https://david-dm.org/matthewfranglen/minecraft-bot.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/matthewfranglen/minecraft-bot
[coveralls-image]: https://coveralls.io/repos/matthewfranglen/minecraft-bot/badge.svg
[coveralls-url]: https://coveralls.io/r/matthewfranglen/minecraft-bot
