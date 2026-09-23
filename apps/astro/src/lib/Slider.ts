class Slider extends EventTarget {
  duration = 3000
  #current = 0
  timeout: NodeJS.Timeout | undefined
  element: HTMLElement | null = null
  elementSelector = '[data-slider]'
  itemSelector = '[data-slider-item]'
  cardSelector = '[data-slider-card]'
  controlSelector = '[data-slider-control]'
  prevSelector = '[data-slider-prev]'
  nextSelector = '[data-slider-next]'
  pauseSelector = '[data-slider-pause]'
  gotoAttribute = 'data-slider-goto'
  activeAttribute = 'data-slider-active'
  slides: NodeListOf<HTMLElement> | null = null
  cards: NodeListOf<HTMLElement> | null = null
  controls: NodeListOf<HTMLElement> | null = null

  constructor() {
    super()
  }

  launch() {
    this.current = 0

    this.element = document.querySelector(this.elementSelector)

    if (!this.element) {
      console.error('Slider: no slider element found')
      return
    }

    this.slides = this.element?.querySelectorAll(this.itemSelector)
    this.controls = this.element?.querySelectorAll(this.controlSelector)
    this.cards = this.element?.querySelectorAll(this.cardSelector)

    this.initEvents()
    this.activate()
  }

  initEvents() {
    this.element?.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return

      if (event.target.closest(`[${this.gotoAttribute}]`)) {
        this.current = Number(event.target.getAttribute(this.gotoAttribute))
      }

      if (event.target.closest(this.prevSelector)) {
        this.previous()
      }

      if (event.target.closest(this.nextSelector)) {
        this.next()
      }
    })

    this.element?.addEventListener('mouseover', (event) => {
      if (!(event.target instanceof Element)) return

      if (event.target.closest(this.pauseSelector)) {
        this.stop()
      }
    })

    this.element?.addEventListener('mouseout', (event) => {
      if (!(event.target instanceof Element)) return

      if (event.target.closest(this.pauseSelector)) {
        this.start()
      }
    })
  }

  start() {
    this.stop()

    this.timeout = setTimeout(() => this.next(), this.duration)
  }

  stop() {
    clearTimeout(this.timeout)
  }

  next() {
    this.current = this.current + 1
  }

  previous() {
    this.current -= 1
  }

  activate = () => {
    document.querySelectorAll<HTMLElement>(`[${this.activeAttribute}]`).forEach((item) => {
      const isActive = item.matches(`[${this.activeAttribute}]:nth-of-type(${this.current + 1})`)
      item.setAttribute(this.activeAttribute, isActive ? 'true' : 'false')

      const isAriable = item.hasAttribute('data-slider-ariable')

      if (isAriable) {
        item.inert = !isActive
        item.setAttribute('aria-hidden', isActive ? 'false' : 'true')
      }
    })

    this.start()
  }

  private set current(index: number) {
    const isLast = this.slides && index >= this.slides.length
    const isFirst = index < 0

    if (isLast) {
      this.#current = 0
    } else if (isFirst) {
      this.#current = this.slides ? this.slides.length - 1 : 0
    } else {
      this.#current = index
    }

    this.activate()
    this.dispatchEvent(
      new CustomEvent<SliderChangeDetail>('change', { detail: { current: this.#current } }),
    )
  }

  private get current(): number {
    return this.#current
  }
}

export default Slider

export interface SliderChangeDetail {
  current: number
}
