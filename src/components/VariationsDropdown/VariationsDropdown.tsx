import React, { useState, useRef, useEffect } from 'react'
import { ChartVariation } from '../../utils/dataProcessor'
import styles from './VariationsDropdown.module.css'

interface VariationsDropdownProps {
  variations: ChartVariation[]
  selectedVariations: string[]
  onChange: (selected: string[]) => void
}

const VariationsDropdown: React.FC<VariationsDropdownProps> = ({ variations, selectedVariations, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (variationId: string) => {
    const newSelected = selectedVariations.includes(variationId)
      ? selectedVariations.filter((id) => id !== variationId)
      : [...selectedVariations, variationId]

    if (newSelected.length > 0) {
      onChange(newSelected)
    }
  }

  const getDisplayText = () => {
    if (selectedVariations.length === 0) return 'Select variations...'
    if (selectedVariations.length === 1) {
      const variation = variations.find((v) => v.id === selectedVariations[0])
      return variation?.name || 'Select variations...'
    }
    return `${selectedVariations.length} selected`
  }

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <span>{getDisplayText()}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {variations.map((variation) => (
            <label key={variation.id} className={styles.option}>
              <input
                type='checkbox'
                checked={selectedVariations.includes(variation.id)}
                onChange={() => handleToggle(variation.id)}
              />
              <span>{variation.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default VariationsDropdown
