import { GetSplitImplementation, SplitStrategy } from '../src/split-strategies'

const rect = {
  width: 100,
  height: 50,
  x: 0,
  y: 0,
  bin: 0,
  id: '1'
}

const item = {
  width: 50,
  height: 50
}

test('long axis split', () => {
  const sorter = GetSplitImplementation(SplitStrategy.LongAxisSplit, 0)
  const selected = sorter.split(rect, item)

  expect(selected).toMatchInlineSnapshot(`
Array [
  Object {
    "bin": 0,
    "height": 50,
    "id": "sh-r1",
    "splitFrom": "1",
    "width": 50,
    "x": 50,
    "y": 0,
  },
  Object {
    "bin": 0,
    "height": 0,
    "id": "sh-r2",
    "splitFrom": "1",
    "width": 100,
    "x": 0,
    "y": 50,
  },
]
`)
})

test('short axis split', () => {
  const sorter = GetSplitImplementation(SplitStrategy.ShortAxisSplit, 0)
  const selected = sorter.split(rect, item)

  expect(selected).toMatchInlineSnapshot(`
Array [
  Object {
    "bin": 0,
    "height": 0,
    "id": "sh-r1",
    "splitFrom": "1",
    "width": 50,
    "x": 0,
    "y": 50,
  },
  Object {
    "bin": 0,
    "height": 50,
    "id": "sh-r2",
    "splitFrom": "1",
    "width": 50,
    "x": 50,
    "y": 0,
  },
]
`)
})

test('short axis leftover split', () => {
  const sorter = GetSplitImplementation(SplitStrategy.ShortLeftoverAxisSplit, 0)
  const selected = sorter.split(rect, item)

  expect(selected).toMatchInlineSnapshot(`
Array [
  Object {
    "bin": 0,
    "height": 0,
    "id": "sh-r1",
    "splitFrom": "1",
    "width": 50,
    "x": 0,
    "y": 50,
  },
  Object {
    "bin": 0,
    "height": 50,
    "id": "sh-r2",
    "splitFrom": "1",
    "width": 50,
    "x": 50,
    "y": 0,
  },
]
`)
})

test('long axis leftover split', () => {
  const sorter = GetSplitImplementation(SplitStrategy.LongLeftoverAxisSplit, 0)
  const selected = sorter.split(rect, item)

  expect(selected).toMatchInlineSnapshot(`
Array [
  Object {
    "bin": 0,
    "height": 50,
    "id": "sh-r1",
    "splitFrom": "1",
    "width": 50,
    "x": 50,
    "y": 0,
  },
  Object {
    "bin": 0,
    "height": 0,
    "id": "sh-r2",
    "splitFrom": "1",
    "width": 100,
    "x": 0,
    "y": 50,
  },
]
`)
})
