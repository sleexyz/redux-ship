'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require('../index');

var Ship = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _marked = [eyeControl, control].map(regeneratorRuntime.mark);

function createStore(reduce, initialState) {
  var state = initialState;
  return {
    dispatch: function dispatch(commit) {
      state = reduce(state, commit);
    },
    getState: function getState() {
      return state;
    }
  };
}

function httpRequest(url) {
  return Ship.call({
    type: 'HttpRequest',
    url: url
  });
}

function runEffect(effect) {
  switch (effect.type) {
    case 'HttpRequest':
      return JSON.stringify({
        eye_color: 'red',
        name: 'R2-D2'
      });
    default:
      return;
  }
}

var initialEyeState = {
  color: null,
  isLoading: false
};

function eyeReduce(state, commit) {
  switch (commit.type) {
    case 'LoadStart':
      return _extends({}, state, {
        isLoading: true
      });
    case 'LoadSuccess':
      return _extends({}, state, {
        color: commit.color,
        isLoading: false
      });
    default:
      return state;
  }
}

function eyeControl() {
  var currentEyeColor, _ref, _ref2, r2d2, eyeColor;

  return regeneratorRuntime.wrap(function eyeControl$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.delegateYield(Ship.getState(function (state) {
            return state.color;
          }), 't0', 1);

        case 1:
          currentEyeColor = _context.t0;

          if (currentEyeColor) {
            _context.next = 10;
            break;
          }

          return _context.delegateYield(Ship.commit({ type: 'LoadStart' }), 't1', 4);

        case 4:
          return _context.delegateYield(Ship.all2(httpRequest('http://swapi.co/api/people/3/'), httpRequest('http://swapi.co/api/people/4/')), 't2', 5);

        case 5:
          _ref = _context.t2;
          _ref2 = _slicedToArray(_ref, 1);
          r2d2 = _ref2[0];
          eyeColor = JSON.parse(r2d2).eye_color;
          return _context.delegateYield(Ship.commit({ type: 'LoadSuccess', color: eyeColor }), 't3', 10);

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

var initialState = {
  eye: initialEyeState
};

function reduce(state, commit) {
  switch (commit.type) {
    case 'Eye':
      return _extends({}, state, {
        eye: eyeReduce(state.eye, commit.commit)
      });
    default:
      return state;
  }
}

function control() {
  return regeneratorRuntime.wrap(function control$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.delegateYield(Ship.map(function (commit) {
            return { type: 'Eye', commit: commit };
          }, function (state) {
            return state.eye;
          }, eyeControl()), 't0', 1);

        case 1:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

describe('map', function () {
  test('without eye', function () {
    var effectSnapshot = function effectSnapshot(id, name, eyeColor) {
      return {
        type: 'Effect',
        effect: {
          type: 'HttpRequest',
          url: 'http://swapi.co/api/people/' + id + '/'
        },
        result: JSON.stringify({
          eye_color: eyeColor,
          name: name
        })
      };
    };
    var snapshot = [{ type: 'GetState' }, { type: 'Commit', commit: { type: 'Eye', commit: { type: 'LoadStart' } } }, {
      type: 'All',
      snapshots: [[effectSnapshot('3', 'R2-D2', 'red')], [effectSnapshot('4', 'Darth Vader', 'yellow')]]
    }, { type: 'Commit', commit: { type: 'Eye', commit: { type: 'LoadSuccess', color: 'red' } } }];
    expect(Ship.simulate(control(), snapshot)).toEqual(snapshot);
  });
  test('with eye', function () {
    var snapshot = [{ type: 'GetState', state: 'red' }];
    expect(Ship.simulate(control(), snapshot)).toEqual(snapshot);
  });
});

describe('run', function () {
  test('without eye', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var store;
    return regeneratorRuntime.wrap(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            store = createStore(eyeReduce, initialEyeState);
            _context3.next = 3;
            return Ship.run(runEffect, store, eyeControl());

          case 3:
            expect(store.getState()).toMatchSnapshot();

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee, undefined);
  })));

  test('twice', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var store;
    return regeneratorRuntime.wrap(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            store = createStore(eyeReduce, initialEyeState);
            _context4.next = 3;
            return Ship.run(runEffect, store, eyeControl());

          case 3:
            _context4.next = 5;
            return Ship.run(runEffect, store, eyeControl());

          case 5:
            expect(store.getState()).toMatchSnapshot();

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee2, undefined);
  })));
});

function testSimulateAndSnap(name, store, control) {
  var _this = this;

  test(name, _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    var _ref6, snapshot;

    return regeneratorRuntime.wrap(function _callee3$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Ship.run(runEffect, store, Ship.snap(control()));

          case 2:
            _ref6 = _context5.sent;
            snapshot = _ref6.snapshot;

            expect(snapshot).toMatchSnapshot();
            expect(Ship.simulate(control(), snapshot)).toEqual(snapshot);

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee3, _this);
  })));
}

describe('simulate and snap', function () {
  testSimulateAndSnap('without eye', createStore(eyeReduce, initialEyeState), eyeControl);

  testSimulateAndSnap('with eye', createStore(eyeReduce, _extends({}, initialEyeState, { color: 'red' })), eyeControl);

  testSimulateAndSnap('with map', createStore(reduce, initialState), control);
});