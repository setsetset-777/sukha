const nextTargetSelector = '[data-scroll-view="next"]'
const scrollNextDataAttribute = 'data-scroll-next'

export const scrollToElement = (selector?: string | Element) => {
  if (!selector) return
  const target = selector instanceof Element ? selector : document.querySelector(selector)
  target?.scrollIntoView({ behavior: 'smooth' })
}

const getNextElement = (selector?: string) => {
  if (!selector) return
  const viewportTop = 49
  const elements = document.querySelectorAll(selector)

  const next =
    [...elements]
      .filter((el) => el.getBoundingClientRect().top >= viewportTop)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0] ?? null
  return next
}

export const initScrollClicks = () => {
  document.addEventListener('click', ({ target }) => {
    if (
      !(target instanceof HTMLElement) ||
      !target.dataset.scroll ||
      !target.closest('[data-scroll]')
    )
      return
    const element = document.querySelector(target.dataset.scroll)

    if (!element) {
      return
    }
    scrollToElement(element)
  })
}

export const initScrollHash = () => {
  const match = window.location.hash.match(/^#[a-zA-Z0-9-_]+/)
  const selector = match && match[0]

  if (selector) {
    scrollToElement(selector)
  }
}

export const initScrollNextButton = (buttonSelector: string) => {
  const targets = document.querySelectorAll(nextTargetSelector)

  if (targets.length <= 0) {
    return
  }

  const button = document.querySelector<HTMLButtonElement>(buttonSelector)

  const showButton = () => {
    button?.setAttribute(scrollNextDataAttribute, nextTargetSelector)
  }
  const hideButton = () => button?.removeAttribute(scrollNextDataAttribute)

  const sentinel = document.createElement('span')
  sentinel.classList.add('scroll-sentinel')
  targets.forEach((el) => el.prepend(sentinel))

  const footer = document.querySelector('footer.footer')

  const sentinelObserver = new IntersectionObserver(
    (entries) => {
      const sentinelEntry = entries.find((entry) => entry.target === sentinel)
      const footerEntry = entries.find((entry) => entry.target === footer)

      const sentinelAboveViewport =
        sentinelEntry && !sentinelEntry.isIntersecting && sentinelEntry.boundingClientRect.y < 0

      const footerVisible = footerEntry?.isIntersecting

      if (sentinelAboveViewport || footerVisible) {
        hideButton()
      } else {
        showButton()
      }
    },
    {
      threshold: 0,
    },
  )

  sentinelObserver.observe(sentinel)

  if (footer) {
    sentinelObserver.observe(footer)
  }

  initScrollNextClicks()
}

export const initScrollNextClicks = () => {
  document.addEventListener('click', ({ target }) => {
    if (!(target instanceof HTMLElement)) return
    const closest = target.closest(`[${scrollNextDataAttribute}]`)
    if (!closest) return
    const element = getNextElement(nextTargetSelector)
    scrollToElement(element)
  })
}
