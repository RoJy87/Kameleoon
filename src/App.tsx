import React, { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import './App.css'
import Chart from './components/Chart/Chart'
import ChartControls from './components/ChartControls/ChartControls'
import { getVariations, ChartVariation } from './utils/dataProcessor'

type LineStyle = 'line' | 'smooth' | 'area' | 'shadow'
type Granularity = 'day' | 'week'
type Theme = 'light' | 'dark'

function App() {
  const [allVariations, setAllVariations] = useState<ChartVariation[]>([])
  const [selectedVariations, setSelectedVariations] = useState<string[]>([])
  const [granularity, setGranularity] = useState<Granularity>('day')
  const [lineStyle, setLineStyle] = useState<LineStyle>('line')
  const [theme, setTheme] = useState<Theme>('light')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomStartIndex, setZoomStartIndex] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null)

  const handleExportPNG = async () => {
    if (!chartRef.current) return
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: theme === 'dark' ? '#0b1220' : '#fff',
      })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `chart-${new Date().toISOString().split('T')[0]}.png`
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.5, 4)
    setZoomLevel(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1)
    setZoomLevel(newZoom)
    if (newZoom === 1) {
      setZoomStartIndex(0)
    }
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
    setZoomStartIndex(0)
  }

  useEffect(() => {
    const variations = getVariations()
    setAllVariations(variations)
    if (variations.length > 0) {
      setSelectedVariations(variations.map((v) => v.id))
    }
  }, [])

  return (
    <div className={`App ${theme}`}>
      <header className='App-header'>
        <h1>Kameleoon A/B Test Chart</h1>
      </header>
      <ChartControls
        variations={allVariations}
        selectedVariations={selectedVariations}
        onSelectedVariationsChange={setSelectedVariations}
        granularity={granularity}
        onGranularityChange={setGranularity}
        lineStyle={lineStyle}
        onLineStyleChange={setLineStyle}
        onExportPNG={handleExportPNG}
        theme={theme}
        onThemeChange={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />
      <div ref={chartRef}>
        <Chart
          variations={allVariations}
          selectedVariations={selectedVariations}
          granularity={granularity}
          lineStyle={lineStyle}
          theme={theme}
          zoomLevel={zoomLevel}
          zoomStartIndex={zoomStartIndex}
          onPan={setZoomStartIndex}
        />
      </div>
    </div>
  )
}

export default App
