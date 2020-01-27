import { GetSelectionImplementation, SelectionStrategy } from '../src/selection-strategies'

const item1 = {
  width: 10,
  height: 20
}

const rectangles = [
  {
    width: 100,
    height: 20,
    x: 0,
    y: 0,
    bin: 0,
    id: '1'
  },
  {
    width: 30,
    height: 30,
    x: 0,
    y: 0,
    bin: 0,
    id: '2'
  },
  {
    width: 10,
    height: 200,
    x: 0,
    y: 0,
    bin: 0,
    id: '3'
  }
]

test('best area fit', () => {
  const sorter = GetSelectionImplementation(SelectionStrategy.BEST_AREA_FIT)
  const selected = sorter.select(rectangles, item1)

  expect(selected).toMatchInlineSnapshot(`
Object {
  "bin": 0,
  "height": 30,
  "id": "2",
  "width": 30,
  "x": 0,
  "y": 0,
}
`)
})

test('best long side fit', () => {
  const sorter = GetSelectionImplementation(SelectionStrategy.BEST_LONG_SIDE_FIT)
  const selected = sorter.select(rectangles, item1)

  expect(selected).toMatchInlineSnapshot(`
Object {
  "bin": 0,
  "height": 30,
  "id": "2",
  "width": 30,
  "x": 0,
  "y": 0,
}
`)
})

test('best short side fit', () => {
  const rectangles = [
    {
      width: 100,
      height: 25,
      x: 0,
      y: 0,
      bin: 0,
      id: '1'
    },
    {
      width: 30,
      height: 30,
      x: 0,
      y: 0,
      bin: 0,
      id: '2'
    },
    {
      width: 10,
      height: 200,
      x: 0,
      y: 0,
      bin: 0,
      id: '3'
    }
  ]
  const sorter = GetSelectionImplementation(SelectionStrategy.BEST_SHORT_SIDE_FIT)
  const selected = sorter.select(rectangles, item1)

  expect(selected).toMatchInlineSnapshot(`
Object {
  "bin": 0,
  "height": 200,
  "id": "3",
  "width": 10,
  "x": 0,
  "y": 0,
}
`)
})
