export class DoublyLinkedListNode {
  constructor(value, next = null, previous = null) {
    this.value = value;
    this.next = next;
    this.previous = previous;
  }
}

export class DoublyLinkedList {
  constructor() {
      this.head = null;
      this.tail = null;
  }
}