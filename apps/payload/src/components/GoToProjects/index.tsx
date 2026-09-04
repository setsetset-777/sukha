import { CustomTFunction } from '@/i18n'
import { Link } from '@payloadcms/ui'
import { ServerComponentProps } from 'payload'

export default function GoToProjects({ i18n }: ServerComponentProps) {
  const t = i18n.t as CustomTFunction
  return (
    <div>
      <Link href="/collections/projects">{t('pageHome:adminProjectLinkLabel')}</Link>
    </div>
  )
}
