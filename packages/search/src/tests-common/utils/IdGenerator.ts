export class IdGenerator {
  private static lastId = 0;
  static next() {
    return ++this.lastId;
  }
}
