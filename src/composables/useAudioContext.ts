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
  const bufferSource = shallowRef<AudioBufferSourceNode>()
  const mediaElementSource = shallowRef<MediaElementAudioSourceNode>()
  const mediaStreamSource = shallowRef<MediaStreamAudioSourceNode>()
  const gainNode = audioContext.createGain()
  const analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 2048
  const bufferLength = analyserNode.frequencyBinCount
  const unit8Array = new Uint8Array(bufferLength)

  gainNode.connect(audioContext.destination)

  const status = ref<AudioContextState>(audioContext.state)
  audioContext.addEventListener('statechange', () => {
    status.value = audioContext.state
  })
  const playing = ref(false)

  const startFlag = ref(0)
  const pauseFlag = ref(0)

  const currentTimeRaw = ref(0)
  const currentTime = computed(() => formatTime(currentTimeRaw.value))

  const durationRaw = ref(0)
  const duration = computed(() => formatTime(durationRaw.value))

  const progress = computed(() => (currentTimeRaw.value / durationRaw.value) * 100)

  const volume = ref(gainNode.gain.value)
  watch(volume, (val) => {
    gainNode.gain.value = val
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

  let _onByteTimeDomainDataFn: ((array: Uint8Array<ArrayBuffer>) => void) | null = null
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

  function decodeAudioData(arrayBuffer: Uint8Array<ArrayBuffer>) {
    return audioContext.decodeAudioData(arrayBuffer.buffer)
  }
  function updateDuration() {
    const _currentTime = audioContext.currentTime - startFlag.value
    if (_currentTime >= durationRaw.value) {
      return
    }
    currentTimeRaw.value = _currentTime
    requestAnimationFrame(updateDuration)
  }

  async function playBufferSource(arrayBuffer: Uint8Array<ArrayBuffer>) {
    bufferSource.value = audioContext.createBufferSource()
    const audioBuffer = await decodeAudioData(arrayBuffer)
    bufferSource.value.buffer = audioBuffer
    bufferSource.value.connect(gainNode).connect(analyserNode)
    bufferSource.value.start(0)

    playing.value = true

    durationRaw.value = audioBuffer.duration
    startFlag.value = audioContext.currentTime

    updateDuration()

    bufferSource.value.addEventListener('ended', () => {
      playing.value = false
    }, { once: true })
  }

  async function playMediaElementSource(mediaElement: HTMLMediaElement) {
    mediaElementSource.value = audioContext.createMediaElementSource(mediaElement)
    mediaElementSource.value.connect(gainNode)
    mediaElementSource.value.mediaElement.play()

    playing.value = true

    durationRaw.value = mediaElement.duration
    startFlag.value = audioContext.currentTime

    updateDuration()

    mediaElementSource.value.mediaElement.addEventListener('ended', () => {
      playing.value = false
    }, { once: true })
  }

  async function playMediaStreamSource(mediaStream: MediaStream) {
    mediaStreamSource.value = audioContext.createMediaStreamSource(mediaStream)
    mediaStreamSource.value.connect(gainNode)
  }

  async function play(_source: Uint8Array<ArrayBuffer> | HTMLMediaElement | MediaStream) {
    if (_source instanceof Uint8Array) {
      await playBufferSource(_source)
    }
    if (_source instanceof HTMLMediaElement) {
      await playMediaElementSource(_source)
    }
    if (_source instanceof MediaStream) {
      await playMediaStreamSource(_source)
    }
  }
  function pause() {
    audioContext.suspend()
    pauseFlag.value = audioContext.currentTime - startFlag.value
    playing.value = false
  }

  function resume() {
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
  }
  return {
    audioContext,
    bufferSource,
    mediaElementSource,
    mediaStreamSource,
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
    progress,
    volume,
    loop,
    detune,
    playbackRate,
    decodeAudioData,
    updateDuration,
    playBufferSource,
    playMediaElementSource,
    playMediaStreamSource,
    play,
    pause,
    resume,
    stop,
    onByteTimeDomainData: (fn: (array: Uint8Array<ArrayBuffer>) => void) => {
      _onByteTimeDomainDataFn = fn
    },
  }
}
