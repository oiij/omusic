interface Options {
  type?: 'bars' | 'circle'
  quantity?: number
  colors?: string[]
  maxHeight?: number
}
export function useAudioVisualization(options?: Options) {
  const {
    type = 'bars',
    quantity = 64,
    colors = ['rgba(0,0,0,.2)'],
    maxHeight = 0.8,
  } = options ?? {}
  const domRef = ref<HTMLElement>()
  const { width, height } = useElementSize(domRef)
  const canRender = computed(() => width.value > 0 && height.value > 0)
  const canvas = shallowRef<HTMLCanvasElement>()
  const smoothData = ref(Array.from<number>({ length: quantity }).fill(0))

  function render() {
    if (domRef.value && canRender.value) {
      if (!canvas.value) {
        canvas.value = document.createElement('canvas')
        domRef.value.appendChild(canvas.value)
      }
      canvas.value.width = width.value
      canvas.value.height = height.value
    }
  }
  onMounted(() => {
    render()
  })
  watch(() => [width.value, height.value], () => {
    render()
  })
  onBeforeUnmount(() => {
    if (canvas.value) {
      domRef.value?.removeChild(canvas.value)
      canvas.value = undefined
    }
  })
  function drawBars() {
    if (!canvas.value)
      return
    const ctx = canvas.value.getContext('2d')
    if (!ctx)
      return
    const width = canvas.value.width
    const height = canvas.value.height
    const barWidth = width / smoothData.value.length

    smoothData.value.forEach((value, i) => {
      const barHeight = (value / 255) * height * maxHeight
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
      gradient.addColorStop(0, colors[i % colors.length])
      gradient.addColorStop(1, colors[(i + 1) % colors.length])

      ctx.fillStyle = gradient
      ctx.fillRect(
        i * barWidth,
        height - barHeight,
        barWidth * 0.8,
        barHeight,
      )
    })
  }
  function drawCircle() {
    if (!canvas.value)
      return
    const ctx = canvas.value.getContext('2d')
    if (!ctx)
      return

    const width = canvas.value.width
    const height = canvas.value.height

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.4

    ctx.save()
    ctx.translate(centerX, centerY)

    smoothData.value.forEach((value, i) => {
      const angle = (i * Math.PI * 2) / smoothData.value.length
      const barLength = (value / 255) * radius

      ctx.strokeStyle = colors[i % colors.length]
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, barLength, angle, angle + 0.1)
      ctx.stroke()
    })

    ctx.restore()
  }

  function update(frequencyData: Uint8Array) {
    if (!canvas.value)
      return
    const ctx = canvas.value.getContext('2d')
    if (!ctx)
      return
    const width = canvas.value.width
    const height = canvas.value.height

    ctx.clearRect(0, 0, width, height)
    // 平滑过渡
    smoothData.value = smoothData.value.map((v, i) =>
      v + (frequencyData[i] - v) * 0.3,
    )

    switch (type) {
      case 'circle':
        drawCircle()
        break
      case 'bars':
        drawBars()
        break
    }
  }
  return {
    domRef,
    update,
  }
}
