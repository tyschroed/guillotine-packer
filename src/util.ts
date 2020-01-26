const f = (a: any[], b: any[]) => ([] as any[]).concat(...a.map(d => b.map(e => [].concat(d, e))))
export const cartesian = (a: any[], b?: any[], ...c: any): any[] =>
  b ? cartesian(f(a, b), ...c) : a
