import React, { useState, useEffect, useMemo } from 'react'
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineProps,
  AreaProps,
} from 'recharts'
import { processChartData, ProcessedChartData, Granularity, ChartVariation } from '../../utils/dataProcessor'
import styles from './Chart.module.css'
import { parseISO, format } from 'date-fns'
import CustomTooltip from '../CustomTooltip/CustomTooltip'
import { useChartPan } from './useChartPan'

interface ChartProps {
  selectedVariations: string[]
  variations: ChartVariation[]
  granularity?: Granularity
  lineStyle?: 'line' | 'smooth' | 'area' | 'shadow'
  theme?: 'light' | 'dark'
  zoomLevel?: number
  zoomStartIndex?: number
  onPan: (startIndex: number) => void
}

const Chart: React.FC<ChartProps> = ({
  selectedVariations,
  variations,
  granularity = 'day',
  lineStyle = 'line',
  theme = 'light',
  zoomLevel = 1,
  zoomStartIndex = 0,
  onPan,
}) => {
  const [chartData, setChartData] = useState<ProcessedChartData[]>([])

  useEffect(() => {
    setChartData(processChartData(granularity))
  }, [granularity])

  const yDomain = useMemo((): [number, number] => {
    const keys = selectedVariations.map((id) => `conversionRate_${id}`)
    const values: number[] = chartData.flatMap((row) =>
      keys.map((k) => row[k] as number).filter((v) => typeof v === 'number' && !isNaN(v)),
    )

    if (values.length === 0) return [0, 100]
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padLow = Math.max(0, Math.floor(min * 0.9))
    const padHigh = Math.ceil(max * 1.1)
    return [padLow, padHigh]
  }, [chartData, selectedVariations])

  const visibleData = useMemo(() => {
    if (zoomLevel === 1) return chartData

    const pointsPerView = Math.ceil(chartData.length / zoomLevel)
    const startIdx = Math.min(zoomStartIndex, Math.max(0, chartData.length - pointsPerView))
    return chartData.slice(startIdx, startIdx + pointsPerView)
  }, [chartData, zoomLevel, zoomStartIndex])

  const getTicks = (domain: [number, number]) => {
    const [min, max] = domain
    const ticks = []
    for (let i = Math.floor(min / 10) * 10; i <= max; i += 10) {
      ticks.push(i)
    }
    return ticks
  }

  const formatXAxis = (tickItem: string) => {
    return format(parseISO(tickItem), 'dd MMM')
  }

  const { isPanning, handleMouseDown, handleMouseMove, handleMouseUp } = useChartPan(
    zoomLevel,
    onPan,
    zoomStartIndex,
  )

  return (
    <div
      className={`${styles.chartWrapper} ${isPanning ? styles.grabbing : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}>
      {zoomLevel > 1 && zoomStartIndex > 0 && (
        <button
          className={`${styles.panButton} ${styles.panLeft}`}
          onClick={() => onPan(Math.max(0, zoomStartIndex - 1))}>
          ‹
        </button>
      )}
      {zoomLevel > 1 && zoomStartIndex < chartData.length - Math.ceil(chartData.length / zoomLevel) && (
        <button className={`${styles.panButton} ${styles.panRight}`} onClick={() => onPan(zoomStartIndex + 1)}>
          ›
        </button>
      )}
      <div className={styles.chartContainer}>
        <ResponsiveContainer width='100%' height={400}>
          <ComposedChart
            data={visibleData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' tickFormatter={formatXAxis} interval='preserveStartEnd' />
            <YAxis
              tickFormatter={(value: number) => `${value}%`}
              domain={yDomain}
              ticks={getTicks(yDomain)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: theme === 'dark' ? '#fff' : '#8884d8', strokeWidth: 1 }}
            />
            {variations.map((variation) => {
              if (selectedVariations.includes(variation.id)) {
                const key = `conversionRate_${variation.id}`
                const commonProps: LineProps & AreaProps = {
                  key: variation.id,
                  dataKey: key,
                  stroke: variation.color,
                  name: variation.name,
                  dot: false,
                  activeDot: { r: 8 },
                  isAnimationActive: true,
                  strokeWidth: 2,
                  type: lineStyle === 'line' ? 'linear' : 'monotone',
                }
                if (lineStyle === 'area') {
                  return <Area {...commonProps} fill={variation.color} fillOpacity={0.15} />
                }
                if (lineStyle === 'shadow') {
                  return (
                    <g key={`shadow-group-${variation.id}`}>
                      <defs>
                        <filter id={`shadow-filter-${variation.id}`} x='-50%' y='-50%' width='200%' height='200%'>
                          <feGaussianBlur in='SourceGraphic' stdDeviation='3' />
                        </filter>
                      </defs>
                      <Line
                        {...commonProps}
                        strokeWidth={20}
                        strokeOpacity={0.4}
                        filter={`url(#shadow-filter-${variation.id})`}
                        name={`${variation.name}-shadow`}
                      />
                      <Line {...commonProps} />
                    </g>
                  )
                }

                return <Line {...commonProps} />
              }
              return null
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Chart
