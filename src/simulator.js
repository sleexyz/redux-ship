// @flow
import _isEqual from 'lodash.isequal';
import * as Ship from './ship';

export type Effect = {
  type: 'Wait',
  args: any[],
  result: any
} | {
  type: 'Call',
  args: any[],
  result: any
} | {
  type: 'Impure',
  args: any[],
  result: any
} | {
  type: 'All',
  simulators: Generator<Effect, void, void>[]
};

export type t = Generator<Effect, void, void>;

function checkArgs(args1: any[], args2: any[]): void {
  if (!_isEqual(args1, args2)) {
    console.log('checkArgs', args1, args2);
    throw new Error(JSON.stringify({
      message: 'Arguments mismatch',
      args1,
      args2,
    }));
  }
}

export function run<A>(ship: Ship.t<A>, simulator: t, answer?: any): A {
  const resultShip = ship.next(answer);
  const resultSimulator = simulator.next();
  if (resultShip.done) {
    if (resultSimulator.done) {
      return (resultShip.value: any);
    }
    throw new Error('Simulator not terminated but ship terminated');
  }
  if (resultSimulator.done) {
    throw new Error('Ship not terminated but simulator terminated');
  }
  const newAnswer = (() => {
    switch (resultShip.value.type) {
      case 'Wait':
        if (resultSimulator.value.type === 'Wait') {
          const { result } = resultSimulator.value;
          checkArgs(resultSimulator.value.args, resultShip.value.args);
          return result;
        }
        throw new Error(`Expected ${resultSimulator.value.type} but got Wait`);
      case 'Call':
        if (resultSimulator.value.type === 'Call') {
          const { result } = resultSimulator.value;
          checkArgs(resultSimulator.value.args, resultShip.value.args);
          return result;
        }
        throw new Error(`Expected ${resultSimulator.value.type} but got Call`);
      case 'Impure':
        if (resultSimulator.value.type === 'Impure') {
          const { result } = resultSimulator.value;
          checkArgs(resultSimulator.value.args, resultShip.value.args);
          return result;
        }
        throw new Error(`Expected ${resultSimulator.value.type} but got Impure`);
      case 'All': {
        const { ships } = resultShip.value;
        if (resultSimulator.value.type === 'All') {
          const { simulators } = resultSimulator.value;
          return simulators.map((currentSimulator, index) =>
            run(ships[index], currentSimulator)
          );
        }
        throw new Error(`Expected ${resultSimulator.value.type} but got All`);
      }
      default:
        return resultShip.value;
    }
  })();
  return run(ship, simulator, newAnswer);
}

export function* wait<A>(args: any[], result: A): t {
  return yield {
    type: 'Wait',
    args,
    result,
  };
}

export function* call<A>(args: any[], result: A): t {
  return yield {
    type: 'Call',
    args,
    result,
  };
}

export function* impure<A>(args: any[], result: A): t {
  return yield {
    type: 'Impure',
    args,
    result,
  };
}

export function* all(simulators: t[]): t {
  return yield {
    type: 'All',
    simulators,
  };
}
