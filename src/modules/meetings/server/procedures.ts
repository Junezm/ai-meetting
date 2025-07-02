import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { meetingsInsertSchema, meetingsUpdateSchema } from '../schema';
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import z from 'zod';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/constants';
import { TRPCError } from '@trpc/server';
import { MeetingStatus } from '../types';
import { streamVideo } from '@/lib/stream-video';
import { generatedAvatarUri } from '@/lib/avatar';

export const meetingsRouter = createTRPCRouter({
  generateToken: protectedProcedure
    .mutation(async ({ ctx }) => {
      await streamVideo.upsertUsers([
        {
           id: ctx.auth.user.id,
           name: ctx.auth.user.name,
           role: 'admin',
           image: ctx.auth.user.image ?? generatedAvatarUri({ seed: ctx.auth.user.name, variants: "initials" }),
        }
      ]);

      const expirationTime = Math.floor(Date.now() / 1000) + 3600;
      const issueAt = Math.floor(Date.now() / 1000) - 60;
      const token = streamVideo.generateUserToken({
        user_id: ctx.auth.user.id,
        exp: expirationTime,
        validity_in_seconds: issueAt,
      });
      return token;
    }),
  // todo change getmany to use protectedProcedure
  getMany: protectedProcedure
    .input(z.object({
      page: z.number().default(DEFAULT_PAGE),
      pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
      search: z.string().nullish(),
      agentId: z.string().nullish(),
      status: z.enum([
        MeetingStatus.Upcoming,
        MeetingStatus.Active,
        MeetingStatus.Completed,
        MeetingStatus.Processing,
        MeetingStatus.Cancelled,
      ]).nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize, status, agentId } = input;


      const data = await db.select({
        ...getTableColumns(meetings),
        agent: agents,
        duration: sql<number>`extract(epoch from (ended_at - started_at))`.as('duration'),
      })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

    const [total] = await db
      .select({ count: count()})
      .from(agents)
      .where(
        and(
          eq(agents.userId, ctx.auth.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined,
          status ? eq(meetings.status, status) : undefined,
          agentId ? eq(meetings.agentId, agentId) : undefined,
        )
      )
    const totalPages = Math.ceil(total.count / pageSize);
    return {
      items: data,
      total: total.count,
      totalPages,
    };
  }),
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx}) => {
      // const { name, instructions } = input;
      // const { auth } = ctx;
      const [createMeetings] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();
      
      const call = streamVideo.video.call("default", createMeetings.id);
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            meetingId: createMeetings.id,
            meetingType: createMeetings.name,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on"
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });

      const [existAgent] = await db
        .select()
        .from(agents)
        .where(
          eq(agents.id, createMeetings.agentId)
        );
        
      if(!existAgent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agent not found',
        });
      }

      await streamVideo.upsertUsers([
        {
          id: existAgent.id,
          name: existAgent.name,
          role: "user",
          image: generatedAvatarUri({
            seed: existAgent.name,
            variants: "botttsNeutral",
          })
        }
      ]);
      
      return createMeetings;  
    }),
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
      const [existMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`extract(epoch from (ended_at - started_at))`.as('duration'),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id)
          )
        );

      if(!existMeeting) { 
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found',
        });
      }  

      return existMeeting;
    }),
  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [updateMeeting] = await db
        .update(meetings)
        .set(input)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if(!updateMeeting) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found',
        });
      }
      return updateMeeting;
  }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removeMeeting] = await db
        .update(meetings)
        .set(input)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if(!removeMeeting) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found',
        });
      }
      return removeMeeting;
  })
})