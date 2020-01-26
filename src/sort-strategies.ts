// implementations based off of http://pds25.egloos.com/pds/201504/21/98/RectangleBinPack.pdf
import { Item } from './types'

const area = (item: Item) => item.height * item.width
const perimeter = (item: Item) => item.height * 2 + item.width * 2

const sides = (item: Item) => ({
  short: Math.min(item.width, item.height),
  long: Math.max(item.width, item.height)
})

abstract class Sorter {
  constructor(public direction: SortDirection) {}
  protected abstract comparer(a: Item, b: Item): number
  sort(items: Item[]) {
    const sortedItems = [...items].sort(this.comparer)
    return this.direction === SortDirection.DESC ? sortedItems.reverse() : sortedItems
  }
}

class Area extends Sorter {
  comparer(a: Item, b: Item) {
    return area(a) < area(b) ? -1 : 1
  }
}

class ShortSide extends Sorter {
  comparer(a: Item, b: Item) {
    const aSides = sides(a)
    const bSides = sides(b)

    if (aSides.short === bSides.short) {
      return aSides.long < bSides.long ? -1 : 1
    } else {
      return aSides.short < bSides.short ? -1 : 1
    }
  }
}

class LongSide extends Sorter {
  comparer(a: Item, b: Item) {
    const aSides = sides(a)
    const bSides = sides(b)
    if (aSides.long === bSides.long) {
      return aSides.short < bSides.short ? -1 : 1
    } else {
      return aSides.long < bSides.long ? -1 : 1
    }
  }
}

class Perimeter extends Sorter {
  comparer(a: Item, b: Item) {
    return perimeter(a) < perimeter(b) ? -1 : 1
  }
}

class Differences extends Sorter {
  comparer(a: Item, b: Item) {
    return Math.abs(a.width - a.height) < Math.abs(b.width - b.height) ? -1 : 1
  }
}

class Ratio extends Sorter {
  comparer(a: Item, b: Item) {
    return a.width / a.height < b.width / b.height ? -1 : 1
  }
}

export enum SortStrategy {
  Area,
  ShortSide,
  LongSide,
  Perimeter,
  Differences,
  Ratio
}

export enum SortDirection {
  ASC,
  DESC
}

export function GetSortImplementation(strategy: SortStrategy, direction: SortDirection): Sorter {
  let impl
  switch (strategy) {
    case SortStrategy.Area:
      impl = Area
      break
    case SortStrategy.Differences:
      impl = Differences
      break
    case SortStrategy.LongSide:
      impl = LongSide
      break
    case SortStrategy.Perimeter:
      impl = Perimeter
      break
    case SortStrategy.Ratio:
      impl = Ratio
      break
    case SortStrategy.ShortSide:
      impl = ShortSide
      break
  }
  return new impl(direction)
}
