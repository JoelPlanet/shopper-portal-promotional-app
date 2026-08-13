import './ScreenPreservationMode.css'

interface Props {
  isActive: boolean
  isPeriodic?: boolean
}

export function ScreenPreservationMode({ isActive, isPeriodic = false }: Props) {
  return (
    <div
      className={`screen-preservation${isActive ? ' screen-preservation--active' : ''}${isPeriodic ? ' screen-preservation--periodic' : ''}`}
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