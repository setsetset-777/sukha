import * as z from 'zod'

export const ProjectsSearchParams = z.object({
  tag: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(50)
        .regex(/^[a-z0-9-]+$/i, 'invalid tag format'),
    )
    .max(20, 'too many tags')
    .optional(),
  page: z.coerce.number().int().min(1).max(1000).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export const TagList = (tags: string[]) => {
  return z.array(z.enum(tags)).max(50).optional()
}

export type ProjectsSearchParams = z.infer<typeof ProjectsSearchParams>
