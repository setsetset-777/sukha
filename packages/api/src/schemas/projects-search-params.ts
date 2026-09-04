import * as z from 'zod'

export const SearchParams = z.object({
  page: z.coerce.number().int().min(1).max(1000).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export const ServicesList = (services: string[]) => {
  return z.array(z.enum(services)).max(50).optional()
}

export type SearchParams = z.infer<typeof SearchParams>
