import { Rectangle, Item } from './types'

type SelectionResult = {
  selectedRectangle: Rectangle
  index: number
}

export enum SelectionStrategy {
  BEST_SHORT_SIDE_FIT,
  BEST_LONG_SIDE_FIT,
  BEST_AREA_FIT
}

abstract class SelectionImplementation {
  abstract select(freeRectangles: Rectangle[], itemToPlace: Item): SelectionResult | null
}

class BestShortSideFit extends SelectionImplementation {
  select(freeRectangles: Rectangle[], itemToPlace: Item) {
    const { width, height } = itemToPlace
    const [rect] = freeRectangles
      .map((freeRect, rectIndex) => ({
        shortSideLeftover: Math.min(freeRect.width - width, freeRect.height - height),
        rectangleIndex: rectIndex
      }))
      .filter(r => r.shortSideLeftover >= 0)
      .sort((a, b) => (a.shortSideLeftover > b.shortSideLeftover ? 1 : -1))
    if (!rect) {
      return null
    }
    return {
      selectedRectangle: freeRectangles[rect.rectangleIndex],
      index: rect.rectangleIndex
    }
  }
}

class BestLongSideFit extends SelectionImplementation {
  select(freeRectangles: Rectangle[], itemToPlace: Item) {
    const { width, height } = itemToPlace
    const [rect] = freeRectangles
      .map((freeRect, rectIndex) => ({
        longSideLeftover: Math.max(freeRect.width - width, freeRect.height - height),
        rectangleIndex: rectIndex
      }))
      .filter(r => r.longSideLeftover >= 0)
      .sort((a, b) => (a.longSideLeftover > b.longSideLeftover ? 1 : -1))
    if (!rect) {
      return null
    }
    return {
      selectedRectangle: freeRectangles[rect.rectangleIndex],
      index: rect.rectangleIndex
    }
  }
}

class BestAreaFit extends SelectionImplementation {
  select(freeRectangles: Rectangle[], itemToPlace: Item) {
    const [rect] = freeRectangles
      .map((freeRect, rectIndex) => ({
        fits: freeRect.width >= itemToPlace.width && freeRect.height >= itemToPlace.height,
        area: freeRect.width * freeRect.height,
        rectangleIndex: rectIndex
      }))
      .filter(r => r.fits)
      .sort((a, b) => (a.area > b.area ? 1 : -1))
    if (!rect) {
      return null
    }
    return {
      selectedRectangle: freeRectangles[rect.rectangleIndex],
      index: rect.rectangleIndex
    }
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
