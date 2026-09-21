let audioCtx: AudioContext | null = null
let bgmBuffer: AudioBuffer | null = null
let gainNode: GainNode | null = null
let bgmSource: AudioBufferSourceNode | null = null
let hasStartedAudible = false

const BGM_SRC = '/music/The_Earnest_Star.mp3'
const BGM_TARGET_VOLUME = 0.4
const BGM_FADE_RATE = 0.15

async function loadBgm() {
  if (bgmBuffer) return
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext
  audioCtx = new AudioContextClass()

  const response = await fetch(BGM_SRC)
  const arrayBuffer = await response.arrayBuffer()
  bgmBuffer = await audioCtx.decodeAudioData(arrayBuffer)
}

export async function unlockBgm() {
  if (!audioCtx || !bgmBuffer) {
    await loadBgm()
  }

  if (audioCtx?.state === 'suspended') {
    await audioCtx.resume()
  }
}

export function updateBgm(dt: number) {
  if (!audioCtx || !bgmBuffer) return

  if (!hasStartedAudible) {
    hasStartedAudible = true

    bgmSource = audioCtx.createBufferSource()
    bgmSource.buffer = bgmBuffer
    bgmSource.loop = true

    gainNode = audioCtx.createGain()

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime)

    bgmSource.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    bgmSource.start(0)
  }

  if (gainNode) {
    const currentVolume = gainNode.gain.value
    if (currentVolume < BGM_TARGET_VOLUME) {
      const nextVolume = Math.min(
        BGM_TARGET_VOLUME,
        currentVolume + BGM_FADE_RATE * dt,
      )
      gainNode.gain.setValueAtTime(nextVolume, audioCtx.currentTime)
    }
  }
}
