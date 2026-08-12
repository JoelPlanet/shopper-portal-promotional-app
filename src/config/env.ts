export const ENV = {
  pinHash: (() => {
    const value = import.meta.env.VITE_PIN_HASH
    if (!value) {
      throw new Error(
        'VITE_PIN_HASH is not set. ' +
          'Add it to .env.local: VITE_PIN_HASH=<sha256 of your 4-digit PIN>',
      )
    }
    return value
  })(),
} as const
