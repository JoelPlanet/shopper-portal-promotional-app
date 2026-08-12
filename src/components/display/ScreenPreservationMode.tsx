import './ScreenPreservationMode.css'

interface Props {
  isActive: boolean
}

export function ScreenPreservationMode({ isActive }: Props) {
  return (
    <div
      className={`screen-preservation${isActive ? ' screen-preservation--active' : ''}`}
      aria-hidden={!isActive}
    >
      <img
        className="screen-preservation__logo"
        src="/assets/tax-free-from-planet.svg"
        alt="Tax Free from Planet"
      />
    </div>
  )
}