export class Cache<K extends object, V> {
  private _isEmpty = true;
  private readonly map = new WeakMap<K, V>();

  constructor(private includeUndefinedValues: boolean = true) {}

  isEmpty() {
    return this._isEmpty;
  }

  getOrCreate(key: K, ctr: (key: K) => V) {
    return this.map.get(key) ?? this.create(key, ctr);
  }

  get(key: K) {
    return this.map.get(key);
  }

  set(key: K, value: V) {
    this.map.set(key, value);
  }

  private create(key: K, ctr: (key: K) => V) {
    const value = ctr(key);
    if (value !== undefined || this.includeUndefinedValues) {
      this.map.set(key, value);
      this._isEmpty = false;
    }
    return value;
  }
}
