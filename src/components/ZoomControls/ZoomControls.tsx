import React from 'react'

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, onResetZoom }) => (
  <div className='zoom-controls'>
    <button onClick={onZoomOut} className='zoom-button' title='Zoom out'>
      −
    </button>
    <button onClick={onResetZoom} className='zoom-button' title='Reset zoom'>
      ⟲
    </button>
    <button onClick={onZoomIn} className='zoom-button' title='Zoom in'>
      +
    </button>
  </div>
)

export default ZoomControls
