'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.middleware = middleware;


function runCommand(runEffect, runCommit, runGetState, command) {
  return Promise.resolve(function () {
    switch (command.type) {
      case 'Effect':
        return runEffect(command.effect);
      case 'Commit':
        return runCommit(command.commit);
      case 'GetState':
        return command.selector(runGetState());
      default:
        return command;
    }
  }());
}


function runWithAnswer(runEffect, runCommit, runGetState, ship, answer) {
  var result = ship.next(answer);
  if (result.done) {
    return Promise.resolve(result.value);
  }
  switch (result.value.type) {
    case 'Command':
      return runCommand(runEffect, runCommit, runGetState, result.value.command).then(function (newAnswer) {
        return runWithAnswer(runEffect, runCommit, runGetState, ship, newAnswer);
      });
    case 'All':
      return Promise.all(result.value.ships.map(function (currentShip) {
        return runWithAnswer(runEffect, runCommit, runGetState, currentShip);
      })).then(function (newAnswer) {
        return runWithAnswer(runEffect, runCommit, runGetState, ship, newAnswer);
      });
    default:
      return result.value;
  }
}

function run(runEffect, store, ship) {
  return runWithAnswer(runEffect, store.dispatch, store.getState, ship);
}

function middleware(runEffect, control) {
  return function (store) {
    return function (next) {
      return function (action) {
        var storeWithNext = {
          dispatch: next,
          getState: store.getState
        };
        run(runEffect, storeWithNext, control(action));
        return next(action);
      };
    };
  };
}