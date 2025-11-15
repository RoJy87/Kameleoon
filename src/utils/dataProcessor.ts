import data from '../data.json'
import { RawData } from '../types'
import { parseISO, startOfWeek, format } from 'date-fns'

const typedData: RawData = data

export interface ProcessedChartData {
  date: string
  [key: string]: string | number
}

export interface ChartVariation {
  id: string
  name: string
  color: string
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57']

export const getVariations = (): ChartVariation[] => {
  return typedData.variations.map((variation, index) => ({
    id: String(variation.id ?? '0'),
    name: variation.name,
    color: COLORS[index % COLORS.length],
  }))
}

export type Granularity = 'day' | 'week'

const calcCR = (conversions: number | undefined, visits: number | undefined): number => {
  if (!visits || visits <= 0) return 0
  if (!conversions) return 0
  return parseFloat(((conversions / visits) * 100).toFixed(2))
}

export const processChartData = (granularity: Granularity = 'day'): ProcessedChartData[] => {
  const variations = getVariations()

  if (granularity === 'day') {
    return typedData.data.map((dailyData) => {
      const processedDay: ProcessedChartData = { date: dailyData.date }
      variations.forEach((variation) => {
        const visits = dailyData.visits[variation.id] ?? 0
        const conversions = dailyData.conversions[variation.id] ?? 0
        processedDay[`conversionRate_${variation.id}`] = calcCR(conversions, visits)
      })
      return processedDay
    })
  }

  const weekMap: Map<string, { visits: Record<string, number>; conversions: Record<string, number> }> = new Map()

  typedData.data.forEach((dailyData) => {
    const weekStart = startOfWeek(parseISO(dailyData.date), { weekStartsOn: 1 })
    const weekKey = format(weekStart, 'yyyy-MM-dd')

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { visits: {}, conversions: {} })
    }

    const bucket = weekMap.get(weekKey)!
    variations.forEach((variation) => {
      const vid = variation.id
      const v = dailyData.visits[vid] ?? 0
      const c = dailyData.conversions[vid] ?? 0
      bucket.visits[vid] = (bucket.visits[vid] || 0) + v
      bucket.conversions[vid] = (bucket.conversions[vid] || 0) + c
    })
  })

  const sortedWeeks = Array.from(weekMap.entries()).sort(([a], [b]) => a.localeCompare(b))
  return sortedWeeks.map(([weekKey, vals]) => {
    const row: ProcessedChartData = { date: weekKey }
    variations.forEach((v) => {
      const visits = vals.visits[v.id] || 0
      const conversions = vals.conversions[v.id] || 0
      row[`conversionRate_${v.id}`] = calcCR(conversions, visits)
    })
    return row
  })
}
