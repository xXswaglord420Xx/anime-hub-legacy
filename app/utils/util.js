
export function* range(start, max = Number.MAX_SAFE_INTEGER, step = 1) {
  let val = start;
  while(val < max) {
    yield val;
    val += step;
  }
}
