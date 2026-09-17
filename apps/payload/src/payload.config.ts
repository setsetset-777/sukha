import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Projects } from '@/collections/Projects'
import { Partners } from '@/collections/Partners'
import { ProjectTags } from '@/collections/ProjectTags'
import { ProjectSpecs } from '@/collections/ProjectSpecs'

import { General } from '@/globals/General'
import { PageHome } from '@/globals/PageHome'
import { PageAgency } from '@/globals/PageAgency'
import { PageProjects } from '@/globals/PageProjects'
import { PageContact } from '@/globals/PageContact'

import { customTranslations } from '@/i18n'
import { localization } from '@app/api/i18n'
import regenerateMedia from '@/helpers/regenerateMedia'

import { fetchPage } from '@/api/fetch/page'
import { fetchGeneral } from '@/api/fetch/general'

import { LocaleCode } from '@/types'
import safeProjectsParams from '@/helpers/safeProjectsParams'
import { invalidateAll } from '@/helpers/cache'
import { fetchProjects } from './api/fetch/projects'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isDev = process.env.NODE_ENV === 'development'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin: isDev
      ? {
          email: process.env.ADMIN_EMAIL,
        }
      : false,
    components: {
      settingsMenu: ['@/components/InvalidateCache'],
    },
  },
  i18n: {
    supportedLanguages: { en, fr },
    translations: customTranslations,
  },
  localization: {
    ...localization,
    fallback: true,
  },
  globals: [General, PageHome, PageAgency, PageProjects, PageContact],
  collections: [Users, Media, Projects, Partners, ProjectTags, ProjectSpecs],
  routes: {
    admin: '/',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['projects'],
      globals: ['pageHome', 'pageAgency', 'pageContact', 'pageProjects'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `[BRand]. — ${doc.title}`,
      generateDescription: () => '',
      tabbedUI: true,
    }),
  ],
  endpoints: [
    {
      path: '/general',
      method: 'get',
      handler: async (req) => {
        req.payload.logger.info('Hitting endpoint /general')
        const data = await fetchGeneral(req.query.locale as LocaleCode, req.i18n)
        req.payload.logger.info(data, `Fetched data for general`)

        return Response.json({
          ok: true,
          ...data,
        })
      },
    },
    {
      path: '/page',
      method: 'get',
      handler: async (req) => {
        req.payload.logger.info('Hiiting endpoint /page')
        const [path, search] = (req.query.path as string).split('?')
        let params = new URLSearchParams(search)
        let safeParams

        try {
          safeParams = await safeProjectsParams(
            {
              page: params.get('page') ?? undefined,
              limit: params.get('limit') ?? undefined,
            },
            req.payload,
            req.locale as LocaleCode,
          )
        } catch (e) {
          return Response.json(
            {
              ok: false,
              message: e instanceof Error ? e.message : String(e),
            },
            {
              status: 400,
            },
          )
        }

        try {
          const data = await fetchPage(path, safeParams, req.i18n)
          req.payload.logger.info(data, `Fetched data for ${req.query.path}`)

          if (!data) {
            return Response.json(null, { status: 404 })
          }

          return Response.json({
            ok: true,
            ...data,
          })
        } catch (e) {
          console.error(`Error retrieving page for ${path}`, e)
          return Response.json(
            {
              ok: false,
              message: e instanceof Error ? e.message : String(e),
            },
            {
              status: 500,
            },
          )
        }
      },
    },
    {
      path: '/projects-list',
      method: 'get',
      handler: async (req) => {
        req.payload.logger.info('Hiiting endpoint /projects')

        let params = new URLSearchParams(req.search)
        let safeParams

        try {
          safeParams = await safeProjectsParams(
            {
              tag: params.getAll('tag'),
              page: params.get('page') ?? undefined,
              limit: params.get('limit') ?? undefined,
            },
            req.payload,
            req.locale as LocaleCode,
          )
        } catch (e) {
          return Response.json(
            {
              ok: false,
              message: e instanceof Error ? e.message : String(e),
            },
            {
              status: 400,
            },
          )
        }

        try {
          const data = await fetchProjects({
            locale: req.locale as LocaleCode,
            params: safeParams,
          })

          return Response.json({
            ok: true,
            ...data,
          })
        } catch (e) {
          console.error(`Error retrieving projects`, e)
          return Response.json(
            {
              ok: false,
              message: e instanceof Error ? e.message : String(e),
            },
            {
              status: 500,
            },
          )
        }
      },
    },
    {
      path: '/regenerate-media',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ message: 'Unauthorized' }, { status: 401 })
        }

        if (req.user.role !== 'admin') {
          return Response.json({ message: 'Forbidden' }, { status: 403 })
        }

        try {
          await regenerateMedia(req.payload, 'media')
          return Response.json({
            ok: true,
          })
        } catch (err) {
          return Response.json(
            {
              ok: false,
              message: err instanceof Error ? err.message : String(err),
            },
            {
              status: 500,
            },
          )
        }
      },
    },
    {
      path: '/cache',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ message: 'Unauthorized' }, { status: 401 })
        }

        if (req.user.role !== 'admin') {
          return Response.json({ message: 'Forbidden' }, { status: 403 })
        }

        try {
          invalidateAll()
          return Response.json({
            ok: true,
          })
        } catch (err) {
          return Response.json(
            {
              ok: false,
              message: err instanceof Error ? err.message : String(err),
            },
            {
              status: 500,
            },
          )
        }
      },
    },
  ],
})
