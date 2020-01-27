import debugLib from 'debug'
const debug = debugLib('guillotine-packer')
import { Rectangle, Item } from './types'
import { SelectionStrategy, GetSelectionImplementation } from './selection-strategies'
import { SortDirection, SortStrategy, GetSortImplementation } from './sort-strategies'
import { SplitStrategy, GetSplitImplementation } from './split-strategies'

export type PackStrategyOptions = {
  binHeight: number
  binWidth: number
  items: Item[]
  selectionStrategy: SelectionStrategy
  splitStrategy: SplitStrategy
  sortStrategy: SortStrategy
  sortOrder: SortDirection
  kerfSize: number
  allowRotation: boolean
}

export type PackedItem = {
  item: any
  width: number
  height: number
  x: number
  y: number
  bin: number
}

export function PackStrategy({
  binHeight,
  binWidth,
  items,
  selectionStrategy,
  splitStrategy,
  sortStrategy,
  sortOrder,
  kerfSize,
  allowRotation
}: PackStrategyOptions) {
  debug(
    `Executing! split strategy: ${splitStrategy}, selection strategy: ${selectionStrategy}, sortStrategy: ${sortStrategy}, sortOrder: ${sortOrder}`
  )
  let binCount = 0
  const freeRectangles: Rectangle[] = []

  const createBin = () => {
    debug(`creating bin ${binCount}`)
    binCount++
    freeRectangles.push({
      width: binWidth,
      height: binHeight,
      x: 0,
      y: 0,
      bin: binCount,
      id: 'root'
    })
  }
  const splitter = GetSplitImplementation(splitStrategy, kerfSize)
  const selector = GetSelectionImplementation(selectionStrategy)
  const sorter = GetSortImplementation(sortStrategy, sortOrder)

  const sortedItems = sorter.sort(items)

  const rotateItem = (item: Item) => {
    return { ...item, height: item.width, width: item.height }
  }

  const splitRectangle = ({ rectangle, item }: { rectangle: Rectangle; item: Item }) => {
    return splitter.split(rectangle, item).filter(r => r.width !== 0 && r.height !== 0)
  }

  const getSelectionOption = (item: Item) => {
    const rectangle = selector.select(freeRectangles, item)
    debug(`for item ${JSON.stringify(item)}, selected ${JSON.stringify(rectangle)}`)
    if (!rectangle) {
      return null
    }
    const splitRectangles = splitRectangle({ rectangle: rectangle.selectedRectangle, item })
    return {
      rectangle,
      splitRectangles,
      item
    }
  }

  const selectRectangleOption = (item: Item) => {
    const originalOption = getSelectionOption(item)
    let rotatedOption = null
    let rotatedItem
    if (allowRotation) {
      rotatedItem = rotateItem(item)
      rotatedOption = getSelectionOption(rotatedItem)
    }
    if (originalOption === null && rotatedOption === null) {
      debug(`No free rectangles found for`, item)
      return null
    } else if (originalOption === null) {
      debug(`Original item didn't fit, using rotated`, item)
      return rotatedOption
    } else if (rotatedOption === null) {
      debug(`Rotated item didn't fit, using original option`, item)
      return originalOption
    } else {
      const getBiggestSplitRectangle = ({ splitRectangles }: { splitRectangles: Rectangle[] }) =>
        Math.max(...splitRectangles.map(split => split.height * split.width))
      const originalMax = getBiggestSplitRectangle(originalOption)
      const rotatedMax = getBiggestSplitRectangle(rotatedOption)
      debug(`Original max area ${originalMax}, rotated max area ${rotatedMax}`)
      if (getBiggestSplitRectangle(originalOption) >= getBiggestSplitRectangle(rotatedOption)) {
        debug(`Going with original placement option`)
        return originalOption
      } else {
        debug(`Going with rotated placement option`)
        return rotatedOption
      }
    }
  }

  const packedItems = sortedItems
    .map((item, idx) => {
      debug('packing item', item)
      let selectedOption = selectRectangleOption(item)
      if (!selectedOption) {
        createBin()
        selectedOption = selectRectangleOption(item)
      }
      if (!selectedOption) {
        throw new Error(
          `item at index ${idx} with dimensions ${item.width}x${item.height} exceeds bin dimensions of ${binWidth}x${binHeight}`
        )
      }
      const { rectangle, splitRectangles } = selectedOption
      debug('selected rectangle', rectangle)
      const { width, height, ...otherItemProps } = selectedOption.item
      const packedItem = {
        item: otherItemProps,
        width,
        height,
        x: rectangle.selectedRectangle.x,
        y: rectangle.selectedRectangle.y,
        bin: rectangle.selectedRectangle.bin
      }
      debug('packed item', packedItem)
      freeRectangles.splice(rectangle.index, 1, ...splitRectangles)
      debug('free rectangles post split', freeRectangles)
      return packedItem
    })
    .reduce((bins, item) => {
      if (bins.length >= item.bin) {
        bins[item.bin - 1].push(item)
      } else {
        bins.push([item])
      }
      return bins
    }, [] as PackedItem[][])

  return {
    sortStrategy,
    sortOrder,
    packedItems,
    splitStrategy,
    selectionStrategy
  }
}
