const MIN_SECONDS = 5

interface Props {
  value: number
  onChange: (seconds: number) => void
  label?: string
  inputLabel?: string
  decreaseLabel?: string
  increaseLabel?: string
  minSeconds?: number
  maxSeconds?: number
}

export function RotationIntervalPicker({
  value,
  onChange,
  label = 'Language Display Duration',
  inputLabel = 'Rotation interval in seconds',
  decreaseLabel = 'Decrease interval',
  increaseLabel = 'Increase interval',
  minSeconds = MIN_SECONDS,
  maxSeconds,
}: Props) {
  const clamp = (seconds: number) => {
    const steppedValue = Math.round(seconds / 5) * 5
    return Math.min(maxSeconds ?? Infinity, Math.max(minSeconds, steppedValue))
  }

  return (
    <fieldset className="interval-picker">
      <legend className="settings-field-label">{label}</legend>
      <div className="interval-controls">
        <button
          type="button"
          className="interval-btn"
          onClick={() => onChange(clamp(value - 5))}
          aria-label={decreaseLabel}
          disabled={value <= minSeconds}
        >
          −
        </button>
        <input
          type="number"
          className="interval-input"
          value={value}
          min={minSeconds}
          max={maxSeconds}
          step="5"
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          onBlur={(e) => onChange(clamp(Number(e.target.value)))}
          aria-label={inputLabel}
        />
        <button
          type="button"
          className="interval-btn"
          onClick={() => onChange(clamp(value + 5))}
          aria-label={increaseLabel}
          disabled={maxSeconds !== undefined && value >= maxSeconds}
        >
          +
        </button>
        <span className="interval-unit">seconds</span>
      </div>
      {value <= minSeconds && (
        <p className="interval-note">Minimum display time is {minSeconds} seconds</p>
      )}
    </fieldset>
  )
}
