import rootConfig from '../../eslint.config.mjs'

export default [
  ...rootConfig,
  {
    ignores: ['.next/', 'src/payload-types.ts', 'src/payload-generated-schema.ts'],
  },
]
