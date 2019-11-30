
export function* range(start, max = Number.MAX_SAFE_INTEGER, step = 1) {
  let val = start;
  while(val < max) {
    yield val;
    val += step;
  }
}

// WebStorm "forgets" the members of an object shallow cloned with {...obj}, this is a workaround for coding assistance with PDOs
export function clone<T>(arg: T): T {
  return Array.isArray(arg)? [...arg] : {...arg};
}

export function stealWhile<T>(arr: T[], p: T => boolean) {
  const rv: T[] = [];

  while (arr.length > 0 && p(arr[0])) {
    rv.push(arr.shift());
  }

  return rv;
}

export function takeWhile<T>(arr: T[], p: T => boolean): T {
  return stealWhile(clone(arr), p)
}

export function dropWhile<T>(arr: T[], p: T => boolean) {
  const rv = clone(arr);
  while (rv.length > 0 && p(rv[0])) {
    rv.shift();
  }

  return rv;
}

export function halve(str: string, delimiter: string): [string, string] {
  const index = str.indexOf(delimiter);
  if (index < 0) {
    return [str, ""];
  } else {
    return [str.substring(0, index), str.substring(index + 1)]
  }
}

export function zipWith<T, U, V>(a: T[], b: U[], f: (T, U) => V): V[] {
  return a.map((x, i) => f(x, b[i]));
}

export function groupBy<T>(a: T[], p: (T, T) => boolean): T[][] {
  if (a.length === 0) {
    return [];
  }

  const arr = [...a];
  const firstElem = arr.shift();

  return arr.reduce((acc, x) => {
    const lastGroup = acc[acc.length - 1];
    const lastElem = lastGroup[lastGroup.length - 1];
    if (p(x, lastElem)) {
      lastGroup.push(x);
    } else {
      acc.push([x]);
    }
    return acc;
  }, [[firstElem]])
}

export const debounce = ms => f => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => f(...args), ms);
  }
};
