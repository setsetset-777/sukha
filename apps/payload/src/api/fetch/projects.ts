import type * as API from '@app/api/types'
import { LocaleCode } from '@/types'
import { getProjectListData } from '../data/project-list'

export const fetchProjects = async ({
  locale,
  params,
}: {
  locale: LocaleCode
  params: API.Projects.SearchParams
}): Promise<API.Projects.List> => {
  return getProjectListData({ params, locale })
}
