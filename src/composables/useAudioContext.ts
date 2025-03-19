function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
interface Options {
  analyser?: boolean
}
export function useAudioContext(options?: Options) {
  const { analyser = false } = options ?? {}
  const audioContext = new AudioContext()
  const audioBuffer = shallowRef<AudioBuffer>()
  const bufferSource = shallowRef<AudioBufferSourceNode>()
  const mediaElementSource = shallowRef<MediaElementAudioSourceNode>()
  const mediaStreamSource = shallowRef<MediaStreamAudioSourceNode>()
  const gainNode = audioContext.createGain()
  const analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 2048
  const bufferLength = analyserNode.frequencyBinCount
  const unit8Array = new Uint8Array(bufferLength)

  gainNode.connect(analyserNode).connect(audioContext.destination)

  const status = ref<AudioContextState>(audioContext.state)
  audioContext.addEventListener('statechange', () => {
    status.value = audioContext.state
  })
  const playing = ref(false)
  const ended = ref(false)

  const startFlag = ref(0)
  const pauseFlag = ref(0)

  const currentTimeRaw = ref(0)
  const currentTime = computed(() => formatTime(currentTimeRaw.value))

  const durationRaw = ref(0)
  const duration = computed(() => formatTime(durationRaw.value))

  const progressRaw = ref(0)
  const progress = computed(() => Number(progressRaw.value.toFixed(0)))

  const volume = ref(gainNode.gain.value * 100)
  watch(volume, (val) => {
    gainNode.gain.value = val / 100
  })

  const loop = ref(bufferSource.value?.loop ?? false)
  watch(loop, (val) => {
    if (bufferSource.value)
      bufferSource.value.loop = val
  })

  const detune = ref(bufferSource.value?.detune.defaultValue ?? 0) // 音调
  watch(detune, (val) => {
    if (bufferSource.value)
      bufferSource.value.detune.value = val
  })

  const playbackRate = ref(bufferSource.value?.playbackRate.defaultValue ?? 1) // 播放速率
  watch(playbackRate, (val) => {
    if (bufferSource.value)
      bufferSource.value.playbackRate.value = val
  })

  let _onByteTimeDomainDataFn: ((array: Uint8Array) => void) | null = null
  function getByteTimeDomainData() {
    analyserNode.getByteTimeDomainData(unit8Array)
    if (typeof _onByteTimeDomainDataFn === 'function') {
      _onByteTimeDomainDataFn(unit8Array)
    }
    requestAnimationFrame(getByteTimeDomainData)
  }
  if (analyser) {
    getByteTimeDomainData()
  }

  function updateDuration() {
    const _currentTime = audioContext.currentTime - startFlag.value
    if (_currentTime >= durationRaw.value) {
      playing.value = false
      ended.value = true
      return
    }
    currentTimeRaw.value = _currentTime
    progressRaw.value = (_currentTime / durationRaw.value) * 100
    requestAnimationFrame(updateDuration)
  }

  function createBufferSource(audioBuffer: AudioBuffer) {
    const bufferSource = audioContext.createBufferSource()
    bufferSource.buffer = audioBuffer
    bufferSource.connect(gainNode)
    return bufferSource
  }

  function setProgress(val: number) {
    if (audioBuffer.value) {
      const targetDuration = val / 100 * durationRaw.value
      bufferSource.value?.stop()
      bufferSource.value = createBufferSource(audioBuffer.value)
      bufferSource.value.start(0, targetDuration)
      startFlag.value = audioContext.currentTime - targetDuration
      if (!playing.value) {
        pauseFlag.value = audioContext.currentTime - startFlag.value
      }
    }
  }

  async function playBuffer(arrayBuffer: Uint8Array) {
    audioBuffer.value = await audioContext.decodeAudioData(arrayBuffer.buffer as unknown as ArrayBuffer)
    play()
  }
  function play() {
    if (audioBuffer.value) {
      bufferSource.value?.stop()
      bufferSource.value = createBufferSource(audioBuffer.value)
      bufferSource.value.start(0)

      playing.value = true
      ended.value = false

      durationRaw.value = audioBuffer.value.duration
      startFlag.value = audioContext.currentTime

      updateDuration()

      // bufferSource.value.addEventListener('ended', () => {
      //   playing.value = false
      // }, { once: true })
    }
  }
  function pause() {
    audioContext.suspend()
    pauseFlag.value = audioContext.currentTime - startFlag.value
    playing.value = false
  }

  function resume() {
    if (ended.value) {
      play()
      return
    }
    audioContext.resume()
    startFlag.value = audioContext.currentTime - pauseFlag.value
    playing.value = true
  }

  function stop() {
    bufferSource.value?.stop()
    pauseFlag.value = 0
    startFlag.value = 0
    currentTimeRaw.value = 0
    playing.value = false
    ended.value = true
  }
  function dispose() {
    stop()
    bufferSource.value = undefined
    mediaElementSource.value = undefined
    mediaStreamSource.value = undefined
    audioContext.close()
  }

  return {
    audioContext,
    bufferSource,
    gainNode,
    analyserNode,
    status,
    playing,
    startFlag,
    pauseFlag,
    currentTimeRaw,
    currentTime,
    durationRaw,
    duration,
    progressRaw,
    progress,
    setProgress,
    volume,
    loop,
    detune,
    playbackRate,
    updateDuration,
    playBuffer,
    play,
    pause,
    resume,
    stop,
    onByteTimeDomainData: (fn: (array: Uint8Array) => void) => {
      _onByteTimeDomainDataFn = fn
    },
    dispose,
  }
}
