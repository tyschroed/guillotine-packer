import debugLib from 'debug'
const debug = debugLib('guillotine-packer')
import { Rectangle, Item } from './types'

// implementations based off of http://pds25.egloos.com/pds/201504/21/98/RectangleBinPack.pdf

abstract class Splitter {
  constructor(public kerfSize: number) {}
  abstract split(rectangle: Rectangle, item: Item): Rectangle[]
  protected splitHorizontally(rectangle: Rectangle, item: Item): Rectangle[] {
    debug(`splitting ${rectangle.id} horizontally`)
    const rectangle1 = {
      ...this._split(rectangle),
      x: rectangle.x + item.width + this.kerfSize,
      width: rectangle.width - item.width - this.kerfSize,
      height: item.height,
      id: 'sh-r1'
    }
    const rectangle2 = {
      ...this._split(rectangle),
      y: rectangle.y + item.height + this.kerfSize,
      height: rectangle.height - item.height - this.kerfSize,
      id: 'sh-r2'
    }

    return [rectangle1, rectangle2]
  }
  protected splitVertically(rectangle: Rectangle, item: Item): Rectangle[] {
    debug(`splitting ${rectangle.id} vertically`)
    const rectangle1 = {
      ...this._split(rectangle),
      y: rectangle.y + item.height + this.kerfSize,
      width: item.width,
      height: rectangle.height - item.height - this.kerfSize,
      id: 'sh-r1'
    }
    const rectangle2 = {
      ...this._split(rectangle),
      x: rectangle.x + item.width + this.kerfSize,
      y: rectangle.y,
      width: rectangle.width - item.width - this.kerfSize,
      id: 'sh-r2'
    }
    return [rectangle1, rectangle2]
  }
  private _split = (rectangle: Rectangle) => ({ ...rectangle, splitFrom: rectangle.id })
}

class ShortAxisSplit extends Splitter {
  split(rectangle: Rectangle, item: Item) {
    if (rectangle.width < rectangle.height) {
      return this.splitHorizontally(rectangle, item)
    } else {
      return this.splitVertically(rectangle, item)
    }
  }
}

class LongAxisSplit extends Splitter {
  split(rectangle: Rectangle, item: Item) {
    if (rectangle.width > rectangle.height) {
      return this.splitHorizontally(rectangle, item)
    } else {
      return this.splitVertically(rectangle, item)
    }
  }
}

class ShorterLeftoverAxisSplit extends Splitter {
  split(rectangle: Rectangle, item: Item) {
    if (rectangle.width - item.width < rectangle.height - item.height) {
      return this.splitHorizontally(rectangle, item)
    } else {
      return this.splitVertically(rectangle, item)
    }
  }
}

class LongerLeftoverAxisSplit extends Splitter {
  split(rectangle: Rectangle, item: Item) {
    if (rectangle.width - item.width >= rectangle.height - item.height) {
      return this.splitHorizontally(rectangle, item)
    } else {
      return this.splitVertically(rectangle, item)
    }
  }
}

export enum SplitStrategy {
  LongLeftoverAxisSplit,
  ShortLeftoverAxisSplit,
  LongAxisSplit,
  ShortAxisSplit
}

export function GetSplitImplementation(strategy: SplitStrategy, kerfSize: number): Splitter {
  switch (strategy) {
    case SplitStrategy.LongAxisSplit:
      return new LongAxisSplit(kerfSize)
    case SplitStrategy.ShortAxisSplit:
      return new ShortAxisSplit(kerfSize)
    case SplitStrategy.LongLeftoverAxisSplit:
      return new LongerLeftoverAxisSplit(kerfSize)
    case SplitStrategy.ShortLeftoverAxisSplit:
      return new ShorterLeftoverAxisSplit(kerfSize)
  }
}
