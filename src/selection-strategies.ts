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
  abstract selectFromAvailable(
    freeRectangles: Rectangle[],
    itemToPlace: Item
  ): SelectionResult | null
  select(freeRectangles: Rectangle[], itemToPlace: Item) {
    return this.selectFromAvailable(
      freeRectangles.filter(
        freeRect =>
          freeRect.width - itemToPlace.width >= 0 && freeRect.height - itemToPlace.height >= 0
      ),
      itemToPlace
    )
  }
}

class BestShortSideFit extends SelectionImplementation {
  selectFromAvailable(freeRectangles: Rectangle[], itemToPlace: Item) {
    const { width, height } = itemToPlace
    const [rect] = freeRectangles
      .map((freeRect, rectIndex) => ({
        shortSideLeftover: Math.min(freeRect.width - width, freeRect.height - height),
        rectangleIndex: rectIndex
      }))
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
  selectFromAvailable(freeRectangles: Rectangle[], itemToPlace: Item) {
    const { width, height } = itemToPlace
    const [rect] = freeRectangles
      .map((freeRect, rectIndex) => ({
        longSideLeftover: Math.max(freeRect.width - width, freeRect.height - height),
        rectangleIndex: rectIndex
      }))
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
  selectFromAvailable(freeRectangles: Rectangle[], itemToPlace: Item) {
    const [rect] = freeRectangles
      .map((freeRect, rectIndex) => ({
        area: freeRect.width * freeRect.height,
        rectangleIndex: rectIndex
      }))
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
