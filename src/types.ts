export type Rectangle = {
  width: number
  height: number
  x: number
  y: number
  bin: number
  id: string
  splitFrom?: string
}

export interface Item {
  width: number
  height: number
  [others: string]: any
}
