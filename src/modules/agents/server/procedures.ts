import { db } from '@/db';
import { agents } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from '../schema';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import z from 'zod';

export const agentsRouter = createTRPCRouter({
  // todo change getmany to use protectedProcedure
  getMany: protectedProcedure.query(async () => {
    const data = await db.select({
      meetingCount: sql<number>`5`,
      ...getTableColumns(agents),
    }).from(agents);
    // await new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve(1);
    //     }, 3000)
    // })
    // throw new TRPCError({ code: 'BAD_REQUEST' });
    return data;
  }),
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx}) => {
      // const { name, instructions } = input;
      // const { auth } = ctx;
      const [createAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createAgent;  
    }),
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const [existAgent] = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(eq(agents.id, input.id));

      return existAgent;
    })
})