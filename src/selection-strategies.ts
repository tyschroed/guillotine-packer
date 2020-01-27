import { Rectangle, Item } from './types'

export enum SelectionStrategy {
  BEST_SHORT_SIDE_FIT,
  BEST_LONG_SIDE_FIT,
  BEST_AREA_FIT
}

abstract class SelectionImplementation {
  abstract generateSortValue(freeRectangle: Rectangle, itemToPlace: Item): number
  select(freeRectangles: Rectangle[], itemToPlace: Item): Rectangle | null {
    const [bestRect] = freeRectangles
      .filter(
        freeRect =>
          freeRect.width - itemToPlace.width >= 0 && freeRect.height - itemToPlace.height >= 0
      )
      .map(r => ({ rectangle: r, sortValue: this.generateSortValue(r, itemToPlace) }))
      .sort((a, b) => (a.sortValue > b.sortValue ? 1 : -1))

    return bestRect ? bestRect.rectangle : null
  }
}

class BestShortSideFit extends SelectionImplementation {
  generateSortValue(freeRectangle: Rectangle, itemToPlace: Item) {
    const { width, height } = itemToPlace
    return Math.min(freeRectangle.width - width, freeRectangle.height - height)
  }
}

class BestLongSideFit extends SelectionImplementation {
  generateSortValue(freeRectangle: Rectangle, itemToPlace: Item) {
    const { width, height } = itemToPlace
    return Math.max(freeRectangle.width - width, freeRectangle.height - height)
  }
}

class BestAreaFit extends SelectionImplementation {
  generateSortValue(freeRectangle: Rectangle) {
    return freeRectangle.width * freeRectangle.height
  }
}

export function GetSelectionImplementation(strategy: SelectionStrategy): SelectionImplementation {
  switch (strategy) {
    case SelectionStrategy.BEST_AREA_FIT:
      return new BestAreaFit()
    case SelectionStrategy.BEST_LONG_SIDE_FIT:
      return new BestLongSideFit()
    case SelectionStrategy.BEST_SHORT_SIDE_FIT:
      return new BestShortSideFit()
  }
}
