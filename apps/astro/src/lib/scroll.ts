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
