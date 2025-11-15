import { useState, useCallback } from 'react'

export const useChartPan = (
  zoomLevel: number,
  onPan: (newStartIndex: number) => void,
  zoomStartIndex: number,
) => {
  const [isPanning, setIsPanning] = useState(false)
  const [panStartX, setPanStartX] = useState(0)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoomLevel > 1) {
        setIsPanning(true)
        setPanStartX(e.clientX)
      }
    },
    [zoomLevel],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - panStartX
        const pointsToMove = Math.round(deltaX / 10) * -1
        const newStartIndex = Math.max(0, zoomStartIndex + pointsToMove)
        onPan(newStartIndex)
      }
    },
    [isPanning, panStartX, onPan, zoomStartIndex],
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  return {
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
