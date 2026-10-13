export default class Sidebar {
  menuItemSelector = '[data-menu-item]'
  sidebarSelector = '[data-sidebar]'
  switchSelector = '[data-sidebar-switch]'
  activeItemClass = 'active'
  body: HTMLBodyElement | null = null
  element: HTMLElement | null = null
  scrollPosition: number = 0
  scrollTicking = false
  scrollDirection: 'north' | 'south' | null = null
  scrollDistance = 0
  scrollHeroTreshold = 0
  scrollTreshold = 25

  constructor() {}

  public initOnce() {
    this.initOnLoad()

    this.initScroll()
  }

  public initOnLoad() {
    this.body = document.querySelector('body')
    this.element = document.querySelector<HTMLElement>(this.sidebarSelector)

    if (!this.element) {
      throw new Error('Sidebar: no element found')
    }
  }

  initScroll() {
    const height = document.querySelector('#sidebar')?.getBoundingClientRect().height ?? 0
    this.scrollHeroTreshold = height + 64

    document.addEventListener('scroll', () => {
      if (!this.scrollTicking) {
        requestAnimationFrame(() => {
          this.updateScroll()
          this.scrollTicking = false
        })

        this.scrollTicking = true
      }
    })
  }

  updateScroll() {
    if (!this.element) {
      return
    }
    const position = window.scrollY || document.documentElement.scrollTop

    if (position < this.scrollHeroTreshold) {
      this.element.dataset.slideReady = 'false'
      this.element.dataset.slideOut = 'false'
      this.scrollDistance = 0
      return
    }

    this.element.dataset.slideReady = 'true'

    const delta = position - this.scrollPosition

    if (Math.abs(delta) > 1) {
      const direction = delta > 0 ? 'south' : 'north'

      if (direction !== this.scrollDirection) {
        this.scrollDistance = 0
        this.scrollDirection = direction
      }

      this.scrollDistance += Math.abs(delta)

      if (this.scrollDistance >= this.scrollTreshold) {
        this.element.dataset.slideOut = direction === 'south' ? 'true' : 'false'
        this.scrollDistance = 0
      }

      this.scrollPosition = position
    }
  }
}
