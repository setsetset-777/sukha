import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { localizedLabels } from '@/i18n'
import { invalidate, invalidatePrefix, tags } from '@/helpers/cache'
import type { CollectionConfig } from 'payload'
import { LocaleCode } from '@/types'

export const slug = 'projects'

export const Projects: CollectionConfig = {
  slug,
  versions: {
    drafts: true,
  },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'mainImage', '_status', 'featured'],
  },
  labels: localizedLabels.collections.projects,
  fields: [
    titleField(),
    ...urlFields({ source: 'title', slug }),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: {
        fr: 'Mis en avant',
        en: 'Featured',
      },
      admin: {
        description: {
          fr: "Cocher pour afficher le projet sur la page d'accueil",
          en: 'check to display project on home page',
        },
        components: {
          Cell: '@/components/CollectionListCheck',
        },
      },
    },
    {
      name: 'text',
      type: 'richText',
      label: localizedLabels.fields.text,
      localized: true,
    },
    {
      name: 'place',
      type: 'text',
      localized: true,
    },
    {
      name: 'mainImage',
      type: 'upload',
      label: {
        en: 'Main image',
        fr: 'Image principale',
      },
      relationTo: 'media',
      admin: {
        description: {
          en: 'The image used to represent the project, eg. on the project list or the project hero.',
          fr: "L'image utilisée pour représenter le projet, par exemple sur la liste de projets ou l'entête de la page du projet.",
        },
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'projectTags',
      hasMany: true,
    },
    {
      name: 'specs',
      type: 'array',
      label: localizedLabels.collections.projectSpecs?.plural,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: localizedLabels.fields.title,
          localized: true,
        },
        {
          name: 'values',
          type: 'array',
          labels: {
            singular: {
              en: 'Value',
              fr: 'Valeur',
            },
            plural: {
              en: 'Values',
              fr: 'Valeurs',
            },
          },
          localized: true,
          fields: [
            {
              name: 'item',
              type: 'text',
              label: {
                en: 'Value',
                fr: 'Valeur',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      label: {
        en: 'Gallery',
        fr: 'Gallerie',
      },
      labels: {
        plural: {
          en: 'Images',
          fr: 'Images',
        },
        singular: {
          en: 'Image',
          fr: 'Image',
        },
      },
      admin: {
        components: {
          beforeInput: ['/components/GalleryBulkAdd'],
        },
      },

      fields: [
        {
          name: 'image',
          type: 'upload',
          label: {
            en: 'Image',
            fr: 'Image',
          },
          relationTo: 'media',
          hasMany: false,
          required: true,
        },
        {
          name: 'fullwidth',
          type: 'checkbox',
          label: {
            en: 'Force image display to full width',
            fr: "Forcer l'image en pleine largeur",
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: {
            en: 'Description',
            fr: 'Description',
          },
          admin: {
            condition: (data, siblingData) => siblingData.fullwidth === true,
          },
          localized: true,
        },
      ],
    },
    {
      name: 'before',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Before gallery ',
        fr: 'Gallerie avant',
      },
      hasMany: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ req, doc }) => {
        invalidatePrefix('projects')
        invalidatePrefix('projectList')
        invalidate(tags.routes())
        invalidate(tags.project(doc.id, req.locale as LocaleCode))
        invalidate(tags.partners(req.locale as LocaleCode))
      },
    ],
  },
}
