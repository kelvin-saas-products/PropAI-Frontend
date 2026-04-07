export interface NumericPriceStop {
  value: number
}

export function valueToMinStopIdx<T extends NumericPriceStop>(stops: T[], raw: string) {
  const val = Number(raw)
  if (!val) return 0
  const i = stops.findIndex(s => s.value >= val)
  return i === -1 ? 0 : i
}

export function valueToMaxStopIdx<T extends NumericPriceStop>(stops: T[], raw: string) {
  const val = Number(raw)
  const lastIdx = stops.length - 1
  if (!val) return lastIdx
  for (let i = lastIdx; i >= 0; i--) {
    if (stops[i].value <= val) return i
  }
  return lastIdx
}

