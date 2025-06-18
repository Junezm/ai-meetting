import { db } from '@/db';
import { agents } from '@/db/schema';
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from '../schema';
// import { TRPCError } from '@trpc/server';

export const agentsRouter = createTRPCRouter({
  // todo change getmany to use protectedProcedure
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agents);
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
    })
})