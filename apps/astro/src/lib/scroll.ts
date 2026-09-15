export const scrollToElement = (selector?: string) => {
  if (!selector) return
  const target = document.querySelector(selector)
  target?.scrollIntoView()
}

export const initScrollClicks = () => {
  document.addEventListener('click', ({ target }) => {
    if (!(target instanceof HTMLElement)) return
    if (target.closest('[data-scroll')) {
      const selector = target.dataset.scroll
      scrollToElement(selector)
    }
  })
}

export const initScrollHash = () => {
  const match = window.location.hash.match(/^#[a-zA-Z0-9-_]+/)
  const selector = match && match[0]

  if (selector) {
    scrollToElement(selector)
  }
}

export const initScrollButton = (buttonSelector: string) => {
  const targetSelector = '[data-scroll-view]'

  const target = document.querySelector(targetSelector)

  if (!target) {
    return
  }

  const sentinel = document.createElement('span')
  sentinel.classList.add('scroll-sentinel')
  target.prepend(sentinel)

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        button?.setAttribute('data-scroll', targetSelector)
      } else {
        button?.removeAttribute('data-scroll')
      }
    },
    {
      threshold: 0,
    },
  )

  observer.observe(sentinel)

  const button = document.querySelector<HTMLButtonElement>(buttonSelector)

  button?.setAttribute('data-scroll', targetSelector)
}
