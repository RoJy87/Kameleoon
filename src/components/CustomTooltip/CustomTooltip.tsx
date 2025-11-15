import React from 'react'
import styles from './CustomTooltip.module.css'

interface TooltipPayload {
  color: string
  name: string
  value: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const filteredPayload = payload.filter((p) => !p.name.endsWith('-shadow'))
    const maxValue = Math.max(...filteredPayload.map((p) => p.value))

    return (
      <div className={styles.customTooltip}>
        <div className={styles.labelContainer}>
          <span role="img" aria-label="calendar-icon">
            📅
          </span>
          <p className={styles.label}>{label}</p>
        </div>
        <hr className={styles.divider} />
        {filteredPayload.map((entry: TooltipPayload, index: number) => {
          const isMax = entry.value === maxValue && filteredPayload.length > 1
          return (
            <div key={`item-${index}`} className={styles.tooltipItem}>
              <span
                className={styles.tooltipColor}
                style={{
                  backgroundColor: entry.color,
                }}
              />
              <span className={styles.tooltipItemLabel}>
                {entry.name}
                {isMax && <span className={styles.trophy}> 🏆</span>}
              </span>
              <span className={styles.tooltipItemValue}>{entry.value}%</span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

export default CustomTooltip
