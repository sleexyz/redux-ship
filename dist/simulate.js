'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simulate = simulate;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function snapshotItemError(error) {
  return { error: error };
}

function simulateCommand(command, snapshotItem) {
  switch (command.type) {
    case 'Effect':
      if (snapshotItem.type === 'Effect') {
        return {
          result: { value: snapshotItem.result },
          snapshotItem: snapshotItem.result ? {
            type: 'Effect',
            effect: command.effect,
            result: snapshotItem.result
          } : {
            type: 'Effect',
            effect: command.effect
          }
        };
      }
      break;
    case 'Commit':
      if (snapshotItem.type === 'Commit') {
        return {
          result: { value: undefined },
          snapshotItem: {
            type: 'Commit',
            commit: command.commit
          }
        };
      }
      break;
    case 'GetState':
      if (snapshotItem.type === 'GetState') {
        return {
          result: { value: snapshotItem.state },
          snapshotItem: snapshotItem
        };
      }
      break;
    default:
      return command;
  }
  return {
    result: null,
    snapshotItem: snapshotItemError({
      expected: snapshotItem.type,
      got: command
    })
  };
}

function simulateWithAnswer(ship, snapshot, answer) {
  var result = ship.next(answer);
  if (result.done) {
    return {
      result: { value: result.value },
      snapshot: []
    };
  }

  var _snapshot = _toArray(snapshot),
      snapshotItem = _snapshot[0],
      nextSnapshot = _snapshot.slice(1);

  if (snapshotItem === undefined) {
    return {
      result: null,
      snapshot: [snapshotItemError({
        expected: 'terminated',
        got: result.value
      })]
    };
  }
  switch (result.value.type) {
    case 'Command':
      {
        var newAnswer = simulateCommand(result.value.command, snapshotItem);
        if (newAnswer.result) {
          var next = simulateWithAnswer(ship, nextSnapshot, newAnswer.result.value);
          return {
            result: next.result,
            snapshot: [newAnswer.snapshotItem].concat(_toConsumableArray(next.snapshot))
          };
        }
        return {
          result: null,
          snapshot: [newAnswer.snapshotItem]
        };
      }
    case 'All':
      {
        if (snapshotItem.type === 'All') {
          var newAnswers = result.value.ships.reduce(function (accumulator, currentShip, shipIndex) {
            var currentSnapshot = snapshotItem.snapshots[shipIndex];
            if (currentSnapshot) {
              var currentAnswer = simulateWithAnswer(currentShip, currentSnapshot);
              if (currentAnswer.result) {
                return {
                  results: accumulator.results && [].concat(_toConsumableArray(accumulator.results), [currentAnswer.result.value]),
                  snapshots: [].concat(_toConsumableArray(accumulator.snapshots), [currentAnswer.snapshot])
                };
              }
              return {
                results: null,
                snapshots: [].concat(_toConsumableArray(accumulator.snapshots), [currentAnswer.snapshot])
              };
            }
            return {
              results: null,
              snapshots: accumulator.snapshots
            };
          }, {
            results: [],
            snapshots: []
          });
          if (newAnswers.results) {
            var _next = simulateWithAnswer(ship, nextSnapshot, newAnswers.results);
            return {
              result: _next.result,
              snapshot: [{
                type: 'All',
                snapshots: newAnswers.snapshots
              }].concat(_toConsumableArray(_next.snapshot))
            };
          }
          return {
            result: null,
            snapshot: [{
              type: 'All',
              snapshots: newAnswers.snapshots
            }]
          };
        }
        return {
          result: null,
          snapshot: [snapshotItemError({
            expected: snapshotItem.type,
            got: result.value
          })]
        };
      }
    default:
      return result.value;
  }
}

function simulate(ship, snapshot) {
  return simulateWithAnswer(ship, snapshot).snapshot;
}