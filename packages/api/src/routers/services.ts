import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc/trpc'

export const servicesRouter = createTRPCRouter({
  availabilityCheck: publicProcedure
    .input(z.object({
      date: z.string(),
    }))
    .query(async ({ input }: { input: { date: string } }) => {
      // TODO: Integrate with actual availability database
      // For now, return mock data
      return {
        slots: [
          '9:00 AM',
          '10:00 AM',
          '11:00 AM',
          '2:00 PM',
          '3:00 PM',
          '4:00 PM'
        ]
      }
    }),
})
