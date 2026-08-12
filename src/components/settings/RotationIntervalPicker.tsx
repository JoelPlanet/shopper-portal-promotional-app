const MIN_SECONDS = 5

interface Props {
  value: number
  onChange: (seconds: number) => void
}

export function RotationIntervalPicker({ value, onChange }: Props) {
  const clamp = (n: number) => Math.max(MIN_SECONDS, Math.round(n))

  return (
    <fieldset className="interval-picker">
      <legend className="settings-field-label">Rotation interval</legend>
      <div className="interval-controls">
        <button
          type="button"
          className="interval-btn"
          onClick={() => onChange(clamp(value - 5))}
          aria-label="Decrease interval"
          disabled={value <= MIN_SECONDS}
        >
          −
        </button>
        <input
          type="number"
          className="interval-input"
          value={value}
          min={MIN_SECONDS}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          onBlur={(e) => onChange(clamp(Number(e.target.value)))}
          aria-label="Rotation interval in seconds"
        />
        <button
          type="button"
          className="interval-btn"
          onClick={() => onChange(clamp(value + 5))}
          aria-label="Increase interval"
        >
          +
        </button>
        <span className="interval-unit">seconds</span>
      </div>
      {value <= MIN_SECONDS && (
        <p className="interval-note">Minimum interval is {MIN_SECONDS} seconds</p>
      )}
    </fieldset>
  )
}
