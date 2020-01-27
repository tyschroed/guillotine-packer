import { packer, SortStrategy, SplitStrategy, SelectionStrategy } from '../src/guillotine-packer'
import { Item } from '../src/types'

test('pack item requiring rotation', () => {
  const items = [
    {
      name: 'test',
      width: 30,
      height: 40
    } as Item
  ]

  const result = packer({
    binHeight: 30,
    binWidth: 40,
    items
  })

  expect(result).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "bin": 1,
      "height": 30,
      "item": Object {
        "name": "test",
      },
      "width": 40,
      "x": 0,
      "y": 0,
    },
  ],
]
`)
})

test('pack multiple bins', () => {
  const items = [
    {
      width: 4,
      height: 3
    },
    {
      width: 4,
      height: 3
    },
    {
      width: 4,
      height: 3
    },
    {
      width: 4,
      height: 3
    },
    {
      width: 4,
      height: 3
    }
  ]

  const result = packer(
    {
      binHeight: 4,
      binWidth: 8,
      items
    },
    {
      kerfSize: 0,
      sortStrategy: SortStrategy.Area,
      splitStrategy: SplitStrategy.ShortAxisSplit,
      selectionStrategy: SelectionStrategy.BEST_AREA_FIT
    }
  )

  expect(result).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "bin": 1,
      "height": 4,
      "item": Object {},
      "width": 3,
      "x": 0,
      "y": 0,
    },
    Object {
      "bin": 1,
      "height": 4,
      "item": Object {},
      "width": 3,
      "x": 3,
      "y": 0,
    },
  ],
  Array [
    Object {
      "bin": 2,
      "height": 4,
      "item": Object {},
      "width": 3,
      "x": 0,
      "y": 0,
    },
    Object {
      "bin": 2,
      "height": 4,
      "item": Object {},
      "width": 3,
      "x": 3,
      "y": 0,
    },
  ],
  Array [
    Object {
      "bin": 3,
      "height": 4,
      "item": Object {},
      "width": 3,
      "x": 0,
      "y": 0,
    },
  ],
]
`)
})

test('should rotate items if it results in more efficent packing', () => {
  const result = packer(
    {
      binHeight: 40,
      binWidth: 80,
      items: [
        {
          name: '40x20',
          width: 40,
          height: 20
        } as Item,
        {
          name: '40x20',
          width: 40,
          height: 20
        } as Item
      ]
    },
    {
      kerfSize: 0,
      sortStrategy: SortStrategy.Area,
      splitStrategy: SplitStrategy.ShortAxisSplit,
      selectionStrategy: SelectionStrategy.BEST_AREA_FIT
    }
  )
  expect(result).toHaveLength(1)
})

test('should not rotate items if allow rotation is disabled', () => {
  const result = packer(
    {
      binHeight: 40,
      binWidth: 80,
      items: [
        {
          name: '40x20',
          width: 40,
          height: 20
        } as Item,
        {
          name: '40x20',
          width: 40,
          height: 20
        } as Item
      ]
    },
    {
      kerfSize: 2,
      sortStrategy: SortStrategy.Area,
      splitStrategy: SplitStrategy.ShortAxisSplit,
      selectionStrategy: SelectionStrategy.BEST_AREA_FIT,
      allowRotation: false
    }
  )
  expect(result).toHaveLength(2)
})

test('create kerfs if provided', () => {
  const result = packer(
    {
      binHeight: 30,
      binWidth: 30,
      items: [
        {
          name: 'test',
          width: 20,
          height: 20
        } as Item,
        {
          name: 'kerfed offcut',
          width: 5,
          height: 5
        } as Item
      ]
    },
    { kerfSize: 2 }
  )
  expect(result).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "bin": 1,
      "height": 5,
      "item": Object {
        "name": "kerfed offcut",
      },
      "width": 5,
      "x": 0,
      "y": 0,
    },
    Object {
      "bin": 1,
      "height": 20,
      "item": Object {
        "name": "test",
      },
      "width": 20,
      "x": 0,
      "y": 7,
    },
  ],
]
`)
})

test('throw error if item too large for bin', () => {
  const invalidItem = () =>
    packer({
      binHeight: 30,
      binWidth: 30,
      items: [
        {
          width: 40,
          height: 40
        }
      ]
    })
  expect(invalidItem).toThrowError('exceeds bin dimensions')
})
