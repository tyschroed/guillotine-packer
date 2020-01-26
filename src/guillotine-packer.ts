import { SplitStrategy } from './split-strategies'
import { SelectionStrategy } from './selection-strategies'
import { SortStrategy, SortDirection } from './sort-strategies'
import createDebug from 'debug'
const debug = createDebug('guillotine-packer')
import { PackedItem, PackStrategy } from './pack-strategy'
import { Item } from './types'
import { cartesian } from './util'

type PackerInputs = { binHeight: number; binWidth: number; items: Item[] }
type PackerConfig = {
  selectionStrategy?: SelectionStrategy
  splitStrategy?: SplitStrategy
  sortStrategy?: SortStrategy
  kerfSize?: number
  allowRotation?: boolean
}

type PackerResult = PackedItem[][] | null

function Packer(
  { binHeight, binWidth, items }: PackerInputs,
  {
    selectionStrategy,
    splitStrategy,
    sortStrategy,
    kerfSize = 0,
    allowRotation = true
  }: PackerConfig = {}
) {
  function enumToArray<T>(enumVariable: T) {
    return Object.values(enumVariable)
      .filter(value => parseInt(value, 10) >= 0)
      .map(value => value as keyof T)
  }

  const selectionStrategies = selectionStrategy
    ? [selectionStrategy]
    : enumToArray(SelectionStrategy)

  const splitStrategies = splitStrategy ? [splitStrategy] : enumToArray(SplitStrategy)
  const sortStrategies = sortStrategy ? [sortStrategy] : enumToArray(SortStrategy)

  const allStrategies = cartesian(selectionStrategies, splitStrategies, sortStrategies, [
    SortDirection.ASC,
    SortDirection.DESC
  ])

  return allStrategies
    .map(([selectionStrategy, splitStrategy, sortStrategy, sortOrder]) =>
      PackStrategy({
        binWidth,
        binHeight,
        items,
        splitStrategy,
        selectionStrategy,
        sortStrategy,
        sortOrder,
        kerfSize,
        allowRotation
      })
    )
    .reduce((bestCompressed, packResult) => {
      const { splitStrategy, sortStrategy, selectionStrategy, sortOrder, packedItems } = packResult
      debug(
        `Result for split strategy: ${splitStrategy}, selection strategy: ${selectionStrategy}, sortStrategy: ${sortStrategy}, sortOrder: ${sortOrder} - ${packedItems.length} bin(s)`
      )
      if (!bestCompressed || packedItems.length < bestCompressed.length) {
        return packedItems
      } else {
        return bestCompressed
      }
    }, null as PackerResult)
}

export { SplitStrategy, SelectionStrategy, SortStrategy, Packer as packer }
