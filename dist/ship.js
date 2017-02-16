'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.call = call;
exports.commit = commit;
exports.getState = getState;
exports.allAny = allAny;
exports.all = all;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _marked = [call, commit, getState, allAny].map(regeneratorRuntime.mark);

function call(effect) {
  return regeneratorRuntime.wrap(function call$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return {
            type: 'Command',
            command: {
              type: 'Effect',
              effect: effect
            }
          };

        case 2:
          return _context.abrupt('return', _context.sent);

        case 3:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function commit(commit) {
  return regeneratorRuntime.wrap(function commit$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return {
            type: 'Command',
            command: {
              type: 'Commit',
              commit: commit
            }
          };

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

function getState(selector) {
  return regeneratorRuntime.wrap(function getState$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return {
            type: 'Command',
            command: {
              type: 'GetState',
              selector: selector
            }
          };

        case 2:
          return _context3.abrupt('return', _context3.sent);

        case 3:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked[2], this);
}

function allAny() {
  for (var _len = arguments.length, ships = Array(_len), _key = 0; _key < _len; _key++) {
    ships[_key] = arguments[_key];
  }

  return regeneratorRuntime.wrap(function allAny$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return {
            type: 'All',
            ships: ships
          };

        case 2:
          return _context4.abrupt('return', _context4.sent);

        case 3:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked[3], this);
}

function all(ships) {
  return allAny.apply(undefined, _toConsumableArray(ships));
}

/* eslint-disable no-undef */
var all2 = exports.all2 = allAny;

var all3 = exports.all3 = allAny;

var all4 = exports.all4 = allAny;

var all5 = exports.all5 = allAny;

var all6 = exports.all6 = allAny;

var all7 = exports.all7 = allAny;
/* eslint-enable no-undef */