let bgm: HTMLAudioElement | null = null
let hasStartedAudible = false

const BGM_SRC = '/music/The_Earnest_Star.mp3'
const BGM_TARGET_VOLUME = 0.4
const BGM_FADE_RATE = 0.15

export function unlockBgm() {
  if (bgm) return

  bgm = new Audio(BGM_SRC)
  bgm.loop = true
  bgm.volume = 0
  bgm.play().catch((err) => {
    console.error(err.name, err.message)

    if (err.name === 'NotAllowedError') {
      bgm = null
    }
  })
}

export function updateBgm(dt: number) {
  if (!bgm) return

  if (!hasStartedAudible) {
    hasStartedAudible = true
    bgm.currentTime = 0
  }

  bgm.volume = Math.min(BGM_TARGET_VOLUME, bgm.volume + BGM_FADE_RATE * dt)
}
