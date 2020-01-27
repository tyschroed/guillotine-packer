import { GetSortImplementation, SortDirection, SortStrategy } from '../src/sort-strategies'

const testItems = [
  {
    width: 40,
    height: 20
  },
  {
    width: 41,
    height: 10
  },
  {
    width: 30,
    height: 10
  },
  {
    width: 10,
    height: 11
  },
  {
    width: 15,
    height: 9
  },
  {
    width: 15,
    height: 8
  },
  {
    width: 14,
    height: 10
  },
  {
    width: 15,
    height: 10
  }
]

test('area sort', () => {
  const sorter = GetSortImplementation(SortStrategy.Area, SortDirection.ASC)
  const [item1] = sorter.sort(testItems)

  expect(item1).toMatchInlineSnapshot(`
Object {
  "height": 11,
  "width": 10,
}
`)
})
test('area sort DESC', () => {
  const sorter = GetSortImplementation(SortStrategy.Area, SortDirection.DESC)
  const [item1] = sorter.sort(testItems)

  expect(item1).toMatchInlineSnapshot(`
Object {
  "height": 20,
  "width": 40,
}
`)
})

test('differences sort', () => {
  const sorter = GetSortImplementation(SortStrategy.Differences, SortDirection.ASC)
  const items = sorter.sort(testItems)

  expect(items).toMatchInlineSnapshot(`
Array [
  Object {
    "height": 11,
    "width": 10,
  },
  Object {
    "height": 10,
    "width": 14,
  },
  Object {
    "height": 10,
    "width": 15,
  },
  Object {
    "height": 9,
    "width": 15,
  },
  Object {
    "height": 8,
    "width": 15,
  },
  Object {
    "height": 20,
    "width": 40,
  },
  Object {
    "height": 10,
    "width": 30,
  },
  Object {
    "height": 10,
    "width": 41,
  },
]
`)
})

test('long side sort', () => {
  const sorter = GetSortImplementation(SortStrategy.LongSide, SortDirection.ASC)
  const items = sorter.sort(testItems)

  expect(items).toMatchInlineSnapshot(`
Array [
  Object {
    "height": 11,
    "width": 10,
  },
  Object {
    "height": 10,
    "width": 14,
  },
  Object {
    "height": 8,
    "width": 15,
  },
  Object {
    "height": 9,
    "width": 15,
  },
  Object {
    "height": 10,
    "width": 15,
  },
  Object {
    "height": 10,
    "width": 30,
  },
  Object {
    "height": 20,
    "width": 40,
  },
  Object {
    "height": 10,
    "width": 41,
  },
]
`)
})

test('short side sort', () => {
  const sorter = GetSortImplementation(SortStrategy.ShortSide, SortDirection.ASC)
  const items = sorter.sort(testItems)

  expect(items).toMatchInlineSnapshot(`
Array [
  Object {
    "height": 8,
    "width": 15,
  },
  Object {
    "height": 9,
    "width": 15,
  },
  Object {
    "height": 11,
    "width": 10,
  },
  Object {
    "height": 10,
    "width": 14,
  },
  Object {
    "height": 10,
    "width": 15,
  },
  Object {
    "height": 10,
    "width": 30,
  },
  Object {
    "height": 10,
    "width": 41,
  },
  Object {
    "height": 20,
    "width": 40,
  },
]
`)
})

test('ratio sort', () => {
  const sorter = GetSortImplementation(SortStrategy.Ratio, SortDirection.ASC)
  const items = sorter.sort(testItems)

  expect(items).toMatchInlineSnapshot(`
Array [
  Object {
    "height": 11,
    "width": 10,
  },
  Object {
    "height": 10,
    "width": 14,
  },
  Object {
    "height": 10,
    "width": 15,
  },
  Object {
    "height": 9,
    "width": 15,
  },
  Object {
    "height": 8,
    "width": 15,
  },
  Object {
    "height": 20,
    "width": 40,
  },
  Object {
    "height": 10,
    "width": 30,
  },
  Object {
    "height": 10,
    "width": 41,
  },
]
`)
})

test('perimeter sort', () => {
  const sorter = GetSortImplementation(SortStrategy.Perimeter, SortDirection.ASC)
  const items = sorter.sort(testItems)

  expect(items).toMatchInlineSnapshot(`
Array [
  Object {
    "height": 11,
    "width": 10,
  },
  Object {
    "height": 8,
    "width": 15,
  },
  Object {
    "height": 9,
    "width": 15,
  },
  Object {
    "height": 10,
    "width": 14,
  },
  Object {
    "height": 10,
    "width": 15,
  },
  Object {
    "height": 10,
    "width": 30,
  },
  Object {
    "height": 10,
    "width": 41,
  },
  Object {
    "height": 20,
    "width": 40,
  },
]
`)
})
