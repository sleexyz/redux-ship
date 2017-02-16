'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = map;

var _ship = require('./ship');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _marked = [mapCommand, mapWithAnswer].map(regeneratorRuntime.mark);

function mapCommand(liftEffect, liftCommit, extractState, command) {
  var selector;
  return regeneratorRuntime.wrap(function mapCommand$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = command.type;
          _context.next = _context.t0 === 'Effect' ? 3 : _context.t0 === 'Commit' ? 5 : _context.t0 === 'GetState' ? 7 : 10;
          break;

        case 3:
          return _context.delegateYield(liftEffect(command.effect), 't1', 4);

        case 4:
          return _context.abrupt('return', _context.t1);

        case 5:
          return _context.delegateYield((0, _ship.commit)(liftCommit(command.commit)), 't2', 6);

        case 6:
          return _context.abrupt('return', _context.t2);

        case 7:
          selector = command.selector;
          return _context.delegateYield((0, _ship.getState)(function (state) {
            return selector(extractState(state));
          }), 't3', 9);

        case 9:
          return _context.abrupt('return', _context.t3);

        case 10:
          return _context.abrupt('return', command);

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function mapWithAnswer(liftEffect, liftCommit, extractState, ship, answer) {
  var result, newAnswer, _newAnswer;

  return regeneratorRuntime.wrap(function mapWithAnswer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          result = ship.next(answer);

          if (!result.done) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt('return', result.value);

        case 3:
          _context2.t0 = result.value.type;
          _context2.next = _context2.t0 === 'Command' ? 6 : _context2.t0 === 'All' ? 10 : 14;
          break;

        case 6:
          return _context2.delegateYield(mapCommand(liftEffect, liftCommit, extractState, result.value.command), 't1', 7);

        case 7:
          newAnswer = _context2.t1;
          return _context2.delegateYield(mapWithAnswer(liftEffect, liftCommit, extractState, ship, newAnswer), 't2', 9);

        case 9:
          return _context2.abrupt('return', _context2.t2);

        case 10:
          return _context2.delegateYield(_ship.allAny.apply(undefined, _toConsumableArray(result.value.ships.map(function (currentShip) {
            return mapWithAnswer(liftEffect, liftCommit, extractState, currentShip);
          }))), 't3', 11);

        case 11:
          _newAnswer = _context2.t3;
          return _context2.delegateYield(mapWithAnswer(liftEffect, liftCommit, extractState, ship, _newAnswer), 't4', 13);

        case 13:
          return _context2.abrupt('return', _context2.t4);

        case 14:
          return _context2.abrupt('return', result.value);

        case 15:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

function map(liftCommit, extractState, ship) {
  return mapWithAnswer(function (effect) {
    return (0, _ship.call)(effect);
  }, liftCommit, extractState, ship);
}