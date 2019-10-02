import EventEmitter from "events";


// why doesnt ja:b:ascript have weakrefs, at least this should be enough for my use case uwu

export default class Ref<T> extends EventEmitter {
  constructor(val: T = null) {
    super();
    console.log("Constructing");
    this.val = val;
  }

  get(): T {
    return this.val;
  }

  set(v: T) {
    this.val = v;
    this.emit('change', v);
  }

  exists(): boolean {
    return this.val !== null && this.val !== undefined;
  }
}
