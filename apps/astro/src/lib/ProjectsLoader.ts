import apiConfig from '@app/api/config'
import { getClientLocale } from '@app/api/i18n'

type State = 'idle' | 'loading' | 'empty' | 'loading-more'

export default class ProjectsLoader {
  element: HTMLElement
  listElement: HTMLElement | null
  activeTags: string[] = []
  page: number = 1
  limit: number = apiConfig.projectsLimit
  searchParams: URLSearchParams
  html: string | null = null
  controller: AbortController | null = null
  timeout: NodeJS.Timeout | null = null
  itemSelector = '[data-project-list-item]'
  listSelector = '[data-projects-loader-list]'
  moreSelector = '[data-projects-loader-more]'
  paramName = 'tag'
  loadDelay = 150

  constructor({ element, paramName }: { element: HTMLElement; paramName?: string }) {
    if (!element) {
      throw new Error('ProjectsLoader: Element not found')
    }

    this.element = element
    if (paramName) this.paramName = paramName

    this.listElement = this.element.querySelector(this.listSelector)
    this.searchParams = new URLSearchParams()
  }

  init() {
    document.addEventListener('click', async (e) => {
      if (!(e.target instanceof HTMLElement)) return
      if (e.target.closest(this.moreSelector)) {
        this.page += 1
        await this.fetch({ append: true, isMore: true })
        window.scrollTo({ behavior: 'smooth', top: window.scrollY + window.innerHeight / 2 })
      }
    })
  }

  prepareParams() {
    const params = new URLSearchParams()

    if (typeof this.page === 'number') {
      params.set('page', String(this.page))
    }

    if (typeof this.limit === 'number') {
      params.set('limit', String(this.limit))
    }

    params.delete(this.paramName)
    this.activeTags.forEach((item) => params.append(this.paramName, item))

    this.searchParams = params
  }

  load(isMore?: boolean) {
    this.element.setAttribute('aria-busy', 'true')
    this.state = isMore ? 'loading-more' : 'loading'
    this.more = false
  }

  unload() {
    this.element.setAttribute('aria-busy', 'false')
    this.state = 'idle'
  }

  resetPage() {
    this.page = 1
  }

  appendContent(html: string) {
    if (!this.listElement) return

    const lastItem = this.listElement.querySelector(`${this.itemSelector}:last-of-type`)
    if (lastItem) {
      lastItem.insertAdjacentHTML('afterend', html)
    } else {
      this.listElement.insertAdjacentHTML('afterbegin', html)
    }
  }

  replaceContent(html: string) {
    if (!this.listElement) return

    Array.from(this.listElement.querySelectorAll(`${this.itemSelector}`)).forEach((element) =>
      element.remove(),
    )

    this.listElement.insertAdjacentHTML('afterbegin', html)
  }

  async fetch({
    tags,
    append = false,
    isMore,
  }: { tags?: string[]; append?: boolean; isMore?: boolean } = {}) {
    if (!this.listElement) return

    if (tags) {
      this.activeTags = tags
      this.resetPage()
    }
    this.controller?.abort()
    this.controller = new AbortController()

    this.prepareParams()

    let response: Response

    this.timeout = setTimeout(() => {
      this.load(isMore)
    }, 150)

    try {
      const params = this.searchParams
      const locale = getClientLocale()
      params.set('locale', locale.code)

      response = await fetch(`/q/projects?${params?.toString()}`, {
        signal: this.controller.signal,
      })

      await new Promise((resolve) => setTimeout(resolve, this.loadDelay))

      if (!response.ok) {
        throw new Error('ProjectsLoader: Failed to load projects')
      }

      const html = await response.text()
      const totalDocs = Number(response.headers.get('Total-Docs') ?? 0)
      const totalPages = Number(response.headers.get('Total-Pages') ?? 0)
      this.more = response.headers.get('Has-More') === 'true'

      if (totalDocs <= 0) {
        this.state = 'empty'
      } else {
        if (append) {
          this.appendContent(html)
        } else {
          this.replaceContent(html)
        }
        this.state = 'idle'
      }

      if (this.page > totalPages) {
        this.page = totalPages
      }

      this.onChange()
    } catch (err) {
      this.state = 'idle'
      if (err instanceof DOMException && err.name === 'AbortError') return null
      throw err
    } finally {
      clearTimeout(this.timeout)
      this.unload()
    }
  }

  pushHistory() {
    const url = new URL(window.location.href)
    const params = new URLSearchParams()
    this.activeTags.forEach((item) => params.append(this.paramName, item))
    url.search = params.toString()

    window.history.pushState({ url: url.toString() }, '', url.toString())
  }

  onChange() {
    document.dispatchEvent(new CustomEvent('images:load'))
    this.pushHistory()
  }

  private set state(state: State) {
    this.element.dataset.state = state
  }

  set more(more: boolean) {
    if (more) {
      this.element.dataset.more = 'true'
    } else {
      delete this.element.dataset.more
    }
  }
}
