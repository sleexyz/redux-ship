'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snap = undefined;

var _ship = require('./ship');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _marked = [snapCommand, snapWithAnswer].map(regeneratorRuntime.mark);

function snapCommand(command) {
  var result;
  return regeneratorRuntime.wrap(function snapCommand$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return {
            type: 'Command',
            command: command
          };

        case 2:
          result = _context.sent;
          _context.t0 = command.type;
          _context.next = _context.t0 === 'Effect' ? 6 : _context.t0 === 'Commit' ? 7 : _context.t0 === 'GetState' ? 8 : 9;
          break;

        case 6:
          return _context.abrupt('return', {
            result: result,
            snapshotItem: result === undefined ? {
              type: 'Effect',
              effect: command.effect
            } : {
              type: 'Effect',
              effect: command.effect,
              result: result
            }
          });

        case 7:
          return _context.abrupt('return', {
            result: undefined,
            snapshotItem: {
              type: 'Commit',
              commit: command.commit
            }
          });

        case 8:
          return _context.abrupt('return', {
            result: result,
            snapshotItem: {
              type: 'GetState',
              state: result
            }
          });

        case 9:
          return _context.abrupt('return', command);

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function snapWithAnswer(ship, answer) {
  var result, newAnswer, next, _newAnswer, _next;

  return regeneratorRuntime.wrap(function snapWithAnswer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          result = ship.next(answer);

          if (!result.done) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt('return', {
            result: result.value,
            snapshot: []
          });

        case 3:
          _context2.t0 = result.value.type;
          _context2.next = _context2.t0 === 'Command' ? 6 : _context2.t0 === 'All' ? 11 : 16;
          break;

        case 6:
          return _context2.delegateYield(snapCommand(result.value.command), 't1', 7);

        case 7:
          newAnswer = _context2.t1;
          return _context2.delegateYield(snapWithAnswer(ship, newAnswer.result), 't2', 9);

        case 9:
          next = _context2.t2;
          return _context2.abrupt('return', {
            result: next.result,
            snapshot: [newAnswer.snapshotItem].concat(_toConsumableArray(next.snapshot))
          });

        case 11:
          return _context2.delegateYield(_ship.allAny.apply(undefined, _toConsumableArray(result.value.ships.map(function (currentShip) {
            return snapWithAnswer(currentShip);
          }))), 't3', 12);

        case 12:
          _newAnswer = _context2.t3;
          return _context2.delegateYield(snapWithAnswer(ship, _newAnswer.map(function (currentAnswer) {
            return currentAnswer.result;
          })), 't4', 14);

        case 14:
          _next = _context2.t4;
          return _context2.abrupt('return', {
            result: _next.result,
            snapshot: [{
              type: 'All',
              snapshots: _newAnswer.map(function (currentAnswer) {
                return currentAnswer.snapshot;
              })
            }].concat(_toConsumableArray(_next.snapshot))
          });

        case 16:
          return _context2.abrupt('return', result.value);

        case 17:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

/* eslint-disable no-undef */
var snap = exports.snap = snapWithAnswer;
/* eslint-enable no-undef */