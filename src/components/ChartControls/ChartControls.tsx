import React from 'react'
import VariationsDropdown from '../VariationsDropdown/VariationsDropdown'
import ZoomControls from '../ZoomControls/ZoomControls'
import { ChartVariation } from '../../utils/dataProcessor'

type LineStyle = 'line' | 'smooth' | 'area' | 'shadow'
type Granularity = 'day' | 'week'
type Theme = 'light' | 'dark'

interface ChartControlsProps {
  variations: ChartVariation[]
  selectedVariations: string[]
  onSelectedVariationsChange: (selected: string[]) => void
  granularity: Granularity
  onGranularityChange: (granularity: Granularity) => void
  lineStyle: LineStyle
  onLineStyleChange: (style: LineStyle) => void
  onExportPNG: () => void
  theme: Theme
  onThemeChange: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
}

const ChartControls: React.FC<ChartControlsProps> = ({
  variations,
  selectedVariations,
  onSelectedVariationsChange,
  granularity,
  onGranularityChange,
  lineStyle,
  onLineStyleChange,
  onExportPNG,
  theme,
  onThemeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => (
  <div className='chart-controls'>
    <div className='controls-left'>
      <VariationsDropdown
        variations={variations}
        selectedVariations={selectedVariations}
        onChange={onSelectedVariationsChange}
      />
      <select
        className='control-select'
        value={granularity}
        onChange={(e) => onGranularityChange(e.target.value as Granularity)}>
        <option value='day'>Day</option>
        <option value='week'>Week</option>
      </select>
    </div>
    <div className='controls-right'>
      <ZoomControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} onResetZoom={onResetZoom} />
      <select
        className='control-select'
        value={lineStyle}
        onChange={(e) => onLineStyleChange(e.target.value as LineStyle)}>
        <option value='line'>Line</option>
        <option value='smooth'>Smooth</option>
        <option value='area'>Area</option>
        <option value='shadow'>Shadow</option>
      </select>
      <button onClick={onExportPNG} className='action-button'>
        📥 Export
      </button>
      <button onClick={onThemeChange} className='action-button theme-button'>
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
    </div>
  </div>
)

export default ChartControls
