# guillotine-packer

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Travis](https://img.shields.io/travis/tyschroed/guillotine-packer)](https://travis-ci.org/tyschroed/guillotine-packer)
[![Coverage Status](https://coveralls.io/repos/github/tyschroed/guillotine-packer/badge.svg?branch=master)](https://coveralls.io/github/tyschroed/guillotine-packer?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## What is this?

This is a bin packing implementation based off of [this](http://pds25.egloos.com/pds/201504/21/98/RectangleBinPack.pdf) fantastic paper. Originally developed as part of [Part Placer](https://github.com/tyschroed/part-placer]) for the woodworking community, however it can be used for all sorts of bin packing applications! Guillotine based algorithms translate well for many real-world material use cases, as they nicely balance outputs that can easily performed on machinery with efficient material use.

## Getting Started

### Install

```bash
npm install guillotine-packer
```

### Usage

```javascript
import { packer } from 'guillotine-packer'

  const result = packer({
    binHeight: 30,
    binWidth: 30,
    items: [
      {
        name: 'test2',
        width: 20,
        height: 20
      } as Item,
      {
        name: 'test',
        width: 20,
        height: 20
      } as Item
    ]
  })

  /* OUTPUT:

  Array [
  Array [
    Object {
      "bin": 1,
      "height": 20,
      "item": Object {
        "name": "test2",
      },
      "width": 20,
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
      "x": 20,
      "y": 0,
    },
  ],
]

  */
```

#### Parameters

##### Inputs

| Property  | Default   | Description                                                                                                                                                |
| --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| binHeight | undefined | `required` Height of the bin we will be packing the items into                                                                                             |
| binWidth  | undefined | `required` Width of the bin we will be packing the items into                                                                                              |
| items     | undefined | `required` Array of items. Each item should have a width and height property. Additional properties will be included in the `item` property of the results |

##### Options

| Option            | Default   | Description                                                                                         |
| ----------------- | --------- | --------------------------------------------------------------------------------------------------- |
| kerfSize          | 0         | The size of the blade kerf to account for when splitting rectanges                                  |
| sortStrategy      | undefined | `SortStrategy` to use. Undefined will try all strategies and pick which performs the best.          |
| splitStrategy     | undefined | `SplitStrategy` to use. Undefined will try all strategies and pick which performs the best.         |
| selectionStrategy | undefined | `SelectionStrategy` to use. Undefined will try all strategies and pick which performs the best.     |
| allowRotation     | true      | Whether items may be rotated. If true, items will be rotated if doing so maximizes the offcut size. |

:beers:
