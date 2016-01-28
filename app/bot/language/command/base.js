exports.SimpleCommandFactory = function (statement, constructor) {
  var singleton = new constructor();

  return function (username, command) {
    console.log("Testing " + username + " and " + command + " against " + statement);
    console.log(singleton);
    if (command === statement) {
      return singleton;
    }
  };
};

exports.AbstractCommand = function () {};

exports.AbstractCommand.prototype.invoke = function (bot) {
  return Promise.reject("This command is unimplemented");
};

exports.AbstractCommand.prototype.isImmediate = function () {
  return false;
};

exports.AbstractCommand.prototype.shouldAddToHistory = function () {
  return true;
};
