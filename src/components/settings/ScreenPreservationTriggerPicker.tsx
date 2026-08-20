import { useEffect, useState } from 'react'
import type { ScreenPreservationTrigger } from '@/config/languages'

interface Props {
  value: ScreenPreservationTrigger
  onChange: (trigger: ScreenPreservationTrigger) => void
  onValidityChange: (isValid: boolean) => void
}

const HELP_TEXT = {
  cycles: 'Rest screen will be shown after this many complete language cycles.',
  minutes: 'Rest screen will be shown after this many minutes.',
} as const

function isValidPositiveWholeNumber(value: string): boolean {
  return /^[1-9]\d*$/.test(value)
}

export function ScreenPreservationTriggerPicker({ value, onChange, onValidityChange }: Props) {
  const [inputValue, setInputValue] = useState(String(value.value))
  const isValid = isValidPositiveWholeNumber(inputValue)
  const fieldLabel = value.type === 'cycles'
    ? 'Cycles before activation'
    : 'Minutes before activation'

  useEffect(() => {
    setInputValue(String(value.value))
  }, [value.type, value.value])

  useEffect(() => {
    onValidityChange(isValid)
  }, [isValid, onValidityChange])

  const selectType = (type: ScreenPreservationTrigger['type']) => {
    onChange({ type, value: value.value })
  }

  const updateValue = (nextValue: string) => {
    setInputValue(nextValue)
    if (isValidPositiveWholeNumber(nextValue)) {
      onChange({ type: value.type, value: Number(nextValue) })
    }
  }

  return (
    <fieldset className="screen-preservation-trigger">
      <legend className="settings-field-label">Rest Screen Frequency</legend>
      <p className="trigger-intro">Choose a method for when the rest screen starts.</p>

      <div className="trigger-options">
        <label className="trigger-option">
          <input
            type="radio"
            name="screen-preservation-trigger"
            checked={value.type === 'cycles'}
            onChange={() => selectType('cycles')}
          />
          <span>After X cycles</span>
        </label>
        <label className="trigger-option">
          <input
            type="radio"
            name="screen-preservation-trigger"
            checked={value.type === 'minutes'}
            onChange={() => selectType('minutes')}
          />
          <span>After X minutes</span>
        </label>
      </div>

      <label className="trigger-value-label" htmlFor="screen-preservation-trigger-value">
        {fieldLabel}
      </label>
      <input
        id="screen-preservation-trigger-value"
        className="trigger-value-input"
        type="number"
        min="1"
        step="1"
        inputMode="numeric"
        value={inputValue}
        onChange={(event) => updateValue(event.target.value)}
        aria-describedby="screen-preservation-trigger-help screen-preservation-trigger-error"
        aria-invalid={!isValid}
      />
      <p id="screen-preservation-trigger-help" className="trigger-help">
        {HELP_TEXT[value.type]}
      </p>
      {!isValid && (
        <p id="screen-preservation-trigger-error" className="trigger-error" role="alert">
          Enter a whole number greater than zero.
        </p>
      )}
    </fieldset>
  )
}