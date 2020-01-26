# guillotine-packer

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Travis](https://img.shields.io/travis/tyschroed/guillotine-packer)](https://travis-ci.org/tyschroed/guillotine-packer)
[![Coverage Status](https://coveralls.io/repos/github/tyschroed/guillotine-packer/badge.svg?branch=master)](https://coveralls.io/github/tyschroed/guillotine-packer?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## What is this?

This is a simple little utility to parse free text dimensions (i.e. 2ft, 1 1/2in, 6", 3cm) into their numerical values. It supports imperial and metric values, including shorthand equivalents. It even handles the pesky curly quotes that newer releases of iOS love to use!

## Getting Started

### Install

```bash
npm install guillotine-packer
```

### Usage

```javascript
import { parseDimension, units } from 'guillotine-packer'

parseDimension(`3ft`)
// -> 36

parseDimension(`1' 6"`)
// -> 18

// specify units output value should be in
parseDimension(`24"`, { outputUnits: units.ft })
// -> 2

// specify the assumed units if none are provided
parseDimension(`2`, { defaultUnits: units.ft })
// -> 24
```

### Options

The second parameter is an optional options object, with the following properties:

| Option       | Default  | Description                                          |
| ------------ | -------- | ---------------------------------------------------- |
| defaultUnits | units.in | If no units provided, parser will assume these units |
| outputUnits  | units.in | Dimensions that output will be converted to          |

For both options, valid values are one of:

```typescript
export enum units {
  in = 'in',
  ft = 'ft',
  mm = 'mm',
  m = 'm',
  cm = 'cm'
}
```

:beers:
