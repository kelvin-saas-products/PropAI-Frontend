import test from 'node:test'
import assert from 'node:assert/strict'
import { valueToMinStopIdx, valueToMaxStopIdx } from '../lib/price-stop-utils'

const RENT_STOPS = [
  { value: 0, label: 'Any' },
  { value: 250, label: '$250' },
  { value: 500, label: '$500' },
  { value: 750, label: '$750' },
  { value: 1000, label: '$1k' },
  { value: 2500, label: '$2.5k+' },
  { value: 5000, label: '$5k+' },
]

test('maps min value to nearest lower-bounded stop index', () => {
  assert.equal(valueToMinStopIdx(RENT_STOPS, ''), 0)
  assert.equal(valueToMinStopIdx(RENT_STOPS, '800'), 4) // snaps up to $1k
  assert.equal(valueToMinStopIdx(RENT_STOPS, '950'), 4) // snaps up to $1k
})

test('maps max value to nearest upper-bounded stop index', () => {
  assert.equal(valueToMaxStopIdx(RENT_STOPS, ''), RENT_STOPS.length - 1)
  assert.equal(valueToMaxStopIdx(RENT_STOPS, '950'), 3) // snaps down to $750
  assert.equal(valueToMaxStopIdx(RENT_STOPS, '2500'), 5)
})

test('advanced panel and dropdown produce identical indices for same URL values', () => {
  const urlMin = '950'
  const urlMax = '2500'
  const panelMin = valueToMinStopIdx(RENT_STOPS, urlMin)
  const panelMax = valueToMaxStopIdx(RENT_STOPS, urlMax)
  const dropdownMin = valueToMinStopIdx(RENT_STOPS, urlMin)
  const dropdownMax = valueToMaxStopIdx(RENT_STOPS, urlMax)

  assert.equal(panelMin, dropdownMin)
  assert.equal(panelMax, dropdownMax)
})

