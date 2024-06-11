import { readFileSync, createWriteStream } from "node:fs";
import { DoublyLinkedList, DoublyLinkedListNode } from "./doublyLinkedList.js";

// Читаем и преобразуем исходные данные
const data = readFileSync("algos2hw.csv", "utf-8");
const array = data.split("\r\n").map((row) => row.split(","));

// Создаем двунаправленный список
const list = new DoublyLinkedList();

// Проходимся по значениям из исходного файла
array.forEach((row, index) => {
  // пропускаем заглавную и пустые строки
  if (index === 0 || row[0] === "") {
    return;
  }
  const [destination, flight, date] = [row[0], row[1], new Date(row[3])];
  // создаем первую ноду при пустом списке
  if (!list.head) {
    const node = new DoublyLinkedListNode({
      destination,
      flight,
      date,
      passengers: 1,
    });
    list.head = node;
    list.tail = node;
    return;
  }
  // основная логика
  if (date < list.head.value.date || (date.getDate() === list.head.value.date.getDate() && flight < list.head.value.flight)) {
    // case 1: insert start
    const node = new DoublyLinkedListNode({
      destination,
      flight,
      date,
      passengers: 1,
    }, list.head);
    list.head.previous = node;
    list.head = node;
  } else if (date > list.tail.value.date || (date.getDate() === list.tail.value.date.getDate() && flight > list.tail.value.flight)) {
    // case 2: insert end
    const node = new DoublyLinkedListNode({
      destination,
      flight,
      date,
      passengers: 1,
    }, null, list.tail);
    list.tail.next = node;
    list.tail = node;
  } else {
    // начинаем обход значений если граничные не подходят
    let current = list.head;
    while (date > current.value.date || (date.getDate() === current.value.date.getDate() && flight > current.value.flight)) {
      // доходим до первого значения в отсортированном связном списке, которое не подходит
      current = current.next;
    }
    if (date.getDate() === current.value.date.getDate() && flight === current.value.flight) {
      // case 3: flight exists
      current.value.passengers += 1;
    } else {
      // case 4: insert middle (между current.previous и current)
      const node = new DoublyLinkedListNode({
        destination,
        flight,
        date,
        passengers: 1,
      }, current, current.previous);
      current.previous.next = node;
      current.previous = node;
    }
  }
});

// вывод данных
let current = list.tail;
// clear the results file if exists
const writeStream = createWriteStream('result.csv');
const csvRows = [];
// вставляем названия строк
csvRows.push(`${['Destination', 'FlightNumber', 'Date', 'Passengers'].join(',')}`);
while (current) {
  csvRows.push(`${[current.value.destination, current.value.flight, current.value.date, current.value.passengers].join(',')}`);
  console.log(current.value);
  current = current.previous;
}
// записываем строки в файл
csvRows.forEach((row) => writeStream.write(`${row}\n`));
