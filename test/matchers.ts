import { validateSync } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Type as Contructor } from '@nestjs/common';
import { toClass } from '../src/common';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeSorted(direction: 'desc' | 'asc'): CustomMatcherResult;
      toEqualTypes(expected: T): CustomMatcherResult;
      toBeValid(ref?: any): CustomMatcherResult;
      toBeDateAfter(after: Date | string | number): CustomMatcherResult;
      toBeDateBefore(after: Date | string | number): CustomMatcherResult;
    }
  }
}

expect.extend({
  toBeSorted(expected: 'desc' | 'asc', actual: [any[], (a: any) => any]) {
    const dir = expected === 'asc' ? 1 : -1;

    const [arr, getter] = actual;

    const sorted = [...arr].sort((a, b) =>
      getter(a) > getter(b) ? dir : -dir,
    );

    return {
      pass: this.equals(arr, sorted),
      message: () =>
        `is not sorted ${expected}\n` + this.utils.diff(sorted, expected),
    };
  },

  toEqualTypes(expected: any, actual: any) {
    const deepTypeof = (val: any): any => {
      if (typeof val !== 'object' || val === null) {
        return val === null ? 'null' : typeof val;
      }

      return Object.keys(val)
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: deepTypeof(val[key]) }), {});
    };

    const typesExpected = deepTypeof(expected);
    const typesActual = deepTypeof(actual);

    return {
      pass: this.equals(typesExpected, typesActual),
      message: () =>
        `types are not equal\n` + this.utils.diff(typesExpected, typesActual),
    };
  },

  toBeValid(expected: any, actual: any) {
    const errs = actual
      ? validateSync(toClass(actual, expected))
      : validateSync(expected);

    return {
      pass: errs.length === 0,
      message: () =>
        `validation errors\n\n` +
        errs
          .map((err) => [err.toString(), `value: ` + err.value].join(''))
          .join('\n\n'),
    };
  },

  toBeDateAfter(
    expected: Date | string | number,
    after: Date | string | number,
  ) {
    const expectedDate = new Date(expected);
    const afterDate = new Date(after);

    return {
      pass: expectedDate > afterDate,
      message: () =>
        `date ${expectedDate.toISOString()} is not after ${afterDate.toISOString()} by ${
          afterDate.getTime() - expectedDate.getTime()
        } ms\n`,
    };
  },

  toBeDateBefore(
    expected: Date | string | number,
    before: Date | string | number,
  ) {
    const expectedDate = new Date(expected);
    const beforeDate = new Date(before);

    return {
      pass: expectedDate < beforeDate,
      message: () =>
        `date ${expectedDate.toISOString()} is not before ${beforeDate.toISOString()} by ${
          expectedDate.getTime() - beforeDate.getTime()
        } ms\n`,
    };
  },
});
