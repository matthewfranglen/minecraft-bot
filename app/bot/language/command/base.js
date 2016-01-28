var SimpleCommandFactory = function (statement, constructor) {
  var singleton = constructor();

  return function (command) {
    if (command === statement) {
      return singleton;
    }
  };
};

var AbstractCommand = function () {};

AbstractCommand.prototype.invoke = function (bot) {
  return Promise.reject("This command is unimplemented");
};

AbstractCommand.prototype.isImmediate = function () {
  return false;
};

AbstractCommand.prototype.shouldAddToHistory = function () {
  return true;
};
